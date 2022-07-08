<template>
  <div class="offline-orthomosaics">
    <!-- <div class="title">Mosaicos offline</div> -->

    <div
      class="noOrthomosaic"
      v-if="orthomosaicList.length<=0"
    >Não existe ortomosaicos para este mapa</div>

    <ul class="orthomosaics-list">
      <li
        class="orthomosaic"
        v-for="(orthomosaic, index) in orthomosaicList"
        :key="'orthomosaic-' + index"
        v-bind:class="{ caching: orthomosaic.caching }"
      >
        <div class="mosaic-type">
          <div class="icon">
            <i class="fas fa-map" v-if="orthomosaic.object.type === 'orthophoto'"></i>
            <i class="fas fa-map" v-if="orthomosaic.object.type === 'dsm'"></i>
            <i class="fas fa-map" v-if="orthomosaic.object.type === 'dtm'"></i>
          </div>

          <div class="name">
            <div v-if="orthomosaic.object.type === 'orthophoto'">Ortofoto</div>
            <div v-if="orthomosaic.object.type === 'dsm'">Modelo de superfície</div>
            <div v-if="orthomosaic.object.type === 'dtm'">Modelo de terreno</div>
          </div>
        </div>

        <div class="controls is-pulled-right">
          <div
            class="cache-mosaic"
            v-if="
              !orthomosaic.cached &&
                !orthomosaic.removing &&
                !orthomosaic.caching &&
                !orthomosaic.verifying

            "
            @click="cacheTiles(orthomosaic)"
          >
            <b-tooltip position="is-left" label="Baixar mosaico" type="is-dark" animated>
              <i class="fas fa-download"></i>
            </b-tooltip>
          </div>

          <!-- <div
            class="check-cache"
            v-if="
              !orthomosaic.verifying &&
                !orthomosaic.caching &&
                !orthomosaic.removing
            "
            @click="cacheStatus(orthomosaic)"
          >
            <b-tooltip
              label="Verificar estado do mosaico offline"
              type="is-dark"
              animated
            >
              <i class="fas fa-eye"></i>
            </b-tooltip>
          </div>-->

          <div
            class="delete-cache"
            v-if="
              orthomosaic.cached &&
                !orthomosaic.removing &&
                !orthomosaic.caching &&
                !orthomosaic.verifying
            "
            @click="removeOrthomosaic(orthomosaic)"
          >
            <b-tooltip
              label="Apagar mosaico do dispositivo"
              type="is-dark"
              position="is-left"
              animated
            >
              <i class="fas fa-trash"></i>
            </b-tooltip>
          </div>
        </div>

        <div class="status">
          Status:
          <span>{{ orthomosaic.status }}</span>

          <i v-if="orthomosaic.verifying" class="fas fa-cog fa-spin"></i>
          <div class="errors" v-if="!orthomosaic.verifying">
            <div
              class="erro"
              v-for="(erro, index) in orthomosaic.errors"
              :key="'erro-' + index"
            >{{ erro.message }}</div>
          </div>
        </div>

        <div class="caching-progress" v-if="orthomosaic.caching">
          <div class="warning">
            <i class="fas fa-exclamation-triangle"></i> Não saia desta página
            antes de finalizar!
          </div>
          <b-progress
            class="progress-bar"
            format="percent"
            size="is-small"
            type="is-success"
            :max="100"
            :value="
              getPercent(
                orthomosaic.cacheProgress,
                orthomosaic.object.tilesCount
              )
            "
            :show-value="true"
          ></b-progress>
          <div class="progress-status">
            {{ orthomosaic.progressStatus }}
            <i class="fas fa-spinner fa-pulse"></i>
          </div>
        </div>

        <div class="removing-progress" v-if="orthomosaic.removing">
          <div class="warning">
            <i class="fas fa-exclamation-triangle"></i> Não saia desta página
            antes de finalizar!
          </div>
          <b-progress
            class="progress-bar"
            format="percent"
            size="is-small"
            type="is-success"
            :show-value="true"
            :max="100"
            :value="
              getPercent(
                orthomosaic.removingProgress,
                orthomosaic.removingTotal
              )
            "
          ></b-progress>
          <div class="removing-status">
            Removendo
            <i class="fas fa-spinner fa-pulse"></i>
          </div>
        </div>
      </li>
    </ul>

    <div class="controlButtons">
      <b-button class="cancelbt is-primary is-pulled-left" @click="back()">Voltar</b-button>
    </div>
  </div>
