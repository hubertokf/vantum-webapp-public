<template>
  <div class="login-company">
    <div class="container">
      <div class="columns">
        <div class="is-offset-4 column is-4">
          <div class="logo">
            <a href="/">
              <img v-if="company && company.slug !== 'vantum'" :src="company.logo"/>
              <img v-else src="../assets/img/Marca_principal_branco.svg"/>
            </a>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="is-offset-4 column is-4">
          <div class="login-box" :class="{ 'pro-login': isPro }">
            <div class="form-content">
              <h1>Acesse sua conta <br> <span v-if="isPro">Profissional</span></h1>
              <p>Preencha o formulário para acessar a sua conta.</p>
              <login-form :pro="isPro"></login-form>

              <!-- <div class="social-text">Ou faça login com:</div>
              <login-social></login-social> -->

              <b-button
                class="button proBt next-bt is-primary"
                v-if="!isPro"
                @click="isPro=true"
              >Login Profissional</b-button>

              <div class="normalLogin" v-if="isPro" @click="isPro=false">
                Login de usuários
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/Login.form";
import LoginSocial from "@/components/Login.social";

export default {
  name: "login",
  data: () => ({
    email: "",
    password: "",
    isPro: false
  }),

  components: {
    LoginForm,
    LoginSocial
  },

  mounted() {
    if (this.$route.params.confirmation) {
      this.$buefy.toast.open({
        message: "Email confirmado!",
        type: "is-success",
        position: "is-top"
      });
    } else if (this.$route.params.newPassword) {
      this.$buefy.toast.open({
        message: "Senha alterada com sucesso!",
        type: "is-success",
        position: "is-top"
      });
    } else if (this.$route.query.confirmed !== undefined) {
      this.$buefy.toast.open({
        message: "Email confirmado com sucesso!",
        type: "is-success",
        position: "is-top"
      });
    }

  },

  computed: {
    company() {
      return this.$store.getters.getCurrentCompany 
    },
  },
  methods: {
    // async signIn() {
    //   const { xToken, cookie } = await this.$store.dispatch(
    //     "signIn",
    //     this.user
    //   );

    //   window.localStorage.setItem("x-token", xToken);
    //   this.setCookie("user", cookie, 3600 * 24 * 7);
    //   this.setIsUserAuthenticated(true);
    //   this.$emit("userLoggedIn");
    // },

    // setCookie(name, value, seconds) {
    //   const expires = seconds
    //     ? "; expires=" +
    //       new Date(new Date().getTime() + seconds * 1000).toGMTString()
    //     : "";
    //   document.cookie =
    //     name + "=" + encodeURIComponent(value) + expires + "; path=/";
    // }
  }
};
</script>

<style lang="scss" scoped>
.login {
  padding-top: 70px;
  // background-color: #00ce46;
  background-color: var(--color-dark);
  // background-color: #006746;
  min-height: 100vh;
  -webkit-transition: all 3s linear 3s;
  transition: all 3s linear 3s;

  .logo {
    img {
      width: 200px;
    }
  }

  .login-box {
    padding: 35px 30px;
    margin-bottom: 50px;
    border-radius: 10px;
    background-color: white;
    -webkit-box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);

    &.pro-login{
      span{
        font-size: 35px
      }

      .form-content {

        h1 {
          text-align: left;
          font-size: 18px;
          font-weight: 900;
          line-height: 30px;
          margin-bottom: 10px;
        }
      }
    }

    .proBt{
      background-color: var(--color-dark);
      // color: var(--color-lighter);
    }

    .normalLogin{
      color: red;
      cursor: pointer;
    }

    .social-text {
      text-align: left;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .form-content {
      .login-form {
        margin-bottom: 20px;
      }

      h1 {
        text-align: left;
        font-size: 24px;
        font-weight: 900;
        margin-bottom: 10px;
      }

      p {
        text-align: left;
        font-size: 18px;
        font-weight: 300;
        line-height: 20px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
