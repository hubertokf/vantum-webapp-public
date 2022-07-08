<template>
  <div class="attachment-item" :key="attachment._id">
    <div class="icon">
      <i class="fas fa-comment-alt"></i>
    </div>

    <div class="info">
      <div class="name">{{ attachment.text }}</div>
      <div class="creationDate">{{ attachment.createdAt | moment("DD/MM/YYYY HH:mm") }}</div>
      <div class="owner">{{ attachment.owner.fullName }}</div>
    </div>
    <div class="tools">
      <div class="deleteItem" @click="confirmAttachmentDelete">
        <i class="fas fa-trash"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "attachment-item",
  data() {
    return {};
  },
  props: {
    attachment: {
      type: Object
    }
  },
  mounted() {},

  methods: {
    deleteAttachment() {
      this.$store.dispatch("removeAttachment", {
        annotation: this.$store.getters.getCurrentAnnotation,
        attachment: this.attachment
      });
    },
    confirmAttachmentDelete() {
      this.$buefy.dialog.confirm({
        title: "Deletando Comentário",
        message:
          "Você tem certeza que deseja <b>deletar</b> o comentário? Isso é uma ação sem volta.",
        confirmText: "Deletar Comentário",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteAttachment()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.attachment-item {
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