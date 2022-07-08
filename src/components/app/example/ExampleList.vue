<template>
  <div class="examplesSection">

    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>
    <div class="exampleList" v-if="!isLoadingLists">
      <plan-item v-for="(plan) in getPlans" :object="plan" :example="true" :key="plan.id"></plan-item>

      <project-item v-for="(project) in getProjects" :object="project" class="project" :example="true" :key="project.id"></project-item>

      <album-item v-for="(album) in getAlbums" :object="album" class="album" :example="true" :key="album.id"></album-item>
    </div>
  </div>
</template>

<script>
  import PlanItem from "../plan/PlanItem"
  import ProjectItem from "../project/ProjectItem"
  import AlbumItem from "../album/AlbumItem"

  export default {
    name: 'example-list',
    data() {
      return {
        isLoading: false,
        plans: null,
        albums: null,
        projects: null
      }
    },
    components: {
      "plan-item": PlanItem,
      "project-item": ProjectItem,
      "album-item": AlbumItem,
    },
    async mounted() {
      var coords = {
        latitude: -13.0618256, 
        longitude: -63.5501318, 
        altitude: 4
      }

      this.$root.$emit('centerMap', coords)
    },

    computed: {       
      getAlbums(){
        return this.$store.getters.getExampleAlbums
      },
      getPlans(){
        return this.$store.getters.getExamplePlans
      },
      getProjects(){
        return this.$store.getters.getExampleProjects
      },
      isLoadingLists(){
        return this.$store.getters.isLoadingLists
      }
    },
    methods: {
      filteredList() {
        this.$store.dispatch('getShares')
        .then((examples) => {
          return examples
        })
      },
    }
  }
</script>

<style lang="scss">
  .examplesSection{
      display: flex;
      flex-direction: column;
      // justify-content: center;
      flex: 1;
      
      .addShare{
        position: absolute;
        background: var(--color-dark);
        border-radius: 100%;
        margin-top: 8px;
        margin-left: 8px;
        margin-right: 5px;
        text-align: center;
        color: white;
        bottom: 55px; 
        right: 30px;
        font-size: 22px;
        line-height: 49px;
        width: 50px;
        height: 50px;
        -webkit-box-shadow: rgba(0,0,0,0.2) 0px 3px 5px -1px, rgba(0,0,0,0.14) 0px 6px 10px 0px, rgba(0,0,0,0.12) 0px 1px 18px 0px;
        box-shadow: rgba(0,0,0,0.2) 0px 3px 5px -1px, rgba(0,0,0,0.14) 0px 6px 10px 0px, rgba(0,0,0,0.12) 0px 1px 18px 0px;
        cursor: pointer;
      }

      .exampleList{
        padding: 10px;
        position: relative;
        overflow-y: auto;
        &::-webkit-scrollbar-track{
          background-color: #F5F5F5;
        }

        &::-webkit-scrollbar{
          width: 8px;
          background-color: #F5F5F5;
        }

        &::-webkit-scrollbar-thumb{
          // border-radius: 10px;
          background-color: #888;
        }
      }
    }
</style>