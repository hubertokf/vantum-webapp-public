<template>
  <div class="not-found">
    <div class="columns">
      <div class="column">
        <div class="error">
          <div class="logo">
            <img class="white" v-if="company && company.slug !== 'vantum'" :src="company.logo"/>
            <img class="white" v-else src="../assets/img/Marca_principal_branco.svg"/>
          </div>
          <div class="code">404</div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="message">
          <div class="title">Ops, página não encontrada!</div>
          <div class="description">
            Infelizmente não consegui encontrar neste caminho.
            <a href="/#contact">Precisa de ajuda?</a>
          </div>
        </div>
      </div>
    </div>
    <div class="menu">
      <div class="container">
        <div class="columns">
          <div class="column">
            <a class="menu-item" href="/">Home</a>
          </div>
          <div class="column">
            <a class="menu-item" href="/app">Plataforma</a>
          </div>
          <div class="column">
            <a class="menu-item" href="/#features">Soluções</a>
          </div>
          <div class="column">
            <a class="menu-item" href="/#pricing">Preços</a>
          </div>
          <div class="column">
            <a class="menu-item" href="/#aboutus">Nossa Equipe</a>
          </div>
          <div class="column">
            <a class="menu-item" href="/#contact">Contato</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "not-found",
  data() {
    return {};
  },
  computed: {
    company() {
      return this.$store.getters.getCurrentCompany;
    },
  },
};
</script>

<style lang="scss" scoped>
.not-found {
  background-color: var(--color-dark);
  width: 100%;
  min-height: 100vh;
  position: relative;

  .error {
    margin-top: 100px;
    text-align: center;
    margin-bottom: 50px;

    .logo {
      text-align: center;

      img {
        width: 400px;
      }
    }
    .code {
      line-height: 100px;
      color: white;
      font-size: 100px;
      font-weight: bold;
      margin-top: -40px;
    }
  }

  .message {
    background: none;
    text-align: center;
    margin-bottom: 60px;

    .title {
      color: white;
      font-size: 40px;
    }
    .description {
      font-size: 20px;
      color: #fefefe;
    }
  }

  .menu {
    bottom: 0;
    width: 100%;
    padding: 30px 0;

    .menu-item {
      color: white;
      font-weight: bold;
    }
  }
}
</style>