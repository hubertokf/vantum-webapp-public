<template>
  <div class="terms-page">
      <div class="container">
        <terms></terms>
      </div>
  </div>
</template>

<script>
import Terms from '@/components/Terms'

export default {
  name: "terms-page",
  components: {
    Terms
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
.terms-page {
  background-color: var(--color-dark);
  padding-top: 65px;


    
}
</style>
