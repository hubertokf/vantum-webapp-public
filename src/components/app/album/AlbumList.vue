<template>
  <div class="albumsSection">
    <b-loading :is-full-page="false" :active.sync="isLoadingLists" :can-cancel="false"></b-loading>

    <div class="albumList" v-if="!isLoadingLists">
      <album-item v-for="(album) in getAlbums" :object="album" class="album" :key="album.id"></album-item>
    </div>

    <router-link :to="{ name: 'NewAlbum'}">
      <div class="addAlbum">
        <i class="fas fa-plus"></i>
      </div>
    </router-link>
  </div>
</template>

<script>
import AlbumItem from "./AlbumItem";

export default {
  name: "album-list",
  data() {
    return {
      albums: [],
      description: ""
    };
  },
  components: {
    "album-item": AlbumItem
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
    // this.albums = this.$store.getters.getAlbums()
    // this.$store.dispatch('getAlbums')
    //   .then((albums) => {
    //     this.albums = albums
    //   })
  },

  computed: {
    getAlbums() {
      return this.$store.getters.getAlbums;
    },
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    }
    //   // return this.$store.getters.getProjects.filter(album => {
    //   //   if(album.album){
    //   //     return album.album.name.toLowerCase().includes(this.search.toLowerCase())
    //   //   }
    //   //   else{
    //   //     return album.name.toLowerCase().includes(this.search.toLowerCase())
    //   //   }
    //   // })
    // }
  },
  methods: {
    filteredList() {
      this.$store.dispatch("getAlbums").then(albums => {
        return albums;
      });
    }
  }
};
</script>

<style lang="scss">
.albumsSection {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  flex: 1;
  // flex-flow: column;
  // height: 100%;

  .addAlbum {
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

  .albumList {
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