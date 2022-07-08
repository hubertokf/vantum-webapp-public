<template>
  <div class="projectsSection">
    <b-loading :is-full-page="false" :active.sync="isLoadingLists" :can-cancel="false"></b-loading>
    <div class="projectList" v-if="!isLoadingLists">
      <project-item
        v-for="(project) in getProjects"
        :object="project"
        class="project"
        :key="project.id"
      ></project-item>
    </div>

    <router-link :to="{ name: 'ProjectForm'}">
      <div class="addProject">
        <i class="fas fa-plus"></i>
      </div>
    </router-link>
  </div>
</template>

<script>
import ProjectItem from "./ProjectItem";
export default {
  name: "project-list",
  data() {
    return {
      projectsWithoutParent: [],
      project: [],
      description: ""
    };
  },
  components: {
    "project-item": ProjectItem
  },
  mounted() {
    this.$root.$emit("clear-orthomosaics");
    this.$root.$emit("clear-annotations");
    var coords = {
      latitude: -13.0618256,
      longitude: -63.5501318,
      altitude: 4
    };
    this.$root.$emit("centerMap", coords);

    // let positions = [[-13.0618256, -63.5501318]];

    // this.$root.$emit("fit-bounds", positions);

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
    getProjects() {
      let projects = this.$store.getters.getProjects;
      return projects.filter(project => !project.parent);
    },
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    }
    //   // return this.$store.getters.getProjects.filter(project => {
    //   //   if(project.project){
    //   //     return project.project.name.toLowerCase().includes(this.search.toLowerCase())
    //   //   }
    //   //   else{
    //   //     return project.name.toLowerCase().includes(this.search.toLowerCase())
    //   //   }
    //   // })
    // }
  },
  methods: {
    removeItem(object) {}
  }
};
</script>

<style lang="scss">
.projectsSection {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  width: 100%;
  flex: 1;

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
    padding: 10px;
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