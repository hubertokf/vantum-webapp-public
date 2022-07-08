<template>
  <div class="new-album">
    <navigation-menu title="Novo Album"></navigation-menu>

    <div class="content">
      
      <album-form ref="albumForm" :showButton="false"></album-form>
      
      <b-field>
        <b-button
          class="button next-bt is-primary is-pulled-right"
          @click="saveAlbum"
          :loading="inputLoading"
          :disabled="inputLoading"
        >Salvar</b-button>
      </b-field>

    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import AlbumForm from "./AlbumForm";

export default {
  name: "new-album",
  components: {
    NavigationMenu,
    "album-form": AlbumForm
  },
  data() {
    return {
      inputLoading: false,
      album: {},
    };
  },
  mounted() {

  },
  methods: {
    sleep (m) {return new Promise(r => setTimeout(r, m))},
    saveAlbum(){
      this.inputLoading = true
      this.$refs.albumForm.submit().then(async (album)=>{
        this.$store.dispatch('setNewAlbum', album)
        this.album = album
        
        await this.sleep(2000)

        this.$router.push({ name: 'Album', params:{ albumId: this.album.id } }) 

      }).catch(()=>{
        this.inputLoading = false
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  .new-album{
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding: 10px;

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

    .navigationMenu{
      padding: 0 10px;
      margin: 10px 0
    }

    .content{
      // display: flex;
      // flex-flow: column;
      height: 100%;
    }

  }
</style>