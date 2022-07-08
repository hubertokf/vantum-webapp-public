<template>
  <div class="plan-details" v-if="plan">
    <div class="content">
      <div class="created">
        <div class="date">
          <i class="fas fa-calendar-alt"></i>
          {{ plan.createdAt | moment("DD/MM/YYYY HH:mm") }}
        </div>

        <div class="owner">
          <i class="fas fa-user-alt"></i>
          {{ plan.owner.firstName }}
        </div>
      </div>

      <b-button
        class="go-map is-primary"
        @click="goToMap()"
        v-if="$isMobile"
      >
        <i class="fas fa-map"></i>
        Ver Mapa
      </b-button>

      <div class="status">
        <strong>Status:</strong>
        <div class="value">{{ getStatus }}</div>
      </div>

      <div class="planDate">
        <strong>Data de voo:</strong>
        {{ plan.planDate | moment("DD/MM/YYYY") }}
      </div>

      <div class="description attribute">
        <strong>Descrição:</strong>
        {{ plan.description }}
      </div>

      <orthomosaic-selector :key="orthomosaicsKey"></orthomosaic-selector>

      <b-collapse class="tools" :open.sync="openTools">
        <div slot="trigger" class="header" role="button">
          <p class="title">Anotações</p>
          <a class="icon">
            <i
              class="fas"
              :class="openTools ? 'fa-angle-down' : 'fa-angle-right'"
            ></i>
          </a>
        </div>
        <div class="content">
          <!-- <map-tools></map-tools> -->

          <annotations
            :annotationList="plan.annotations"
            :key="'plan-' + plan._id + '-annotations'"
          ></annotations>
        </div>
      </b-collapse>

      <b-collapse class="album" v-if="plan.album" :open.sync="openAlbum">
        <div slot="trigger" class="header" role="button">
          <p class="title">Album/Dataset</p>
          <a class="icon">
            <i
              class="fas"
              :class="openAlbum ? 'fa-angle-down' : 'fa-angle-right'"
            ></i>
          </a>
        </div>
        <div class="content">
          <album-thumbnails
            :album="plan.album"
            v-show="openAlbum"
          ></album-thumbnails>
        </div>
        <!-- <div class="content">
          <div class="thumbnails">
            <div class="photo" v-for="photo in plan.album.images" :key="photo.id">
              <img src="" alt="">
            </div>
          </div>
        </div>-->
      </b-collapse>
    </div>

    <!-- <div class="add">
      <div v-if="addClicked" class="addExpansion">
        <div class="addItem" @click="addOrthomosaic">
          Adicionar
        </div>
        <div class="addItem" @click="createOrthomosaic">
          Criar HH:mm
        </div>createdAt
    </div>-->
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import AlbumThumbnails from "../album/AlbumThumbnails";
import MapTools from "../MapTools";
import Annotations from "./Annotations";
import OrthomosaicSelector from "./OrthomosaicSelector";

