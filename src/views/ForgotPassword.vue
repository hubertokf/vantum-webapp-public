<template>
  <div class="forgot-password">
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
          <div class="forgot-password-box">
            <div class="form-content">
              <h1>Recupere a sua senha</h1>
              <p>Digite seu endereço de e-mail abaixo para redefinir a senha da sua conta.</p>
              <forgot-password></forgot-password>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ForgotPassword from "@/components/ForgotPassword.form";

export default {
  name: "forgot-password-view",
  data: () => ({
    email: "",
  }),

  components: {
    ForgotPassword
  },

  computed: {
    company() {
      return this.$store.getters.getCurrentCompany 
    },
  },
  mounted() {
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
.forgot-password {
  padding-top: 90px;
  // background-color: #00ce46;
  background-color: var(--color-dark);
  // background-color: #006746;
  height: 100vh;

  .logo {
    img {
      width: 150px;
      margin-bottom: 10px;
    }
  }

  .forgot-password-box {
    padding: 35px 30px;
    margin-bottom: 50px;
    border-radius: 10px;
    background-color: white;
    -webkit-box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);

    .social-text {
      text-align: left;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .form-content {
      .forgot-password-form {
        // .email-input{
        //     input{
        //         border: 0;
        //         background-color: #F7F7F7;
        //         color: #000000;
        //     }
        // }
        // .password-input{
        // }
        // .button.is-link{
        //     background-color: #29A4FF;
        //     color: #fff;
        //     -webkit-box-shadow: 0 0 0 rgba(0, 0, 0, 0.16);
        //     box-shadow: 0 0 0 rgba(0, 0, 0, 0.16);
        // }
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
        margin-bottom: 30px;
      }
    }
  }
}
</style>
