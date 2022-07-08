<template>
  <div class="attachments">
    <attachment-item
      v-for="(attachment, index) in attachments"
      :key="'attachment-'+index"
      :attachment="attachment"
    ></attachment-item>
  </div>
</template>

<script>
import AttachmentItem from "./AttachmentItem";
export default {
  name: "attachments",
  props: {
    attachments: {
      type: Array,
      default: null
    }
  },
  components: {
    AttachmentItem
  }
};
</script>

<style lang="scss" scoped>
.attachments {
  margin-bottom: 60px;
}
</style>