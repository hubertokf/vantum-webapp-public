<template>
  <div class="orthomosaic-form">
    <div class="content">
      <b-field label="Enviando novo Ortomosaico"></b-field>

      <div class="georefWarning warning">Atenção, envie apenas imagens georreferenciadas.</div>

      <file-upload
        @sending-success="(file) => successEvent(file)"
        @queue-complete="(file) => vqueueComplete(file)"
        :uploadPath="'user_data/'+userFolder+'/orthomosaics/'+orthomosaic.id+'/'"
        :showButton="false"
        :makeThumbnails="false"
        :autoStartUpload="false"
        :maxUpload="1"
        ref="fileUpload"
      ></file-upload>

      <div class="nextButton has-text-centered" v-if="showButton">
        <a class="button is-primary" @click="submit()" :disabled="btDisabled">
          Próximo
          <i class="fas fa-angle-right"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from "../FileUpload";
import { EXIFREADER } from "../../../vendor/exif.js";

export default {
  name: "orthomosaic-form",
  data() {
    return {
      completed: false,
      btDisabled: false,
      project: null,
      image: null,
      task: {
        job: {
          tile: true
        },
        status: "waiting"
      },
      orthomosaic: {
        id: null,
        type: "orthophoto",
        tilesUrl: "",
        plan: null,
        image: null,
        task: null
      }
    };
  },
  props: {
    plan: {
      type: Object,
      default: null
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  components: {
    "file-upload": FileUpload
  },
  mounted() {},
  computed: {
    userFolder() {
      return (
        this.$store.state.auth.user.email + "_" + this.$store.state.auth.user.id
      );
    }
  },
  methods: {
    createOrthomosaic() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("postOrthomosaic", this.orthomosaic)
          .then(orthomosaic => {
            this.orthomosaic = orthomosaic;
            resolve(orthomosaic);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    updateOrthomosaic() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("editOrthomosaic", this.orthomosaic)
          .then(orthomosaic => {
            this.orthomosaic = orthomosaic;
            resolve(orthomosaic);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    submit(plan) {
      this.orthomosaic.plan = plan;
      return new Promise((resolve, reject) => {
        if (!this.btDisabled) {
          this.$validator.validateAll().then(async result => {
            if (result) {
              if (this.$store.getters.getNewOrthomosaic == null) {
                if (this.$refs.fileUpload.getQueuedFiles == 1) {
                  this.btDisabled = true;

                  this.$store.dispatch("setNewOrthomosaic", this.orthomosaic);

                  await this.createOrthomosaic()
                    .then(orthomosaic => {
                      this.orthomosaic = orthomosaic;

                      this.$refs.fileUpload.processQueue().then(() => {
                        resolve(orthomosaic);
                      });
                    })
                    .catch(e => {
                      this.$buefy.toast.open({
                        message: "Orthomosaico não adicionado",
                        type: "is-danger"
                      });
                      reject(e);
                    });
                } else {
                  this.btDisabled = false;
                  this.$buefy.toast.open({
                    message:
                      "Album não adicionado, você deve selecionar um ortomosaico",
                    type: "is-danger"
                  });
                  reject();
                }
              } else {
                await this.updateOrthomosaic()
                  .then(orthomosaic => {
                    this.$store.dispatch("setNewOrthomosaic", orthomosaic);
                    resolve(orthomosaic);
                  })
                  .catch(e => {
                    this.$buefy.toast.open({
                      message: "Orthomosaico não editado",
                      type: "is-danger"
                    });
                    reject(e);
                  });
              }
            } else {
              this.$buefy.toast.open({
                message: "Formulário inválido, verifique os campos.",
                type: "is-danger",
                position: "is-bottom"
              });
            }
          });
        }
      });
    },

    successEvent(file, response) {
      var self = this;

      EXIFREADER.getData(file, async function() {
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

          // D + M/60 + S/3600
        self.image = {
          filename: file.filename,
          size: file.size,
          resolution:
            (width * height) /
            1000000,
          width: width,
          height: height,
          type: file.type,
          url:
            "https://storage.cloud.google.com/storage-vantum/user_data/" +
            self.userFolder +
            "/orthomosaics/" +
            self.orthomosaic.id +
            "/" +
            file.name +
            "?authuser=0",
          location: {
            altitude: altitude,
            latitude: latitude,
            longitude: longitude
          },
          thumbnail_url: "",
          album: null
        };

        await self.$store.dispatch("postImage", self.image).then(image => {
          self.orthomosaic.image = image.id;
          self.updateOrthomosaic();
        });
      });
    },

    async vqueueComplete(file, xhr, formData, orthomosaic) {
      this.queueComplete = true;

      // await this.$store.dispatch('setNewOrthomosaic', this.orthomosaic)

      // await this.createOrthomosaic().then((orthomosaic)=>{
      //   this.orthomosaic = orthomosaic
      //   this.task.orthomosaic = orthomosaic.id
      // })

      this.completed = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.orthomosaic-form {
  margin-bottom: 10px;

  .georefWarning {
    font-size: 13px;
    color: #666;
    padding: 5px;
    text-align: center;
    background-color: #fcd12a;
    font-weight: bold;
  }
}
</style>