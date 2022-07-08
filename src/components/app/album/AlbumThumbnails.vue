<template>
  <div class="album-thumbnails">
    <div class="thumbnails">
      <div
        class="photo"
        @click="$buefy.modal.open({
          parent: this,
          component: ImageComponent,
          hasModalCard: true,
          props: {image:photo}
        })"
        v-for="photo in album.images"
        :key="photo.id"
      >
        <img :src="photo.thumbnail_url" alt>
      </div>
    </div>
  </div>
</template>

<script>
import ImageView from './ImageView'

export default {
  name: "album-thumbnails",
  props: {
    album: {
      type: Object
    }
  },
  components: {
    ImageView,
  },
  mounted() {

    // this.$store.dispatch('getAlbum', this.album.id)
    // .then((album) => {
    //   this.newAlbum = album
    // })
  },

  data() {
    return {
      isImageModalActive: false,
      ImageComponent: ImageView,
      // newAlbum: {}
    }
  },
};
</script>

<style lang="scss" scoped>
.album-thumbnails {
  max-height: 150px;
  overflow-y: auto;

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

  .thumbnails {
    .photo {
      display: inline-block;
      background-color: #888;
      height: 55px;
      width: 55px;
      margin-right: 5px;
      margin-bottom: 5px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>