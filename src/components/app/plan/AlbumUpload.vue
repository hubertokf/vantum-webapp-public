<template>
  <div class="album-form">
    <div class="content" v-bind:class="{ hidden: view == 'form' }">
      <h6>Envie suas imagens</h6>
      <div
        class="georefWarning warning"
        v-if="showDropzone"
      >Atenção, envie apenas imagens georreferenciadas.</div>

      <file-upload
        @sending-success="file => successEvent(file)"
        @queue-complete="file => vqueueComplete(file)"
        :showDropzone="showDropzone"
        :uploadPath="'user_data/' + userFolder + '/albums/' + album.id + '/'"
        :showButton="false"
        :makeThumbnails="true"
        :autoStartUpload="false"
        :maxUpload="-1"
        :types="'.jpg,.jpeg,.JPG,.JPEG'"
        ref="fileUpload"
      ></file-upload>
    </div>

    <div class="content" v-bind:class="{ hidden: view == 'upload' }">
      <b-field
        label="Nome"
        :type="{ 'is-danger': errors.has('name') }"
        :message="errors.first('name')"
      >
        <b-input
          v-model="albumToUpdate.name"
          v-validate="'required'"
          name="name"
          placeholder="Nome do Album"
        ></b-input>
      </b-field>

      <div class="columns is-mobile">
        <div class="column">
          <b-field
            label="Tipo de Camera"
            :type="{ 'is-danger': errors.has('CameraType') }"
            :message="errors.first('CameraType')"
          >
            <b-select
              placeholder="Selecione"
              expanded
              v-model="albumToUpdate.camera"
              v-validate="'required'"
              name="CameraType"
            >
              <option
                v-for="typeCam in listCameraType"
                :value="typeCam.name"
                :key="typeCam.id"
              >{{ typeCam.name }}</option>
            </b-select>
          </b-field>
        </div>
        <div class="column">
          <b-field
            label="Tipo de Imagens"
            :type="{ 'is-danger': errors.has('AlbumType') }"
            :message="errors.first('AlbumType')"
          >
            <b-select
              placeholder="Selecione"
              expanded
              v-model="albumToUpdate.type"
              v-validate="'required'"
              name="AlbumType"
            >
              <option
                v-for="typeAlbum in listAlbumType"
                :value="typeAlbum.name"
                :key="typeAlbum.id"
              >{{ typeAlbum.name }}</option>
            </b-select>
          </b-field>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <b-field
            label="Vant utilizado"
            :type="{ 'is-danger': errors.has('drone') }"
            :message="errors.first('drone')"
          >
            <b-select
              placeholder="Selecione"
              expanded
              v-model="albumToUpdate.drone"
              v-validate="'required'"
              name="drone"
            >
              <option v-for="vant in vants" :value="vant" :key="vant">
                {{
                vant
                }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Data do voo">
            <b-datepicker
              placeholder="Digite ou selecione uma data..."
              v-model="albumToUpdate.flightDate"
              icon="calendar-today"
              editable
            ></b-datepicker>
          </b-field>
        </div>
      </div>

      <b-field label="Descrição">
        <b-input maxlength="150" v-model="albumToUpdate.description" type="textarea"></b-input>
      </b-field>
    </div>
    <div class="controlButtons" v-bind:class="{ hidden: view == 'upload' }">
      <b-field>
        <b-button class="button next-bt is-primary is-pulled-right" @click="saveAlbumData">Salvar</b-button>
      </b-field>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import FileUpload from "../FileUpload";
import { EXIFREADER } from "../../../vendor/exif.js";
export default {
  name: "album-form",
  components: {
    NavigationMenu,
    "file-upload": FileUpload
  },
  props: {
    step: {
      type: String,
      default: "upload"
    },
    albumObj: {
      type: Object,
      default: null
    },
    showDropzone: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      view: "upload",
      uploading: false,
      formCompleted: false,
      queueComplete: false,

      vants: [
        "Batmap",
        "Zangão",
        "Phantom",
        "Mavic",
        "Phantom II",
        "Phantom III",
        "Phantom IV",
        "Phantom IV PRO",
        "Phantom IV Advanced",
        "Maptor",
        "Echar 20D",
        "Arator 5B",
        "Outro, Qual?"
      ],
      album: {
        _id: null,
        id: null,
        name: "",
        description: "",
        altitude: 0,
        width: 0,
        height: 0,
        type: "",
        upload: 0,
        count: 0,
        drone: "",
        owner: this.$store.state.auth.user.id,
        camera: ""
      },

      albumToUpdate: {
        _id: null,
        id: null,
        name: "",
        description: "",
        type: "",
        drone: "",
        owner: this.$store.state.auth.user.id,
        camera: ""
      },

      listCameraType: [{ id: "1", name: "RGB" }],
      listAlbumType: [
        { id: "1", name: "Urbano" },
        { id: "2", name: "Rural" },
        { id: "3", name: "Floresta" }
      ]
    };
  },

  computed: {
    userFolder() {
      return (
        this.$store.state.auth.user.email + "_" + this.$store.state.auth.user.id
      );
    },
    isFormCompleted() {
      return this.formCompleted;
    }
  },

  mounted() {
    if (this.albumObj != null) {
      this.album = this.albumObj;
      this.$store.dispatch("setNewAlbum", this.album);
    }
  },
  methods: {
    sleep(m) {
      return new Promise(r => setTimeout(r, m));
    },

    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    successEvent(file) {
      var self = this;

      EXIFREADER.getData(file, function() {
        let width, height, latitude, longitude, altitude;

        if (this.exifdata.GPSLatitude) {
          var latitude_deg =
            this.exifdata.GPSLatitude[0].numerator /
            this.exifdata.GPSLatitude[0].denominator;
          var latitude_minute =
            this.exifdata.GPSLatitude[1].numerator /
            this.exifdata.GPSLatitude[1].denominator;
          var latitude_second =
            this.exifdata.GPSLatitude[2].numerator /
            this.exifdata.GPSLatitude[2].denominator;

          latitude =
            latitude_deg + latitude_minute / 60 + latitude_second / 3600;
        }

        if (this.exifdata.GPSLongitude) {
          var longitude_deg =
            this.exifdata.GPSLongitude[0].numerator /
            this.exifdata.GPSLongitude[0].denominator;
          var longitude_minute =
            this.exifdata.GPSLongitude[1].numerator /
            this.exifdata.GPSLongitude[1].denominator;
          var longitude_second =
            this.exifdata.GPSLongitude[2].numerator /
            this.exifdata.GPSLongitude[2].denominator;
          longitude =
            longitude_deg + longitude_minute / 60 + longitude_second / 3600;
        }

        if (this.exifdata.GPSAltitude) {
          altitude =
            this.exifdata.GPSAltitude.numerator /
            this.exifdata.GPSAltitude.denominator;
        }

        if (this.exifdata.GPSLatitudeRef) {
          if (this.exifdata.GPSLatitudeRef == "S") {
            latitude = latitude * -1;
          }
          if (this.exifdata.GPSLongitudeRef == "W") {
            longitude = longitude * -1;
          }
        }

        if (this.exifdata.PixelXDimension) {
          width = this.exifdata.PixelXDimension;
        } else if (this.exifdata.ImageWidth) {
          width = this.exifdata.ImageWidth;
        }

        if (this.exifdata.PixelYDimension) {
          height = this.exifdata.PixelYDimension;
        } else if (this.exifdata.ImageHeight) {
          height = this.exifdata.ImageHeight;
        }

        var image = {
          filename: file.name,
          size: file.size,
          resolution: (width * height) / 1000000,
          width: width,
          height: height,
          type: file.type,
          location: {
            altitude: altitude,
            latitude: latitude,
            longitude: longitude
          },
          url:
            "https://storage.cloud.google.com/storage-vantum/user_data/" +
            self.userFolder +
            "/albums/" +
            self.album.id +
            "/" +
            file.name +
            "?authuser=0",
          thumbnail_url:
            "https://storage.cloud.google.com/storage-vantum/user_data/" +
            self.userFolder +
            "/albums/" +
            self.album.id +
            "/thumbnails/" +
            file.name +
            "?authuser=0",
          album: self.album.id
        };

        self.$store.dispatch("postImage", image);
      });
    },
    vqueueComplete(file, xhr, formData, album) {
      this.queueComplete = true;

      this.$emit("complete", this.album);

      this.$buefy.toast.open({
        message: "Upload completo",
        type: "is-success"
        // position: 'is-bottom'
      });
    },

    createAlbum: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("postAlbum", this.album)
          .then(album => {
            this.album = album;

            this.$store.dispatch("setNewAlbum", this.album);

            this.$buefy.toast.open({
              message: "Album cadastrado!",
              type: "is-success"
            });
            resolve(album);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    updateAlbum: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("editAlbum", this.albumToUpdate)
          .then(album => {
            this.formCompleted = true;
            this.$buefy.toast.open({
              message: "Album editado!",
              type: "is-success"
            });
            resolve(album);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    saveAlbumData() {
      this.albumToUpdate._id = this.album._id;
      this.albumToUpdate.id = this.album._id;
      this.$validator.validateAll().then(async result => {
        if (result) {
          this.updateAlbum().then(album => {
            this.album = album;
            if (this.queueComplete) {
              this.$emit("finishInput", album);
            } else {
              this.$emit("finishInput", album);
              this.view = "upload";
            }
          });
        }
      });
    },

    submit() {
      return new Promise(async (resolve, reject) => {
        if (!this.btDisabled) {
          // change this to the new minimum images to upload
          if (this.$refs.fileUpload.getQueuedFiles > 0) {
            this.btDisabled = true;
            this.album.count = this.$refs.fileUpload.getQueuedFiles;

            this.$store.dispatch("setNewAlbum", this.album);

            await this.createAlbum()
              .then(album => {
                this.view = "form";
                this.album = album;
                this.albumToUpdate._id = album._id;
                this.uploading = true;
                this.$refs.fileUpload.processQueue().then(async () => {
                  await this.sleep(2000);
                  resolve(album);
                });
              })
              .catch(e => {
                this.$buefy.toast.open({
                  message: "Album não adicionado",
                  type: "is-danger"
                });
                reject(e);
              });
          } else {
            this.$buefy.toast.open({
              message:
                "Album não adicionado, é necessário haver mais de dez imagens",
              type: "is-danger"
              // position: 'is-bottom'
            });
            reject();
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.nextButton {
  margin-bottom: 50px;
  a {
    i {
      margin-left: 10px;
      // font-size: 120%;
    }
  }
}
.album-form {
  margin-bottom: 0.75rem;
  .hidden {
    // visibility: hidden;
    display: none !important;
  }

  .controlButtons {
    position: fixed;
    bottom: 0;
    width: calc(100% - 20px);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #f5f5f5;
    margin-bottom: 10px;
    z-index: 1;
    padding-top: 10px;

    .field {
      margin-bottom: 0;
    }
  }

  .content {
    .sectionTitle {
      padding: 3px 0px 3px 0;

      h2 {
        font-size: 20px;
        font-weight: bold;
        line-height: inherit;
      }
    }

    .georefWarning {
      font-size: 13px;
      color: #666;
      padding: 5px;
      text-align: center;
      background-color: #fcd12a;
      font-weight: bold;
    }

    .button {
      margin-top: 20px;
      background-color: var(--color-light);
    }
  }
}
</style>