export default {
  name: "plan-details",
  props: {
    plan: {
      type: Object
    }
  },
  data() {
    return {
      openTools: true,
      openAlbum: false,
      album: {},
      orthomosaicsKey: 0
    };
  },
  components: {
    NavigationMenu,
    "map-tools": MapTools,
    "album-thumbnails": AlbumThumbnails,
    "orthomosaic-selector": OrthomosaicSelector,
    annotations: Annotations
  },
  async mounted() {
    this.$root.$on("toggleOrthomosaics", () => {
      this.orthomosaicsKey++;
    });

    this.updateOrthomosaics(this.plan.orthomosaics);
    this.$store.dispatch("setCurrentPlan", this.plan);
    // this.$store.dispatch('getAlbum', this.plan.album)
    // .then((album) => {
    //   this.album = album
    // })
    // console.log(this.plan)
    // if (this.plan.orthomosaics != []){
    //   this.$store.dispatch('setCurrentOrthomosaic', this.plan.orthomosaics[0])
    // }
  },
  methods: {
    goToMap() {
      this.$store.dispatch("toggleSidebar");
    },
    async updateOrthomosaics(orthos) {
      this.$root.$emit("clear-orthomosaics");

      if (orthos != null) {
        orthos.forEach((orthomosaic, index) => {
          if (index == 0) {
            orthomosaic.selected = true;
          } else {
            orthomosaic.selected = false;
          }
          orthomosaic.opacity = 1;
        });
        // orthos = plan.orthomosaics
      } else {
        orthos = [];
      }

      await this.$store.dispatch("setOrthomosaics", orthos);

      if (this.$store.getters.getOrthomosaics.length) {
        var location = {
          altitude: 14,
          latitude: this.$store.getters.getOrthomosaics[0].image.location
            .latitude,
          longitude: this.$store.getters.getOrthomosaics[0].image.location
            .longitude
        };

        if (
          this.$store.getters.getOrthomosaics[0].bounds &&
          this.$store.getters.getOrthomosaics[0].bounds.length > 0
        ) {
          // let positions = [
          //   this.$store.getters.getOrthomosaics[0].geometrys.map(geo => [
          //     geo.latitude,
          //     geo.longitude
          //   ])
          // ];

          this.$root.$emit(
            "fit-bounds",
            this.$store.getters.getOrthomosaics[0].bounds
          );
        } else {
          this.centerMap(location);
        }
        this.$root.$emit(
          "add-orthomosaic",
          this.$store.getters.getOrthomosaics[0]
        );

        if (this.$store.getters.getActiveOrthomosaics.length == 0) {
          if (!this.isActive(this.$store.getters.getOrthomosaics[0])) {
            this.$store.dispatch(
              "setActiveOrthomosaics",
              this.$store.getters.getOrthomosaics[0]
            );
          }
        }
      }
    },
    centerMap(coords) {
      this.$root.$emit("centerMap", coords);
    },
    isActive(ref) {
      var index = this.$store.getters.getActiveOrthomosaics.findIndex(
        orthomosaic => orthomosaic.id === ref.id
      );

      if (index != -1) {
        return true;
      }
      return false;
    }
  },
  computed: {
    orthomosaics: {
      get() {
        return this.$store.getters.getOrthomosaics;
      },
      set(value) {
        this.$store.dispatch("setOrthomosaics", value);
      }
    },
    getStatus() {
      if (this.plan.tasks != undefined && this.plan.tasks.lenght > 0) {
        switch (this.plan.tasks[0].status) {
          case "waiting":
            return "Aguardando";
          case "waiting_payment":
            return "Aguardando pagamento";
          case "tiling":
            return "Otimizando";
          case "processing":
            return "Processando";
          case "initializing":
            return "Iniciando processamento";
          case "completed":
            return "Completo";
          default:
            return "Aguardando";
        }
      } else {
        return "Aguardando";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.plan-details {
  overflow-y: auto;
  position: relative;
  // min-height: 100%;
  width: 100%;
  overflow-x: hidden;

  &::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 8px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    // border-radius: 10px;
    background-color: #888;
  }
  .add {
    position: absolute;
    bottom: 70px;
    right: 30px;
    margin-top: 8px;
    margin-left: 8px;
    margin-right: 5px;
    width: 50px;

    .addExpand {
      right: 0;
      position: absolute;
      background: #006746;
      border-radius: 8px;
      text-align: center;
      color: white;
      font-size: 16px;
      font-weight: bold;
      padding: 0 10px;
      line-height: 35px;
      /* width: 50px; */
      /* height: 50px; */
      -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
        rgba(0, 0, 0, 0.14) 0px 6px 10px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
        rgba(0, 0, 0, 0.14) 0px 6px 10px 0px,
        rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
      cursor: pointer;
    }

    .addExpansion {
      position: absolute;
      top: -60px;
      right: 0;
      font-size: 14px;
      width: 80px;
      text-align: right;

      .addItem {
        display: block;
        background: var(--color-light);
        border-radius: 8px;
        padding: 0 10px;
        text-align: center;
        color: white;
        cursor: pointer;
        margin-bottom: 10px;
      }
    }
  }

  .content {
    // padding: 0 10px;

    .button.go-map {
      margin-top: 0;
      margin-bottom: 20px;
      background-color: var(--color-light);
      width: 100%;
    }

    h6 {
      margin-top: 20px;
      margin-bottom: 15px;
    }

    .description {
      margin-bottom: 20px;
    }

    .planDate {
      margin-bottom: 20px;
    }

    .status {
      margin-bottom: 20px;

      .value {
        display: inline-block;
        font-weight: bold;
        margin-left: 5px;
        text-transform: uppercase;
        color: var(--color-dark);
      }
    }

    .created {
      font-size: 12px;
      margin-bottom: 20px;
      width: 100%;
      text-align: center;

      .date {
        display: inline;

        i {
          color: var(--color-dark);
        }
      }

      .owner {
        display: inline;
        margin-left: 15px;

        i {
          color: var(--color-dark);
        }
      }
    }

    .tools {
      margin-bottom: 20px;

      .header {
        .title {
          font-size: 16px;
          font-weight: normal;
          display: inline-block;
        }
        .icon {
          margin-left: 5px;
          color: black;
        }
      }
      .content {
        padding: 0 0px;
      }
    }

    .album {
      .header {
        .title {
          font-size: 16px;
          font-weight: normal;
          display: inline-block;
        }
        .icon {
          margin-left: 5px;
          color: black;
        }
      }
      .content {
        padding: 0;

        .thumbnails {
          max-height: 150px;
          overflow-y: auto;

          &::-webkit-scrollbar-track {
            background-color: #f5f5f5;
          }

          &::-webkit-scrollbar {
            width: 8px;
            background-color: #f5f5f5;
          }

          &::-webkit-scrollbar-thumb {
            // border-radius: 10px;
            background-color: #888;
          }

          .photo {
            display: inline-block;
            background-color: #888;
            height: 55px;
            width: 55px;
            margin-right: 5px;
            margin-bottom: 5px;

            img {
            }
          }
        }
      }
    }

    .button {
      margin-top: 20px;
      background-color: var(--color-light);
    }
  }
}
</style>
