<template>
  <div class="projectsSection">
    <b-loading :is-full-page="false" :active.sync="isLoadingLists" :can-cancel="false"></b-loading>

    <div class="projectList" v-if="!isLoadingLists">
      <insert-project
        v-for="(project) in getProjects"
        :object="project"
        :isActive="isActive(project.id)"
        :key="project.id"
        @click.native="select(project)"
      ></insert-project>
      <!-- <a class="button is-primary is-pulled-right sendProjects" @click="send()">Enviar</a> -->
    </div>

    <div class="insertButtons">
      <a class="button is-primary newBT" @click="newProject()">Novo</a>
      <a class="button is-primary saveBT is-pulled-right" @click="send()">Salvar</a>
      <a class="button is-primary cancelBT is-pulled-right" @click="cancel()">Cancelar</a>
    </div>
  </div>
</template>

<script>
import InsertProject from "./InsertProject";
export default {
  name: "insert-project-list",
  props: {
    projectId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      projectsWithoutParent: [],
      removedInsert: false,
      colorTransparent: [],
      insertedProjects: [],
      project: [],
      description: ""
    };
  },
  components: {
    "insert-project": InsertProject
  },
  mounted() {
    var coords = {
      latitude: -13.0618256,
      longitude: -63.5501318,
      altitude: 4
    };
    this.$root.$emit("centerMap", coords);
    this.$store.dispatch("setNewPlan", null);
    this.$store.dispatch("setNewProject", null);
    this.$store.dispatch("setNewAlbum", null);
    this.$store.dispatch("setNewTask", null);
    // this.$store.dispatch('getProjects')
    // .then((projects) => {
    //   this.projects = projects
    // })
  },

  computed: {
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    },
    getProjects() {
      let currentProject = this.$store.getters.getCurrentProject;
      return this.$store.getters.getProjects.filter(userProject => {
        return (
          !userProject.parent &&
          userProject._id != this.projectId &&
          userProject._id != currentProject.parent
        );
      });
    }
  },
  methods: {
    removeItem(object) {},

    cancel() {
      this.$router.go(-1);
    },
    select(project) {
      this.removedInsert = false;

      for (let i = 0; i <= this.insertedProjects.length - 1; i++) {
        if (this.insertedProjects[i].id === project.id) {
          this.insertedProjects.splice(i, 1);
          this.removedInsert = true;
        }
      }
      if (!this.removedInsert) {
        this.insertedProjects.push(project);
      }
    },
    isActive(projectId) {
      var index = this.insertedProjects.findIndex(
        project => project.id === projectId
      );

      if (index != -1) {
        return true;
      }
      return false;
    },
    send() {
      let objectToSend;
      this.insertedProjects.forEach(insertedProject => {
        objectToSend = {
          projectParentId: this.projectId,
          project: insertedProject
        };
        this.$store.dispatch("insertIntoProject", objectToSend);
      });
      this.$router.go(-1);
    },
    newProject() {
      this.$router.push({
        name: "ProjectForm",
        params: {
          parent: this.projectId
        }
      });
    }
  }
};
</script>

<style lang="scss">
.newProject {
  margin: 8px;
}
.sendProjects {
  margin-top: 1rem;
  margin-right: 10px;
}
.projectsSection {
  display: flex;
  flex-direction: column;
  width: 100%;
  // justify-content: center;
  flex: 1;

  .insertButtons {
    padding: 10px;
    margin-bottom: 0;

    .cancelBT {
      margin-right: 10px;
      cursor: pointer;
    }

    .newBT {
      text-align: center;
      cursor: pointer;
    }

    .saveBT {
      cursor: pointer;
    }
  }

  .addProject {
    position: absolute;
    background: var(--color-dark);
    border-radius: 100%;
    margin-top: 8px;
    margin-left: 8px;
    margin-right: 5px;
    text-align: center;
    color: white;
    bottom: 55px;
    right: 45px;
    font-size: 22px;
    line-height: 49px;
    width: 50px;
    height: 50px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
      rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
      rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    cursor: pointer;
  }

  .projectList {
    position: relative;
    overflow-y: auto;
    height: 100%;

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
  }
}
</style>