<template>
  <div class="new-plan">
    <nav-bar ref="nav" :scrollTop="scrollTop">
      <template v-slot:left>
        <div class="back" @click="confirmExit">
          <b-icon :icon="'close'" :size="'is-medium'"></b-icon>
        </div>
      </template>

      <template v-slot:title>
        <!-- <div class="spacer"></div> -->
        <div class="pageTitle">Novo mapa</div>

        <div class="spacer"></div>
      </template>

      <template v-slot:right></template>
    </nav-bar>

    <div
      class="content"
      @scroll="
          a => {
            scrollTop = a.target.scrollTop;
          }
        "
    >
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>

      <b-steps size="is-small" v-model="activeStep" :animated="true" :has-navigation="false">
        <b-step-item type="is-success" icon-pack="fas" icon="map" :clickable="false">
          <div class="input-selector" v-if="showInputSelector">
            <div
              class="album is-primary"
              @click="
                inputType = 'album';
                activeStep++;
              "
            >
              <img class="icon" src="@/assets/icons/drone.svg" alt="drone" />
              Imagens/dataset de drone
            </div>

            <div
              class="orthomosaic is-primary"
              @click="
                inputType = 'orthomosaic';
                activeStep++;
              "
            >
              <img class="icon" src="@/assets/icons/tiff.svg" alt="tiff" />
              Ortomosaico (geotiff)
            </div>
          </div>
        </b-step-item>

        <b-step-item type="is-success" icon-pack="fas" icon="images" :clickable="false">
          <album-upload
            v-if="inputType == 'album'"
            :showButton="false"
            :showDropzone="showDropzone"
            ref="albumUpload"
            @finishInput="finishInputForm"
            @complete="setUploadComplete"
          ></album-upload>

          <orthomosaic-form
            v-bind:class="{ hidden: showPlanForm }"
            @complete="setUploadOrthomosaicComplete"
            @created="setOrthomosaic"
            v-if="inputType == 'orthomosaic'"
            :showButton="false"
            :showDropzone="showDropzone"
            ref="orthomosaicForm"
          ></orthomosaic-form>
          <div class="fillPlan" v-bind:class="{ hidden: !showPlanForm }">
            <plan-form :showButton="false" :project="projectParent" ref="planForm"></plan-form>

            <!-- <div class="controlButtons">
              <b-field>
                <b-button class="button next-bt is-primary is-pulled-right" @click="savePlan">Salvar</b-button>
              </b-field>
            </div>-->
          </div>

          <div class="controlButtons">
            <b-field v-if="!uploadComplete && !inputLoading">
              <b-button
                class="button next-bt is-primary is-pulled-right"
                @click="saveInputMethod"
                :loading="inputLoading"
                :disabled="inputLoading"
              >Próximo</b-button>
            </b-field>

            <b-field v-if="showPlanForm">
              <b-button class="button next-bt is-primary is-pulled-right" @click="savePlan">Salvar</b-button>
            </b-field>

            <b-field v-if="!uploading">
              <b-button
                class="button prev-bt is-primary is-pulled-left"
                @click="previousStep"
              >Anterior</b-button>
            </b-field>

            <div class="loading" v-if="inputLoading">
              Enviando..
              <i class="fas fa-spinner fa-pulse"></i>
            </div>
          </div>
        </b-step-item>

        <b-step-item type="is-success" icon-pack="fas" icon="credit-card" :clickable="false">
          <!-- Seu upload está em andamento e pode ser visualizado no botão amarelo da barra lateral. Por favor, feche ou não atualize a página.  -->
          <!-- Enquanto isso, você pode navegar livremente pela plataforma. -->
          <billing-view
            :album="album"
            :plan="plan"
            :task="task"
            :invoice="invoice"
            ref="billingView"
            :showButton="false"
          ></billing-view>

          <div class="controlButtons">
            <b-field>
              <b-button
                class="button next-bt is-primary is-pulled-right"
                @click="finishNewPlan"
              >Finalizar</b-button>
            </b-field>
          </div>
        </b-step-item>
      </b-steps>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import PlanForm from "@/components/app/plan/PlanForm";
import AlbumUpload from "@/components/app/plan/AlbumUpload";
import OrthomosaicForm from "@/components/app/plan/OrthomosaicForm";
import BillingView from "@/components/app/billing/BillingView";
import NavBar from "@/components/app/NavBar";

