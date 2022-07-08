<template>
  <div class="search-view">
      <plan-item v-for="(plan) in filteredPlan" :object="plan" :key="plan.id"></plan-item>
      <project-item v-for="(project) in filteredProject" :object="project" class="project" :key="project.id"></project-item>
      <album-item v-for="(album) in filteredAlbum" :object="album" class="album" :key="album.id"></album-item>
  </div>
</template>

<script>
export default {
  name: "search-view",
  props: {
    search: {
      type: String
    }
  },
  data() {
    return {
      projects: null,
      plans: null,
      albums: null,
    };
  },
  mounted () {
    // this.$store.dispatch('getProjects')
    // .then((projects) => {
    //   this.projects = projects
    // })
    // this.$store.dispatch('getPlans')
    // .then((plans) => {
    //   this.plans = plans
    // })
    // this.$store.dispatch('getAlbums')
    // .then((albums) => {
    //   this.albums = albums
    // })
  },
  computed: {
    filteredProject() {
      return this.$store.dispatch('getProjects').filter(project => {
        return project.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    filteredPlan() {
      return this.$store.dispatch('getPlans').filter(plan => {
        return plan.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    filteredAlbum() {
      return this.$store.dispatch('getAlbums').filter(album => {
        return album.name.toLowerCase().includes(this.search.toLowerCase());
      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>