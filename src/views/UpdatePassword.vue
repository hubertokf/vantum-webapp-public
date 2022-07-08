<template>
  <div class="update-password">
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
          <div class="update-password-box">
            <h1>Atualizar Senha</h1>
            <div v-if="error" class="error-content">
              <p>{{errorMsg}}</p>
            </div>
            <div v-if="!error" class="form-content">
              <p>Digite sua nova senha no formulário abaixo para redefinir sua conta.</p>
              
              <update-password></update-password>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UpdatePassword from "@/components/UpdatePassword.form";
import axios from 'axios'

export default {
  name: "update-password-view",
  data: () => ({
    token: '',
    error: false,
    errorMsg: ''
  }),

  components: {
    UpdatePassword
  },

  mounted() {
    if (this.$route.params.token == '' || this.$route.params.token == undefined) {
      this.error = true
      this.errorMsg = 'Token de nova senha ausente ou inválido. Tente acessar o link novamente no seu email.'
    }else{
      this.token = this.$route.params.token
    }
  },

  computed: {
    company() {
      return this.$store.getters.getCurrentCompany 
    },
  },
  methods: {
    verifyToken () {
      
    }
  }
};
</script>

<style lang="scss" scoped>
.update-password {
  padding-top: 90px;
  // background-color: #00ce46;
  // background-color: #006746;
  background-color: var(--color-dark);
  height: 100vh;

  .logo {
    img {
      width: 150px;
      margin-bottom: 10px;
    }
  }

  .update-password-box {
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
      .update-password-form {
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