</template>

<script>
import PouchDB from "pouchdb";
PouchDB.plugin(require("pouchdb-find").default);

export default {
  name: "offline-orthomosaics",
  props: {
    orthomosaics: {
      type: Array,
      default: []
    },
    plan: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      total: 0,
      progress: 0,
      db: null,
      orthomosaicList: []
    };
  },
  mounted() {},
  created() {
    this.db = new PouchDB("offline-tiles");
    this.orthomosaics.forEach(orthomosaic => {
      this.orthomosaicList.push({
        _id: orthomosaic._id,
        errors: [],
        status: "verificando",
        cached: false,
        caching: false,
        removing: false,
        verifying: false,
        countError: false,
        cacheProgress: 0,
        removingTotal: 0,
        removingProgress: 0,
        progressStatus: "aguardando",
        object: orthomosaic
      });

      this.cacheStatus(this.orthomosaicList[this.orthomosaicList.length - 1]);
    });
  },
  computed: {
    userFolder() {
      return `${this.$store.state.auth.user.email}_${this.$store.state.auth.user.id}`;
    },
    getLoggedUser() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    getPercent(current, total) {
      return (100 * current) / total;
    },
    async cacheStatus(orthomosaic) {
      // console.log("verificando");
      orthomosaic.verifying = true;
      orthomosaic.errors = [];

      // await this.db.createIndex({
      //   index: { fields: ["orthomosaicId"] }
      // });

      let tiles = await this.db.find({
        selector: {
          orthomosaicId: orthomosaic._id,
          offline: true
        }
      });

      let attachmentErrors = [];

      tiles.docs.forEach((tile, index) => {
        this.db.get(tile._id, { attachments: true }).then(function(doc) {
          if (
            tile._attachments.tile.content_type != "image/png" ||
            tile._attachments.tile.data == null ||
            tile._attachments.tile.data == "null" ||
            tile._attachments.tile.data == undefined
          ) {
            attachmentErrors.push(tile);
          }
        });
      });

      let totalexpected = orthomosaic.object.tilesCount;
      let tileStatus,
        tileAttachment,
        cache = false;

      if (tiles.docs.length === totalexpected) {
        tileStatus = true;
        cache = true;

        // console.log("Contagem de tiles correta");
      } else if (tiles.docs.length === 0) {
        // console.log("Contagem de tiles = 0");
        cache = false;
      } else {
        tileStatus = false;
        cache = true;

        // orthomosaic.errors.push({
        //   code: "tileCountError",
        //   message: `Contagem de tiles incorreta (${tiles.docs.length} de ${totalexpected})`
        // });

        // console.log(
        //   "Contagem de tiles incorreta",
        //   tiles.docs.length,
        //   totalexpected
        // );
      }

      if (cache) {
        if (attachmentErrors.length == 0) {
          tileAttachment = true;

          // console.log("Todos os tiles possuem attachment");
        } else {
          tileAttachment = false;

          // orthomosaic.errors.push({
          //   code: "attachmentError",
          //   message: `${attachmentErrors.length} tiles não possuem attachment de ${totalexpected})`
          // });
          // console.log(
          //   "Nem todos os tiles possuem attachment",
          //   attachmentErrors.length,
          //   attachmentErrors
          // );
        }

        if (tileStatus && tileAttachment) {
          orthomosaic.status = "baixado";
          orthomosaic.cached = true;
        } else {
          // orthomosaic.status = "erro";
          orthomosaic.status = "não baixado";
          orthomosaic.cached = false;
        }
      } else {
        orthomosaic.status = "não baixado";
        orthomosaic.cached = false;
      }

      orthomosaic.verifying = false;
    },
    async removeOrthomosaic(orthomosaic, progress = true) {
      orthomosaic.removingTotal = 0;
      orthomosaic.removingProgress = 0;
      // console.log("deleting");
      if (progress) {
        orthomosaic.removing = true;
      }
      orthomosaic.status = "removendo";

      return new Promise(async (resolve, reject) => {
        let tiles = await this.db.find({
          selector: {
            orthomosaicId: orthomosaic._id
          }
        });

        // console.log(tiles.docs.length);
        orthomosaic.removingTotal = tiles.docs.length;

        if (tiles.docs.length != 0) {
          var promise = new Promise(async (resolve, reject) => {
            tiles.docs.forEach(async (tile, index) => {
              await this.db.remove(tile);
              orthomosaic.removingProgress = orthomosaic.removingProgress + 1;

              if (index === tiles.docs.length - 1) resolve();
            });
          });

          promise.then(() => {
            orthomosaic.status = "não baixado";
            orthomosaic.removing = false;
            orthomosaic.cached = false;
            orthomosaic.errors = [];

            // console.log("deletion concluded");
            resolve();
          });
        } else {
          orthomosaic.removing = false;
          resolve();
        }
      });
    },
    cacheTiles(orthomosaic) {
      orthomosaic.caching = true;
      orthomosaic.errors = [];
      orthomosaic.cacheProgress = 0;
      return new Promise(async (resolve, reject) => {
        // console.log("removing");

        orthomosaic.progressStatus = "Limpando cache";

        await this.removeOrthomosaic(orthomosaic, false);
        // console.log("removed");
        orthomosaic.status = "baixando";

        let bounds;
        let bbox;

        if (
          orthomosaic.object.geometrys &&
          orthomosaic.object.geometrys.length > 0
        ) {
          bounds = orthomosaic.object.geometrys.map(g => [
            g.latitude,
            g.longitude
          ]);
          bbox = L.latLngBounds(
            L.latLng(bounds[0][0], bounds[0][1]),
            L.latLng(bounds[2][0], bounds[1][1])
          );
        } else {
          bounds = orthomosaic.object.bounds;

          bbox = L.latLngBounds(
            L.latLng(bounds[0][0], bounds[0][1]),
            L.latLng(bounds[2][0], bounds[1][1])
          );
          // bbox = L.latLngBounds(
          //   L.latLng(bounds[0][0], bounds[0][1]),
          //   L.latLng(bounds[1][0], bounds[1][1]),
          //   L.latLng(bounds[2][0], bounds[2][1]),
          //   L.latLng(bounds[3][0], bounds[3][1])
          // );
        }

        let minZoom = 12;
        let maxZoom = 20;

        let databaseUrl;
        if (orthomosaic.object.mbTileUrl) {
          databaseUrl = orthomosaic.object.mbTileUrl;
        } else {
          databaseUrl =
            "https://www.googleapis.com/storage/v1/b/storage-vantum/o/user_data%2F" +
            this.userFolder +
            "%2Forthomosaics%2F" +
            orthomosaic.object._id +
            "%2Ftiles%2Ftiles.mbtiles?alt=media";
        }

        // this.fire("download-start");
        // console.log("download-start");

        orthomosaic.progressStatus = "Baixando tiles";

        fetch(databaseUrl)
          .then(response => {
            return response.arrayBuffer();
          })
          .then(async buffer => {
            // console.log("package downloaded");
            // this.fire("download-finish");
            this._openDB(buffer);

            // let z = 14;
            let progress = 0;
            let totalProgress = 0;
            let count = this.getMbTileCount();

            orthomosaic.progressStatus = `Salvando ${count} tiles`;

            var result = new Promise(async (resolve, reject) => {
              for (let z = minZoom; z <= maxZoom; z++) {
                const min = await new Promise(resolve =>
                  this.$root.$emit(
                    "projectMinBound",
                    bbox.getNorthWest(),
                    z,
                    resolve
                  )
                );

                const max = await new Promise(resolve =>
                  this.$root.$emit(
                    "projectMaxBound",
                    bbox.getSouthEast(),
                    z,
                    resolve
                  )
                );

                const max_y = Math.pow(2, z) - 1;
                for (let i = min.x; i <= max.x; i++) {
                  for (let j = min.y; j <= max.y; j++) {
                    let coords = new L.Point(i, j);
                    coords.z = z;

                    // Check if layer is WMS or TMS, tileLayer.options.tms is used as an example
                    // if (this.options.tms) {
                    coords.y = max_y - coords.y;
                    // }
                    // console.log(this.options.tms, max_y);

                    let url = L.Util.template(
                      orthomosaic.object.tilesUrl,
                      coords
                    );
                    // console.log(coords);

                    let blob = await this.getMbTileBlob(coords).then(
                      async blob => {
                        if (blob != null) {
                          await this._saveTileFromBlob(
                            orthomosaic.object,
                            url,
                            null,
                            blob
                          ).then(() => {
                            progress = progress + 1;
                            // console.log("download-progress", progress);

                            orthomosaic.progressStatus = `Salvando ${progress} de ${count} tiles`;
                            orthomosaic.cacheProgress = progress;
                          });
                        }
                      }
                    );
                  }
                }
                if (z >= maxZoom) resolve();
              }
            });

            await result.then(async () => {
              orthomosaic.progressStatus = `Gerando índices`;
              await this.db.createIndex({
                index: { fields: ["orthomosaicId"] }
              });

              orthomosaic.caching = false;
              orthomosaic.status = "baixado";
            });
          })
          .catch(err => {
            // this.fire("databaseerror", { error: err });
            orthomosaic.status = "erro";
            orthomosaic.caching = false;

            if (
              !orthomosaic.object.mbTileUrl ||
              orthomosaic.object.mbTileUrl == ""
            ) {
              // console.log("create-task", this.createTask);

              this.$store.dispatch("editOrthomosaic", {
                mbTileUrl: "waiting",
                ...orthomosaic.object
              });

              this.createTask({
                job: { tile: true },
                status: "waiting",
                orthomosaic: orthomosaic.object._id,
                plan: this.plan._id
              });
            }

            orthomosaic.errors.push({
              code: "downloadError",
              message: `Erro ao efetuar o download do mosaico. Estamos reprocessando seu mapa, avisaremos por email quando o mapa estiver disponível para download.`
            });

            console.log("databaseerror");
          });
        resolve();
      });
    },
    async _saveTileFromBlob(orthomosaic, tileUrl, existingRevision, blob) {
      let self = this;

      var expireIn = 6; //months
      var expireAt = new Date();
      expireAt.setMonth(expireAt.getMonth() + expireIn);

      // console.log("saving tile: ", tileUrl, blob);
      return new Promise(async (resolve, reject) => {
        await this.db
          .put({
            _id: tileUrl,
            _rev: existingRevision,
            orthomosaicId: orthomosaic._id,
            timestamp: Date.now(),
            expireAt: expireAt,
            offline: true
          })
          .then(async status => {
            await this.db.putAttachment(
              tileUrl,
              "tile",
              status.rev,
              blob,
              "image/png"
            );
            // console.log("pouch put done");
            resolve();
          })
          .catch(async err => {
            // Saving the tile to the cache might have failed,
            // but the tile itself has been loaded.
            console.log("error on pouch put", err);
            resolve();
          });
      });
    },

    createTask: function(task) {
      console.log("create-task");
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("postTask", task)
          .then(task => {
            resolve(task);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    getMbTileBlob: function(coords) {
      // console.log("getting mb tile url");
      return new Promise(async (resolve, reject) => {
        var row = this._stmt.getAsObject({
          ":x": coords.x,
          // ":y": this._globalTileRange.max.y - coords.y,
          ":y": coords.y,
          ":z": coords.z
        });

        // console.log("row: ", row);

        if ("tile_data" in row) {
          resolve(new Blob([row.tile_data], { type: "image/png" }));
        } else {
          resolve(null);
        }
      });
    },
    getMbTileCount: function(coords) {
      return this._count[0].values[0][0];
    },
    _openDB: function(buffer) {
      // console.log("start load mbdb", buffer);
      try {
        /// This assumes the `SQL` global variable to exist!!
        this._MBdb = new SQL.Database(new Uint8Array(buffer));
        // console.log("MBdb: ", this._MBdb);
        this._stmt = this._MBdb.prepare(
          "SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row = :y"
        );
        this._count = this._MBdb.exec("SELECT COUNT() as count FROM tiles");

        // 🍂event databaseloaded
        // Fired when the database has been loaded, parsed, and ready for queries
        // this.fire("databaseloaded");
        // console.log("databaseloaded");
        this._databaseIsLoaded = true;
      } catch (ex) {
        console.log("fail load mbdb", ex);
        // 🍂event databaseloaded
        // Fired when the database could not load for any reason. Might contain
        // an `error` property describing the error.
        // this.fire("databaseerror", { error: ex });
        console.log("databaseerror");
      }
    },
    back() {
      this.$parent.orthomosaicOffline = false;
    }
  }
};
</script>

<style lang="scss">
.offline-orthomosaics {
  .title {
    font-size: 22px;
    text-align: center;
    width: 100%;
    display: inline-block;
  }
  .cancelbt {
    margin-right: 20px;
  }

  .orthomosaics-list {
    .orthomosaic {
      padding: 15px 10px;
      position: relative;
      background: white;
      border-radius: 2px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      margin-bottom: 10px;
      // transition: all 1s linear;
      transition: max-height 1s ease-in-out;
      // max-height: 60px;

      // &.caching {
      //   max-height: 106px;
      // }

      .mosaic-type {
        display: inline-block;

        .icon {
          display: inline-block;
          margin: 0px 5px;
          font-size: 20px;
          color: #2c3e50;
        }

        .name {
          display: inline-block;
          font-size: 15px;
          line-height: 15px;
          font-weight: bold;
        }
      }

      .controls {
        display: inline-block;
        text-align: right;
        transform: translateY(50%);

        .cache-mosaic {
          display: inline;
          cursor: pointer;
          color: var(--color-light);
          margin: 0 5px;
          font-size: 20px;
        }

        .check-cache {
          display: inline;
          cursor: pointer;
          color: var(--color-light);
          margin: 0 5px;
          font-size: 20px;
        }

        .delete-cache {
          display: inline;
          cursor: pointer;
          color: var(--color-light);
          margin: 0 5px;
          font-size: 20px;
        }
      }

      .status {
        span {
          color: var(--color-light);
          margin-right: 10px;
        }
        .errors {
          font-size: 12px;
          color: red;
          margin-top: 5px;
        }
      }

      .caching-progress {
        margin: 15px 0 0 0;

        .progress-bar {
          margin-bottom: 2px;

          .progress {
            margin-bottom: 0 !important;
          }
        }

        .progress-status {
          font-size: 11px;
          color: #666;
          text-align: center;
          width: 100%;
          i {
            line-height: 13px;
          }
        }

        .warning {
          font-size: 11px;
          text-align: center;
          width: 100%;
          color: #333;
          background: #fcd12a;
          margin-bottom: 10px;

          i {
            line-height: 13px;
          }
        }
      }

      .removing-progress {
        margin: 15px 0 0 0;

        .progress-bar {
          margin-bottom: 2px;

          .progress {
            margin-bottom: 0 !important;
          }
        }

        .removing-status {
          font-size: 11px;
          color: #666;
          text-align: center;
          width: 100%;

          i {
            line-height: 13px;
          }
        }

        .warning {
          font-size: 11px;
          text-align: center;
          width: 100%;
          color: #333;
          background: #fcd12a;
          margin-bottom: 10px;

          i {
            line-height: 13px;
          }
        }
      }
    }
  }

  .controlButtons {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
