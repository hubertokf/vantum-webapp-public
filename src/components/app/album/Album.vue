<template>
  <div class="album">
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    ></b-loading>

    <navigation-menu
      v-if="album && !isLoading"
      :title="album.name"
      :share="share"
      :arrowBack="arrowBack"
    >
      <b-dropdown-item
        value="edit"
        aria-role="menuitem"
        v-on:click="editMode()"
      >
        <i class="fas fa-edit"></i>
        Editar
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
    </navigation-menu>

    <album-details
      v-if="album && !isLoading && !edit"
      :album="album"
    ></album-details>
    <album-thumbnails
      v-if="album && !isLoading && !edit"
      :album="album"
    ></album-thumbnails>

    <div class="editAlbum" v-if="edit">
      <album-form
        v-if="album && !isLoading"
        :albumObj="album"
        :showButton="false"
        ref="albumForm"
      ></album-form>

      <b-field class="is-pulled-right">
        <b-button
          class="button next-bt is-primary"
          @click="updateAlbum"
          :loading="inputLoading"
          :disabled="inputLoading"
          >Salvar</b-button
        >
      </b-field>
      <b-field class="is-pulled-left">
        <b-button class="button next-bt is-primary" @click="cancelEditMode"
          >Cancelar</b-button
        >
      </b-field>
    </div>

    <div class="errorNotFound" v-if="error && !isLoading">
      Desculpe, este album não foi encontrado.<br />
      :(
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import AlbumDetails from "./AlbumDetails";
import AlbumChunkThumbnails from "./AlbumThumbnails";
import AlbumForm from "./AlbumForm";

export default {
  name: "album",
  // props: ['albumId'],
  components: {
    NavigationMenu,
    "album-details": AlbumDetails,
    "album-thumbnails": AlbumChunkThumbnails,
    "album-form": AlbumForm
  },
  props: {
    albumObject: {
      type: Object,
      default: null
    },
    albumId: {
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
      album: null,
      edit: false,
      addClicked: false,
      inputLoading: false,
      error: false,
      isLoading: false,
      arrowBack: true
    };
  },
  mounted() {
    if (this.share && this.share.linkSharing) {
      this.arrowBack = false;
    }
    this.isLoading = true;
    if (this.albumObject != null) {
      this.album = this.albumObject;
      this.$store.dispatch("setCurrentAlbum", this.albumObject);
      this.isLoading = false;
    } else {
      this.$store
        .dispatch("getAlbum", this.albumId)
        .then(album => {
          this.album = album;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
          this.error = true;
        });
    }
  },
  methods: {
    editMode() {
      this.edit = true;
    },
    cancelEditMode() {
      this.edit = false;
    },
    updateAlbum() {
      this.inputLoading = true;
      this.$refs.albumForm
        .submit()
        .then(async album => {
          this.$store.dispatch("setNewAlbum", album);
          this.album = album;

          this.inputLoading = false;
          this.edit = false;
        })
        .catch(() => {
          this.inputLoading = false;
        });
    },
    centerMap(coords) {
      this.$root.$emit("centerMap", coords);
    },

    deleteItem() {
      if (!this.share) {
        this.$store.dispatch("deleteAlbum", this.albumId).then(() => {
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Album removido"
          });
          this.$router.go(-1);
        });
      } else {
        this.$store.dispatch("deleteSharing", this.share.id).then(() => {
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Album compartilhado removido"
          });
          this.$router.go(-1);
        });
      }
    },

    confirmCustomDelete() {
      this.$buefy.dialog.confirm({
        title: "Deletando Album",
        message:
          "Você tem certeza que deseja <b>deletar</b> o album ? Isso é uma ação sem volta.",
        confirmText: "Deletar Album",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteItem()
      });
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.album {
  width: 100%;
  padding: 0 10px;
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

  .errorNotFound {
    text-align: center;
    font-weight: bold;
    margin-top: 20px;
  }

  .album-thumbnails {
    max-height: 300px;
  }

  .content {
    padding: 0 0px;
    display: flex;
    flex-flow: column;
    // height: 100%;
  }

  .navigationMenu {
    margin-top: 15px;
  }

  .description {
    margin-bottom: 20px;
    padding: 0 10px;
  }

  .plans {
    padding: 0 10px;
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

    .plan-item {
      padding: 10px 10px;
      -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.16);
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.16);
      margin-bottom: 10px;
      background-color: var(--color-dark);
      transition: all 0.1s height;

      &.active {
        padding: 0;
        background-color: transparent;
        -webkit-box-shadow: 0px 0px 0px;
        box-shadow: 0px 0px 0px;

        .header {
          .title {
            color: black;
          }
          .icon {
            color: black;
          }
        }
      }

      .header {
        .title {
          font-weight: bold;
          font-size: 16px;
          display: inline-block;
          margin-bottom: 0;
          color: white;
        }
        .icon {
          margin-left: 5px;
          color: white;
        }
      }

      .content {
        padding: 0 0px;
      }

      .plan-details {
      }
    }
  }
}
</style>
