<template>
  <footer class="footer-bar section is-fluid">
    <div class="rights">
      © Copyright {{new Date().getFullYear()}} - Feito com doçura no 
      
      <a href="http://candyvalley.com.br" target="_blank" rel="noopener" data-v-66e1491e=""><strong>Candy Valley</strong></a>
      pela Vantum.
    </div>
  </footer>
</template>

<script>
export default {
  name: "footer-bar"
};
</script>

<style lang="scss" scoped>
.footer-bar {
  min-height: 56px;
  padding: 0px 1.5rem;
  background-color: var(--color-darker);
  color: white;
  text-align: center;

  .rights {
    padding: 16px 0;

    a{
      color: #999;
    }
  }
}
</style>