export default {
  name: "new-plan",
  components: {
    NavigationMenu,
    PlanForm,
    "album-upload": AlbumUpload,
    OrthomosaicForm,
    NavBar,
    BillingView
  },
  props: {
    projectParent: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      scrollTop: 0,
      inputType: "",
      inputLoading: false,
      showInputSelector: true,
      processing: false,
      activeStep: 0,
      uploading: false,
      btDisabled: false,
      isLoading: false,
      uploadComplete: false,
      formCompleted: false,
      showPlanForm: false,
      showDropzone: true,
      item: "",
      plan: {
        id: "",
        name: "",
        location: "",
        latlng: null,
        album: "",
        owner: this.$store.state.auth.user.id,
        project: null
      },
      album: null,
      orthomosaic: null,
      task: {
        id: null,
        job: { orthomosaic: true },
        status: "waiting"
      },
      invoice: null
    };
  },
  mounted() {
    if (this.plan.album != null || this.plan.album.id != null) {
      this.showInputSelector == false;
      this.inputType == "album";
    }

    if (this.plan.orthomosaics != null || this.plan.orthomosaics != []) {
      this.showInputSelector == false;
      this.inputType == "orthomosaic";
    }
  },
  methods: {
    confirmExit() {
      this.$buefy.dialog.confirm({
        title: "Sair",
        message:
          "Você tem certeza que deseja <b>sair</b> desta tela? Toda informação não salva será perdida.",
        confirmText: "Sair",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.$router.go(-1)
      });
    },
    sleep(m) {
      return new Promise(r => setTimeout(r, m));
    },
    setOrthomosaic(orthomosaic) {
      this.orthomosaic = orthomosaic;
    },
    updateOrthomosaic(orthomosaic) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("editOrthomosaic", orthomosaic)
          .then(orthomosaic => {
            this.orthomosaic = orthomosaic;
            resolve(orthomosaic);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    setUploadComplete(album) {
      this.uploadComplete = true;
      this.album = album;
      if (this.formCompleted) {
        this.finishInput(album);
      }
    },
    finishInputForm(album) {
      this.formCompleted = true;
      this.album = album;
      if (this.uploadComplete) {
        this.finishInput(album);
      }
    },
    setUploadOrthomosaicComplete(orthomosaic) {
      this.uploadComplete = true;
      this.orthomosaic = orthomosaic;

      if (this.formCompleted) {
        this.finishOrthomosaic();
      }
    },
    updateAlbum() {
      this.$refs.updateAlbum.submit().then(album => {
        this.album = album;
        this.view = "upload";
      });
    },
    createTask: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("postTask", this.task)
          .then(task => {
            this.task = task;
            resolve(task);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    createInvoice: function(task, plan) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("postInvoice", {
            task: task,
            plan: plan,
            owner: this.$store.getters.getUser.id
          })
          .then(invoice => {
            this.invoice = invoice;
            resolve(invoice);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    previousStep() {
      if (this.activeStep > 0) {
        this.activeStep--;
      }
    },
    savePlan() {
      this.$store.dispatch("setNewPlan", null);
      this.$refs.planForm.submit().then(plan => {
        this.$store.dispatch("setNewPlan", plan);
        this.plan = plan;
        this.orthomosaic.plan = plan;
        this.task.plan = plan.id;
        this.formCompleted = true;

        if (this.uploadComplete) {
          this.finishOrthomosaic();
        } else {
          this.showPlanForm = false;
        }
      });
    },
    async finishInput(album = this.album) {
      this.album = album;
      this.isLoading = true;
      this.$store.dispatch("setNewAlbum", this.album);
      this.plan = {
        name: this.album.name,
        description: this.album.name,
        planDate: this.album.flightDate,
        album: this.album,
        owner: this.$store.state.auth.user.id,
        project: this.projectParent
      };

      this.task.album = this.album._id;
      this.$store.dispatch("setNewPlan", this.plan);

      //update plan with album
      this.plan = await this.$store.dispatch("postPlan", this.plan);
      this.task.plan = this.plan;

      //create task
      await this.createTask().then(task => {
        this.task = task;
        this.$store.dispatch("setNewTask", task);
      });

      await this.sleep(2000);

      this.uploadComplete = true;

      await this.createInvoice(this.task, this.plan).then(invoice => {
        this.invoice = invoice;
        this.$refs.billingView.setInvoice(invoice);

        this.isLoading = false;

        this.activeStep = 2;
      });
      await this.$store.dispatch("setNewOrthomosaic", null);
      await this.$store.dispatch("setNewAlbum", null);
      await this.$store.dispatch("setNewPlan", null);
      this.inputLoading = false;
      this.isLoading = false;
    },

    async finishOrthomosaic(orthomosaic = this.orthomosaic) {
      this.isLoading = true;
      this.$store.dispatch("setNewOrthomosaic", orthomosaic);
      // if (this.plan.orthomosaics == undefined) {
      //   this.plan.orthomosaics = [];
      // }
      // this.plan.orthomosaics.push(orthomosaic);
      this.task.orthomosaic = orthomosaic.id;

      //update plan with orthomosaic
      await this.$store.dispatch("editPlan", this.plan);

      //create task
      await this.createTask().then(task => {
        this.task = task;
        this.$store.dispatch("setNewTask", task);
      });

      await this.sleep(2000);

      //create invoice passing task
      await this.createInvoice(this.task, this.plan).then(invoice => {
        this.invoice = invoice;
        this.$refs.billingView.setInvoice(invoice);
        this.isLoading = false;

        this.activeStep = 2;
      });
      await this.$store.dispatch("setNewOrthomosaic", null);
      await this.$store.dispatch("setNewAlbum", null);
      await this.$store.dispatch("setNewPlan", null);
      this.inputLoading = false;
      this.isLoading = false;
    },

    async saveInputMethod() {
      this.inputLoading = true;
      this.showDropzone = false;
      if (this.inputType == "album") {
        this.inputLoading = true;
        this.uploading = true;
        this.$refs.albumUpload
          .submit()
          .then(async album => {
            // this.inputLoading = false;
          })
          .catch(() => {
            this.uploading = false;
            this.inputLoading = false;
            this.showDropzone = true;
          });
        // this.activeStep++;
      } else if (this.inputType == "orthomosaic") {
        this.inputLoading = true;
        this.uploading = true;
        this.task.job = { tile: true };
        this.showPlanForm = true;
        this.$refs.orthomosaicForm
          .submit(this.plan._id)
          .then(async orthomosaic => {
            this.orthomosaic = orthomosaic;
            // this.inputLoading = false;
          })
          .catch(() => {
            this.uploading = false;
            this.inputLoading = false;
            this.showPlanForm = false;
            this.showDropzone = true;
          });
      }
    },
    finishNewPlan() {
      this.$router.push({ name: "Plan", params: { planId: this.plan.id } });
    }
  }
};
</script>

<style lang="scss">
.new-plan {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding-bottom: 55px;
  padding-top: 0;

  position: relative;
  width: 100%;
  overflow-y: auto;

  position: relative;
  width: 100%;
  overflow-y: auto;

  display: flex;
  flex-flow: column;
  align-items: stretch;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  flex: 1;

  .pageTitle {
    line-height: 30px;
    font-size: 22px;
    font-weight: bold;
    width: calc(100% - 20px);
    align-self: flex-end;

    .icon {
      vertical-align: sub;
    }
  }

  .navigationMenu {
    background-color: #f5f5f5;
  }

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

  .content {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    width: 100%;
    flex: 1 1 auto;
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

    .step-items {
      width: 100%;
      list-style: none;
    }

    .b-steps {
      .steps:not(:last-child) {
        margin-bottom: 5px;
        margin-top: 10px;
      }

      .steps {
        // display: none;

        + .step-content {
          padding: 0;
        }
      }
    }
  }

  .hidden {
    display: none;
  }

  .loading-overlay.is-active {
    z-index: 1;
  }

  .plan-form {
    margin-bottom: 20px;
  }

  .loading {
    margin-right: 10px;
    float: right;
    margin-top: 10px;
    font-weight: bold;
  }

  .input-selector {
    text-align: center;

    .album,
    .orthomosaic {
      background-color: var(--color-light);
      width: fit-content;
      text-align: center;
      font-weight: bold;
      color: white;
      margin: 20px auto;
      margin-bottom: 20px;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;

      .icon {
        width: 40px;
        height: 40px;
        display: block;
        margin: auto;
      }
    }
    .orthomosaic {
    }
  }

  .albumSource {
    margin-bottom: 20px;
    width: 100%;
  }

  .selectAlbum {
    margin-bottom: 20px;
  }

  .step-items {
    width: 100%;
  }

  .b-steps {
    .steps:not(:last-child) {
      margin-bottom: 5px;
      margin-top: 10px;
    }

    .steps {
      // display: none;

      + .step-content {
        padding: 0;
      }
    }
  }

  .controlButtons {
    position: fixed;
    bottom: 0;
    width: calc(100% - 20px);
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    background-color: #f5f5f5;
    margin-bottom: 10px;

    .field {
      margin-bottom: 0;
    }
  }

  .content {
    // padding: 10px;

    i {
      margin-left: 0;
      color: inherit;
    }

    .sectionTitle {
      padding: 3px 0px 3px 0;

      h2 {
        font-size: 20px;
        font-weight: bold;
        line-height: inherit;
      }
    }

    .button {
      background-color: var(--color-light);
    }
  }
}
</style>
