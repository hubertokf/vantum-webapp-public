<template>
  <div class="signup">
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
        <div class="is-offset-3 column is-6">
          <div class="signup-box">
            <h1>Cadastro</h1>
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginSocial from "@/components/Login.social";
import SignupForm from "@/components/Signup.form";
export default {
  name: "signup",
  data() {
    return {
      registered: false,
      user: {},
      subscriptionPlan: ""
    };
  },
  components: {
    SignupForm,
    LoginSocial
  },
  computed: {
    company() {
      return this.$store.getters.getCurrentCompany 
    },
  },
  track () {
    this.$ga.page('/signup')
  },
  mounted () {
    if (this.$route.query.subscriptionPlan){
      this.subscriptionPlan = this.$route.query.subscriptionPlan;
    }
  },
};
</script>

<style lang="scss" scoped>
.signup {
  padding-top: 70px;
  // background-color: #00ce46;
  background-color: var(--color-dark);
  // background-color: #006746;
  min-height: 100vh;

  .logo {
    img {
      width: 150px;
      margin-bottom: 10px;
    }
  }

  .signup-box {
    padding: 35px 30px;
    border-radius: 10px;
    margin-bottom: 50px;
    background-color: white;
    -webkit-box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);

    h1{
      font-size: 24px;
      font-weight: 900;
      margin-bottom: 10px;
    }

    .social-text {
      text-align: left;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .form-content {

      h3 {
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