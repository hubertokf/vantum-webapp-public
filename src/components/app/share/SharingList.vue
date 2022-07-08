<template>
  <div class="sharesSection">
    <b-loading :is-full-page="false" :active.sync="isLoadingLists" :can-cancel="false"></b-loading>
    <div class="shareList" v-if="!isLoadingLists">
      <plan-item
        v-for="(share) in getShares"
        v-if="share.plan != null"
        :object="share.plan"
        :share="share"
        :key="share.plan.id"
      ></plan-item>
      <project-item
        v-for="(share) in getShares"
        v-if="share.project != null"
        :object="share.project"
        :share="share"
        class="project"
        :key="share.project.id"
      ></project-item>
      <album-item
        v-for="(share) in getShares"
        v-if="share.album != null"
        :object="share.album"
        :share="share"
        class="album"
        :key="share.album.id"
      ></album-item>
    </div>
  </div>
</template>

<script>
import PlanItem from "../plan/PlanItem";
import ProjectItem from "../project/ProjectItem";
import AlbumItem from "../album/AlbumItem";
// :example="true"

export default {
  name: "share-list",
  data() {
    return {
      shares: [],
      description: ""
    };
  },
  components: {
    "plan-item": PlanItem,
    "project-item": ProjectItem,
    "album-item": AlbumItem
  },
  mounted() {
    var coords = {
      latitude: -13.0618256,
      longitude: -63.5501318,
      altitude: 4
    };
    this.$root.$emit("centerMap", coords);
    // this.$store.dispatch('getSharings')
    //   .then((shares) => {
    //     shares.forEach(share => {
    //       if(share.album){
    //         this.$store.dispatch('getAlbum', share.album.id)
    //         .then((album) => {
    //           share.album = album
    //         })

    //       }else if(share.project){
    //         this.$store.dispatch('getProject', share.project.id)
    //         .then((project) => {
    //           share.project = project
    //         })
    //       }else if(share.plan){
    //         this.$store.dispatch('getPlan', share.plan.id)
    //         .then((plan) => {
    //           share.plan = plan
    //         })
    //       }
    //     });
    //     this.shares = shares

    //   })
  },

  computed: {
    getShares() {
      return this.$store.getters.getSharings;
    },
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    }
    //   // return this.$store.getters.getProjects.filter(share => {
    //   //   if(share.share){
    //   //     return share.share.name.toLowerCase().includes(this.search.toLowerCase())
    //   //   }
    //   //   else{
    //   //     return share.name.toLowerCase().includes(this.search.toLowerCase())
    //   //   }
    //   // })
    // }
  },
  methods: {
    filteredList() {
      this.$store.dispatch("getShares").then(shares => {
        return shares;
      });
    }
  }
};
</script>

<style lang="scss">
.sharesSection {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  flex: 1;

  .addShare {
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
    -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
      rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
      rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    cursor: pointer;
  }

  .shareList {
    position: relative;
    overflow-y: auto;
    height: 100%;
    padding: 10px;

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