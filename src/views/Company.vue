<template>
  <div class="company-view">
    <router-view></router-view>
  </div>
</template>

<script>
import LoginForm from "@/components/Login.form";
import LoginSocial from "@/components/Login.social";

export default {
  name: "company-view",
  props: {
    companySlug: {
      type: String,
      default: "Vantum"
    },
  },
  data: () => ({
    company: null,
  }),

  components: {
    LoginForm,
    LoginSocial
  },
  created() {
    
  },
  mounted() {
    this.$router.push({ name: 'App' })
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
.company-view {
  background-color: var(--color-dark);
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
    background-color: var(--color-light);
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
