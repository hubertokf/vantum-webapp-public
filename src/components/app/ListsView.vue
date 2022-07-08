<template>
  <div class="listsView">
    <list-selector :counters="counters" ref="listSelector"></list-selector>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import ListSelector from "@/components/app/ListSelector";
export default {
  name: "listsView",
  components: {
    "list-selector": ListSelector
  },
  data() {
    return {};
  },
  computed: {
    counters() {
      if (this.$store.getters.getSearchTerm != "") {
        return {
          share: this.$store.getters.getCountSharings,
          album: this.$store.getters.getCountAlbums,
          project: this.$store.getters.getCountProjects,
          // project: this.getProjects.le,
          plan: this.$store.getters.getCountPlans
        };
      }
    },
    company() {
      return this.$store.getters.getCurrentCompany;
    }

    // getProjects(){
    //   if (this.$store.getters.getSearchTerm != ""){
    //     return this.$store.getters.getProjects.filter(project => {
    //       return project.name.toLowerCase().includes(this.$store.getters.getSearchTerm.toLowerCase())
    //     })
    //   }else{
    //     return this.$store.getters.getProjects
    //   }
    // }
  },
  async mounted() {
    // await this.$store.dispatch("setIsLoadingLists", true);

    // if (this.company && this.company.slug == 'vantum'){
    // await this.$store.dispatch(
    //   "getPlans",
    //   "owner=" + this.$store.getters.getUser._id
    // );
    // await this.$store.dispatch(
    //   "getProjects",
    //   "owner=" + this.$store.getters.getUser._id
    // );
    // await this.$store.dispatch(
    //   "getAlbums",
    //   "owner=" + this.$store.getters.getUser._id
    // );
    // await this.$store.dispatch(
    //   "getUserSharings",
    //   "user=" + this.$store.getters.getUser._id
    // );

    // await this.$store.dispatch(
    //   "getExampleAlbums",
    //   "owner=5c5347560d90150017d4c882"
    // );
    // await this.$store.dispatch(
    //   "getExampleProjects",
    //   "owner=5c5347560d90150017d4c882"
    // );
    // await this.$store.dispatch(
    //   "getExamplePlans",
    //   "owner=5c5347560d90150017d4c882"
    // );
    // }else{
    //   await this.$store.dispatch('getPlans', "company="+this.$store.getters.getCurrentCompany._id)
    //   await this.$store.dispatch('getProjects', "company="+this.$store.getters.getCurrentCompany._id)
    //   await this.$store.dispatch('getAlbums', "company="+this.$store.getters.getCurrentCompany._id)
    // }

    // await this.$store.dispatch("setIsLoadingLists", false);
  }
};
</script>

<style lang="scss">
.listsView {
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-flow: row;
  height: 100%;

  .loading-overlay {
    z-index: 1;
  }
}
</style>