<template>
  <nav class="navbar is-transparent is-fixed-top" :class="{ 'hb-fixed': scrollPosition > 1 }">
    <div class="container is-fluid">
      <div class="navbar-brand">
        <router-link class="navbar-item logo" to="/">
          <!-- <img class="preto" src="../assets/img/Marca_horizontal.png">
          <img class="branco" src="../assets/img/Marca_horizontal_branco.png"> -->
          <picture class="preto">
            <source type="image/webp" srcset="../assets/img/webp/Marca_horizontal.webp">
            <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
            <img src="../assets/img/Marca_horizontal.png" alt="Vantum">
          </picture>
          <picture class="branco">
            <source type="image/webp" srcset="../assets/img/webp/Marca_horizontal_branco.webp">
            <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
            <img src="../assets/img/Marca_horizontal_branco.png" alt="Vantum">
          </picture>
        </router-link>

        <div class="navbar-burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarExampleTransparentExample" class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-start">
          <a class="navbar-item" href="/">
            Home
          </a>
          <a class="navbar-item" href="#features">
            Soluções
          </a>
          <a class="navbar-item" href="#pricing">
            Preços
          </a>
          <a class="navbar-item" href="#aboutus">
            Nossa Equipe
          </a>
          <a class="navbar-item" href="https://blog.vantum.com.br/">
            Blog
          </a>
          <a class="navbar-item" href="#contact">
            Contato
          </a>
        </div>

        <div class="navbar-end">
          <div v-if="!isLoggedIn" class="navbar-item">
            <div class="field is-grouped">
              <p class="control">
                <a class="button is-primary register-button" href="/vantum/signup">
                  <span class="icon">
                    <i class="fas fa-user-plus"></i>
                  </span>
                  <span>Criar conta grátis</span>
                </a>
              </p>
              <p class="control">
                <a class="bd-tw-button button" href="/vantum/login">
                  <span class="icon">
                    <i class="fas fa-sign-in-alt"></i>
                  </span>
                  <span>Login</span>
                </a>
              </p>
            </div>
          </div>

          <div v-if="isLoggedIn" class="navbar-item has-dropdown is-hoverable">
            <div class="navbar-item" href="#">
              <div class="user-avatar">
                <!-- <img src="../assets/img/avatar.png" alt=""> -->
                <picture class="branco">
                  <source type="image/webp" srcset="../assets/img/webp/avatar.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
                  <img src="../assets/img/avatar.png" alt="Vantum">
                </picture>
              </div>

              <div class="user-username">
                {{ $store.state.auth.user.firstName }}
              </div>
            </div>
            <div class="navbar-dropdown is-boxed">
              <a class="navbar-item" href="/vantum/app">
                Plataforma
              </a>
              <a class="navbar-item" @click="logout">
                Sign-Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

</template>

<script>
export default {
  name: "header-bar",
  components: {},
  data: () => ({
    io: null,
    msg: "Welcome to Your Vue.js App",
    scrollPosition: null,
    showNav: false
  }),

  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },

  watch: {},

  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY;
    },

    signOut() {
      this.deleteCookie("user");
      this.isUserAuthenticated = false;
      localStorage.clear();

      this.$router.push({ name: "Home" });
    },
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/landing");
      });
    }
  },

  mounted() {
    window.addEventListener("scroll", this.updateScroll);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.logo {
  padding: 0;

  img {
    max-height: initial;
    height: 45px;
    
    padding: 0rem 0.75rem;
  }
}

.user-avatar {
  display: inline-block;

  img {
    width: 45px;
    max-height: inherit;
    margin-right: 10px;
  }
}

.button.register-button {
  background-color: var(--color-light);

  &:hover{
    background-color: var(--color-light);
  }
}

.navbar-brand {
  height: 62px;
}

.navbar-burger {
  cursor: pointer;
  height: 5.38rem;
  position: relative;
  width: 3.25rem;
  height: 62px;
  margin-left: auto;
  color: white;

  .navbar-item{
    color: white;
  }
}

.navbar {
  transition: all 200ms ease;
  background-color: transparent;
  // height: 60px;
  height: 3.9rem;
  color: white;
  font-weight: bold;
  padding: 0 1rem;

  .navbar-item {
    color: white;
  }

  .is-boxed {
    .navbar-item {
      color: #35495e;
    }
  }

  .logo .preto {
    display: none;
  }

  &.hb-fixed {
    background-color: white;
    transition: all 400ms ease;

    .navbar-burger{
      color: #4a4a4a;
    }

    .logo .preto {
      display: block;
    }

    .logo .branco {
      display: none;
    }

    .navbar-item {
      color: #35495e;
    }
  }
  .navbar-menu.is-active{
    .navbar-item {
      color: #35495e;
    }
  }
}
</style>
