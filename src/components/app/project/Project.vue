<template>
  <div class="projectContent">
    <nav-bar ref="nav" :scrollTop="scrollTop">
      <div class="overlay" @click="goToMap">
        <div class="hover">ver mapa</div>
      </div>
      <template v-slot:bg>
        <!-- <map-v v-if="project"></map-v> -->
      </template>
      <template v-slot:left>
        <div class="back" @click="goToParent">
          <b-icon :icon="'arrow-left'" :size="'is-medium'"></b-icon>
        </div>
      </template>

      <template v-slot:title>
        <!-- <div class="spacer"></div> -->
        <div class="pageTitle">{{ project.name }}</div>

        <div class="spacer"></div>
      </template>

      <template v-slot:right>
        <!-- <b-icon :icon="'dots-vertical'" :size="'is-medium'"></b-icon> -->
        <!-- <div class="viewMap">
          <b-icon :icon="'map'" :size="'is-medium'"></b-icon>
        </div> -->
        <b-dropdown aria-role="menu" position="is-bottom-left">
          <button class="dropdownMenu" v-if="allowEditVisualization" slot="trigger">
            <b-icon :icon="'dots-vertical'" :size="'is-medium'"></b-icon>
          </button>
          <b-dropdown-item value="edit" aria-role="menuitem" v-on:click="editMode()" v-if="!edit">
            <i class="fas fa-edit"></i>
            Editar
          </b-dropdown-item>

          <b-dropdown-item value="edit" aria-role="menuitem" v-on:click="showModalShare()">
            <i class="fas fa-share-alt"></i>
            Compartilhar
          </b-dropdown-item>

          <b-dropdown-item
            value="trash"
            aria-role="menuitem"
            v-on:click="confirmCustomDelete()"
            v-if="!example && arrowBack"
          >
            <i class="fas fa-trash"></i>
            Excluir
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </nav-bar>

    <div
      class="project"
      @scroll="
        a => {
          scrollTop = a.target.scrollTop;
        }
      "
    >
      <b-loading :is-full-page="false" :active.sync="isLoadingLists" :can-cancel="false"></b-loading>

      <!-- <navigation-menu
        v-if="project && !isLoading && !isLoadingLists"
        :arrowBack="arrowBack"
        :backFunction="goToParent"
        :title="project.name"
        :share="share"
      >
        
      </navigation-menu>-->

      <b-button
        class="go-map is-primary"
        @click="goToMap()"
        v-if="$isMobile && !comparePlans && !isLoading && !isLoadingLists && !edit"
      >
        <i class="fas fa-map"></i>
        Ver Mapa
      </b-button>


      <b-button
        class="selectPlansToCompare is-primary"
        @click="selectPlansToCompare()"
        v-if="
          project.plans &&
            project.plans.length > 1 &&
            !comparePlans &&
            !isLoading &&
            !isLoadingLists &&
            !edit
        "
      >
        <i class="fas fa-arrows-alt-h"></i>
        Comparar Mapas
      </b-button>

      <div class="editform" v-if="edit">
        <b-field
          label="Nome da pasta"
          :type="{ 'is-danger': errors.has('name') }"
          :message="errors.first('name')"
        >
          <b-input
            v-model="project.name"
            v-validate="'required'"
            name="name"
            placeholder="Nome da Pasta (ex: Fazenda Rural)"
          ></b-input>
        </b-field>

        <folder-item
          v-for="project in getProject.projects"
          :edit="edit"
          :object="project"
          :key="project._id"
        ></folder-item>

        <plan-item v-for="plan in getProject.plans" :object="plan" :edit="edit" :key="plan._id"></plan-item>
      </div>

      <div class="projectsSection" v-if="this.project.projects && !comparePlans && !edit">
        <b-loading :is-full-page="false" :active.sync="isLoadingLists" :can-cancel="false"></b-loading>
        <div class v-if="!isLoadingLists">
          <folder-item v-for="project in getProject.projects" :object="project" :key="project._id"></folder-item>
          <plan-item v-for="plan in getProject.plans" :object="plan" :key="plan._id"></plan-item>
        </div>
      </div>

      <compare-plans :project="project.name" :plans="project.plans" v-if="comparePlans"></compare-plans>

      <b-collapse
        class="tools"
        :open.sync="openTools"
        v-if="project.annotations && !edit && !comparePlans && !isLoadingLists"
      >
        <div slot="trigger" class="header" role="button">
          <p class="title">Anotações</p>
          <a class="icon">
            <i class="fas" :class="openTools ? 'fa-angle-down' : 'fa-angle-right'"></i>
          </a>
        </div>
        <div class="content">
          <!-- <map-tools></map-tools> -->

          <annotations :annotationList="project.annotations"></annotations>
        </div>
      </b-collapse>

      <div class="errorNotFound" v-if="error && !isLoading">
        Desculpe, este projeto não foi encontrado.
        <br />:(
      </div>

      <fab-menu :options="fabOptions" v-if="!edit && !comparePlans"></fab-menu>

      <!-- <project-buttons
        class="project-buttons"
        :addProject="this.addProjectButton"
        v-if="!comparePlans && !edit"
      ></project-buttons>-->
    </div>
    <div class="navigationbts" v-if="edit">
      <a class="button is-primary cancelBT" @click="editMode()">Cancelar</a>
      <a class="button is-primary is-pulled-right saveBT" @click="updateProject()">Salvar</a>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import ProjectDetails from "./ProjectDetails";
import ProjectForm from "./ProjectForm";
import ComparePlans from "./ComparePlans";
import ProjectItem from "./ProjectItem";
import FolderItem from "../FolderItem";
import PlanItem from "../plan/PlanItem";
import ProjectButtons from "./ProjectButtons";
import VisualizationModal from "./VisualizationModal";
import Annotations from "../plan/Annotations";
import Fab from "@/components/app/ui/Fab";
import NavBar from "@/components/app/NavBar";
import Mapp from "@/components/app/Map";
import ShareModal from "../share/ShareModal";

export default {
  name: "project",
  components: {
    "project-buttons": ProjectButtons,
    "map-v": Mapp,
    NavigationMenu,
    "project-details": ProjectDetails,
    "project-form": ProjectForm,
    ComparePlans,
    "folder-item": ProjectItem,
    "folder-item": FolderItem,
    "plan-item": PlanItem,
    "visualization-modal": VisualizationModal,
    NavBar,
    "fab-menu": Fab,
    annotations: Annotations
  },
  props: {
    projectObject: {
      type: Object,
      default: null
    },
    projectId: {
      type: String
    },
    share: {
      type: Object,
      default: null
    },
    example: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ShareModal: ShareModal,
      project: {},
      scrollTop: 0,
      openTools: false,
      addClicked: false,
      edit: false,
      error: false,
      isLoading: false,
      inputLoading: false,
      listPlans: [],
      currentPlan: {},
      arrowBack: true,
      comparePlans: false,
      addProjectButton: true,
      currentProject: {}
    };
  },
  beforeDestroy() {
    // this.$store.dispatch("setCurrentProject", null);
    // this.$root.$emit("clear-orthomosaics");
  },
  computed: {
    fabOptions() {
      if (this.addProjectButton) {
        return [
          {
            icon: "folder",
            label: "Pasta",
            action: () => {
              this.$router.push({
                name: "NewProject",
                params: { parent: this.project._id }
              });
            }
          },
          {
            icon: "map",
            label: "Mapa",
            action: () => {
              this.$router.push({
                name: "NewPlan",
                params: { projectParent: this.project._id }
              });
            }
          }
        ];
      } else {
        return [
          {
            icon: "map",
            label: "Mapa",
            action: () => {
              this.$router.push({
                name: "NewPlan",
                params: { projectParent: this.project._id }
              });
            }
          }
        ];
      }
    },
    allowEditVisualization() {
      if (!this.share || (this.share && this.share.level >= 2)) {
        return true;
      } else {
        return false;
      }
    },
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    },
    getProject() {
      return this.$store.getters.getCurrentProject;
    },
    filteredPlans() {
      if (this.project.plans) {
        let self = this;

        return this.listPlans.filter(function(el) {
          return !self.project.plans.some(function(f) {
            return f._id === el._id;
          });
        });
      } else {
        return this.listPlans;
      }
    }
  },
  mounted() {
    this.$root.$emit("clear-orthomosaics");
    this.$root.$emit("clear-annotations");
    this.$store.dispatch("setCurrentPlan", null);

    if (this.projectObject != null) {
      this.project = this.projectObject;
      this.$store.dispatch("setCurrentProject", this.projectObject);
      if (this.project.parent) {
        this.addProjectButton = false;
      }
      this.isLoading = false;

      this.populateMosaics();
    } else {
      this.$store
        .dispatch("getProject", this.projectId)
        .then(project => {
          this.project = project;
          this.$store.dispatch("setCurrentProject", this.project);
          if (project.parent) {
            this.addProjectButton = false;
          }
          this.isLoading = false;

          this.populateMosaics();
        })
        .catch(() => {
          this.isLoading = false;
          this.error = true;
        });
    }
    this.$store
      .dispatch("getPlans", "owner=" + this.$store.getters.getUser.id)
      .then(plans => {
        this.listPlans = plans;
      });

    this.isLoading = false;
    if (this.share && this.share.linkSharing) {
      this.arrowBack = false;
    }

    // this.$store.dispatch('setActiveOrthomosaics', orthomosaic)
    // if (this.$store.getters.getOrthomosaics.length){
    //   let center = {
    //     latitude: this.$store.getters.getOrthomosaics[0].image.location.latitude,
    //     longitude: this.$store.getters.getOrthomosaics[0].image.location.longitude
    //   }
    //   this.centerMap(center)
    // }
  },
  methods: {
    showModalShare() {
      this.$buefy.modal.open({
        parent: this,
        component: this.ShareModal,
        hasModalCard: true,
        props: {
          plan: this.object
        }
      });
    },
    goToMap() {
      this.$store.dispatch("toggleSidebar");
    },
    removeItem(object) {},
    populateMosaics() {
      let positions = [];

      if (this.project.projects && this.project.projects.length > 0) {
        this.project.projects.forEach(project => {
          if (project.plans && project.plans.length > 0) {
            let plan = project.plans[0];
            if (plan.orthomosaics.length > 0) {
              this.$root.$emit("add-orthomosaic", plan.orthomosaics[0]);

              if (plan.orthomosaics[0].bounds.length > 0) {
                positions.push(plan.orthomosaics[0].bounds);
              } else if (
                plan.orthomosaics[0].geometrys &&
                plan.orthomosaics[0].geometrys.length > 0
              ) {
                positions.push(
                  plan.orthomosaics[0].geometrys.map(a => [
                    a.latitude,
                    a.longitude
                  ])
                );
              } else {
                location.push([
                  plan.orthomosaics[0].image.location.latitude,
                  plan.orthomosaics[0].image.location.longitude
                ]);
              }
            }
          }
        });
      }

      if (this.project.plans && this.project.plans.length > 0) {
        this.project.plans.forEach(plan => {
          if (plan.orthomosaics.length > 0) {
            this.$root.$emit("add-orthomosaic", plan.orthomosaics[0]);

            if (plan.orthomosaics[0].bounds.length > 0) {
              positions.push(plan.orthomosaics[0].bounds);
            } else if (
              plan.orthomosaics[0].geometrys &&
              plan.orthomosaics[0].geometrys.length > 0
            ) {
              positions.push(
                plan.orthomosaics[0].geometrys.map(a => [
                  a.latitude,
                  a.longitude
                ])
              );
            } else {
              if (
                plan.orthomosaics[0].image &&
                plan.orthomosaics[0].image.location &&
                plan.orthomosaics[0].image.location != null
              ) {
                location.push([
                  plan.orthomosaics[0].image.location.latitude,
                  plan.orthomosaics[0].image.location.longitude
                ]);
              }
            }
          }
        });
      }

      if (positions.length !== 0) {
        this.$root.$emit("fit-bounds", positions);
      }
    },
    visualizationModal() {
      this.$buefy.modal.open({
        parent: this,
        component: VisualizationModal,
        hasModalCard: true,
        customClass: "custom-class custom-class-2"
      });
    },
    selectPlansToCompare() {
      this.comparePlans = true;
    },
    stopComparePlans() {
      this.comparePlans = false;
      this.populateMosaics();
    },
    editMode() {
      if (this.edit) {
        this.edit = false;
      } else {
        this.edit = true;
      }
    },
    cancelEditMode() {
      this.edit = false;
    },
    goToParent() {
      this.isLoading = true;
      if (this.project.parent) {
        this.$parent.$router.push({
          name: "Project",
          params: {
            projectId: this.project.parent,
            share: this.share,
            example: this.example
          }
        });
      } else {
        this.$parent.$router.push({
          name: "List"
        });
      }
      this.isLoading = false;
    },

    async addPlan() {
      var index = this.listPlans.findIndex(
        plan => plan.id === this.currentPlan
      );
      this.project.plans.push(this.listPlans[index]);

      await this.$store.dispatch("editProject", this.project);

      this.currentPlan = {};
      this.listPlans.splice(index, 1);
    },

    async removePlan(planId) {
      var index = this.project.plans.findIndex(plan => plan.id === planId);
      this.project.plans.splice(index, 1);
      await this.$store.dispatch("editProject", this.project);
    },

    centerMap(coords) {
      this.$root.$emit("centerMap", coords);
    },

    updateProject: function() {
      this.$store
        .dispatch("editProject", {
          _id: this.project._id,
          id: this.project.id,
          name: this.project.name,
          description: this.project.description
        })
        .then(project => {
          this.$buefy.toast.open({
            message: "Projeto editado!",
            type: "is-success"
          });
          this.edit = false;
        })
        .catch(e => {
          this.$buefy.toast.open({
            message: "Projeto não editado!",
            type: "is-warning"
          });
        });
    },

    deleteItem() {
      if (!this.share) {
        this.$store.dispatch("deleteProject", this.projectId).then(() => {
          // this.$parent.removeItem(this.object)
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Projeto removido"
          });
          this.$router.go(-1);
        });
      } else {
        this.$store.dispatch("deleteSharing", this.share.id).then(() => {
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Projeto compartilhado removido"
          });
          this.$router.go(-1);
        });
      }
    },

    confirmCustomDelete() {
      this.$buefy.dialog.confirm({
        title: "Deletando Pasta",
        message:
          "Você tem certeza que deseja <b>deletar</b> a pasta? Isso é uma ação sem volta.",
        confirmText: "Deletar Projeto",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteItem()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.projectsSection {
}
.projectContent {
  position: relative;
  width: 100%;
  overflow-y: auto;

  display: flex;
  flex-flow: column;
  align-items: stretch;
  flex-direction: column;
  // justify-content: center;
  width: 100%;
  height: 100vh;
  flex: 1;

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

  .navigationbts {
    background-color: #f5f5f5;
    position: sticky;
    padding: 10px;
    width: 100%;
    bottom: 0;

    .cancelBT {
      cursor: pointer;
    }
    .saveBT {
      cursor: pointer;
    }
  }

  .viewMap{
    text-align: right;
  }

  .nav-bar {
    flex: 0 1 auto;
  }

  .pageTitle {
    line-height: 30px;
    font-size: 22px;
    font-weight: bold;
    width: calc(100% - 20px);
    z-index: 3;
    align-self: flex-end;

    .icon {
      vertical-align: sub;
    }
  }

  .overlay {
    height: 100%;
    width: 100%;
    // background-color: rgba(0, 0, 0, 0.4);
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.80632) 0%,
      rgba(0, 212, 255, 0) 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;

    .hover {
      display: none;
      color: #e5e5e5;
      font-weight: bold;
      text-align: center;
      margin: auto;
      width: 100%;
      @include v-centerer;
    }

    &:hover {
      .hover {
        display: block;
      }
    }
  }

  .project {
    width: 100%;
    padding: 10px;
    height: 100%;
    flex-shrink: 0;
    overflow-y: auto;
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

    .button.go-map{
      margin-top: 0;
      margin-bottom: 20px;
      background-color: var(--color-light);
      width: 100%;
    }

    .tools {
      margin-top: 20px;
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

    .editform {
      // padding-bottom: 40px;
    }

    .navigationMenu {
      margin-bottom: 20px;
    }

    .selectPlansToCompare {
      width: 100%;
      margin-top: 10px;
      margin-bottom: 20px;
    }

    .errorNotFound {
      text-align: center;
      font-weight: bold;
      margin-top: 20px;
    }
    .back-button {
      cursor: pointer;
    }

    .createPlan {
      cursor: pointer;
    }

    .selectPlan {
      cursor: pointer;
    }

    .step-items {
      width: 100%;
    }

    .selectedMaps {
      .selectedMap {
        position: relative;
        padding: 5px;
        background-color: var(--color-lighter);
        color: var(--color-dark);
        margin-bottom: 5px;

        .remove {
          color: red;
          cursor: pointer;
          @include v-centerer;
          right: 10px;
        }
      }
    }
  }
}
</style>
