<template>
  <div class="album-item" @click="open()" :key="object.id">
    <div class="shareFlag" v-if="share">
      <i class="fas fa-share-alt"></i>
    </div>
    <div class="icon">
      <i class="fas fa-images"></i>
      <!-- <img src="@/assets/img/placeholder.svg" alt=""> -->
    </div>

    <div class="info">
      <div class="name">{{ object.name }}</div>
      <div class="creationDate">
        {{ object.createdAt | moment("DD/MM/YYYY HH:mm") }}
      </div>
      <div class="owner">{{ object.owner.fullName }}</div>
    </div>
    <div class="tools">
      <div
        class="deleteItem"
        v-on:click.stop="confirmCustomDelete()"
        v-if="!example"
      >
        <i class="fas fa-trash"></i>
      </div>
      <div
        class="shareItem"
        v-on:click.stop="showModalShare()"
        v-if="!shareVariable & !example"
      >
        <i class="fas fa-share-alt"></i>
      </div>
    </div>
  </div>
</template>

<script>
// import AlbumShare from './AlbumShare.vue';
import ShareModal from "../share/ShareModal";

export default {
  name: "album-item",
  data() {
    return {
      // AlbumShare: AlbumShare,
      ShareModal: ShareModal,
      shareVariable: false
    };
  },
  props: {
    object: {
      type: Object
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

  mounted() {
    if (this.share) {
      if (this.share.level != 3) {
        this.shareVariable = true;
      }
    }
  },

  methods: {
    showModalShare() {
      this.$buefy.modal.open({
        parent: this,
        component: this.ShareModal,
        hasModalCard: true,
        props: {
          album: this.object
        }
      });
    },

    // showModalShare() {
    //   // console.log(this.object)
    //   this.$buefy.modal.open({parent: this,
    //     component: this.AlbumShare,
    //     hasModalCard: true,
    //     props: {
    //       album: this.object }
    //   })
    // },

    open() {
      var objectID;
      objectID = this.object.id;

      // this.$store.dispatch('setProject', objectID)

      this.$parent.$router.push({
        name: "Album",
        params: {
          albumObject: this.object,
          albumId: objectID,
          share: this.share,
          example: this.example
        },
      });
      // this.$parent.$router.push({ name: 'Project', params: { objectID: objectID } })
    },

    deleteItem() {
      if (!this.share) {
        this.$store.dispatch("deleteAlbum", this.object.id).then(() => {
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Album removido"
          });
        });
      } else {
        this.$store.dispatch("deleteSharing", this.share.id).then(() => {
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Album compartilhado removido"
          });
        });
      }
    },

    confirmCustomDelete() {
      this.$buefy.dialog.confirm({
        title: "Deletando Album",
        message:
          "Você tem certeza que deseja <b>deletar</b> o album ? Isso é uma ação sem volta.",
        confirmText: "Deletar Projeto",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteItem(this.object)
      });
    },

    sharebt() {
      this.$notify({
        group: "global",
        type: "is-success",
        duration: 2000,
        title: "Em desenvolvimento"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.album-item {
  padding: 15px 0;
  position: relative;
  background: white;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  overflow: hidden;
  cursor: pointer;

  .shareFlag {
    color: white;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    left: -16px;
    top: -3px;
    background-color: #006746;
    display: block;
    height: 25px;
    position: absolute;
    width: 50px;
    z-index: 2;
    text-align: center;
    font-size: 16px;
    line-height: 26px;

    i {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  &:last-child {
    margin-bottom: 7px;
  }

  .icon {
    display: inline-block;
    height: 50px;
    width: 50px;
    overflow: hidden;
    margin: 3px 10px 3px 10px;
    float: left;
    text-align: center;

    img {
      width: 35px;
      @include v-centerer;
    }

    i {
      // margin-left: 5px;
      line-height: 50px;
      font-size: 40px;
      color: var(--color-dark);
    }
  }

  .info {
    display: inline-block;
    line-height: 16px;

    .name {
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
    }

    .creationDate {
      font-size: 12px;
      color: #666;
    }

    .owner {
      color: #666;
      font-size: 11px;
    }
  }

  .tools {
    @include v-centerer;
    padding: 10px;
    right: 0;
    text-align: center;

    .deleteItem {
      cursor: pointer;
      margin-bottom: 5px;
      &:hover {
        color: red;
      }
    }

    .shareItem {
      cursor: pointer;

      &:hover {
        color: green;
      }
    }
  }
}
</style>
