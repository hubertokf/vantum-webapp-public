<template>
  <div class="request-email-confirmation">
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>
    <div class="container" v-if="!isLoading">
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
          <div class="box">
            <div class="form-content">
              <div v-if="!expired && !confirmed">
                <h3>Email não confirmado</h3>
                <p>Você ainda não confirmou seu email. Para isso acesse seu email e clique no link enviado a você.</p>
                <p>Caso não tenha recebido este email, preencha seu email abaixo e enviaremos outro.</p>

                <email-confirmation></email-confirmation>
              </div>

              <div v-if="expired">
                <h3>Solicitação vencida</h3>
                <p>O link que você utilizou para confirmar este email já não vale mais.</p>
                <p>Preencha seu email abaixo para enviarmos outro.</p>

                <email-confirmation></email-confirmation>
              </div>

              <div v-if="confirmed" class="confirmed">
                <h3>Email confirmado</h3>
                <p>
                  Este email já está confirmado
                  <br />Clique abaixo para efetuar login
                </p>
                <a class="login-button button" href="/login">Login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormEmailConfirmation from "@/components/EmailConfirmation.form";

export default {
  name: "email-confirmation-view",
  data: () => ({
    email: "",
    expired: false,
    confirmed: false,
    isLoading: false
  }),

  components: {
    "email-confirmation": FormEmailConfirmation
  },

  mounted() {
    this.isLoading = true;
    if ("token" in this.$route.query) {
      this.$store
        .dispatch("confirmEmail", this.$route.query.token)
        .then(resp => {
          if (resp == "Email confirmed") {
            this.confirmed = true;
            this.isLoading = false;
            this.$buefy.toast.open({
              message: "Este email confirmado",
              type: "is-success",
              position: "is-bottom"
            });
          } else {
            this.isLoading = false;
            this.$buefy.toast.open({
              message: "Erro, solicite novamente",
              type: "is-danger",
              position: "is-bottom"
            });
          }
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response.data == "Unauthorized") {
            this.$store
              .dispatch("confirmEmail", this.$route.query.token)
              .then(resp => {
                if (resp == "Email confirmed") {
                  this.confirmed = true;
                  this.isLoading = false;
                  this.$buefy.toast.open({
                    message: "Este email confirmado",
                    type: "is-success",
                    position: "is-bottom"
                  });
                } else {
                  this.isLoading = false;
                  this.$buefy.toast.open({
                    message: "Erro, solicite novamente",
                    type: "is-danger",
                    position: "is-bottom"
                  });
                }
              })
              .catch(err => {
                this.isLoading = false;
                if (err.response.data == "Token Expired/Invalid") {
                  this.expired = true;
                  this.$buefy.toast.open({
                    message: "Token expirado, solicite novamente",
                    type: "is-danger",
                    position: "is-bottom"
                  });
                }
              });
          }
          if (err.response.data == "Token Expired/Invalid") {
            this.expired = true;
            this.$buefy.toast.open({
              message: "Token expirado, solicite novamente",
              type: "is-danger",
              position: "is-bottom"
            });
          }
        });
    } else {
      this.expired = false;
      this.confirmed = false;
      this.isLoading = false;

      this.$buefy.toast.open({
        message: "Token expirado, solicite novamente",
        type: "is-danger",
        position: "is-bottom"
      });
    }
  },

  computed: {
    company() {
      return this.$store.getters.getCurrentCompany;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.request-email-confirmation {
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

  .box {
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

    .login-button {
      transition: all 400ms ease;
      background-color: var(--color-light);
      // background-color: #00ce46;
      color: #fff;
      -webkit-box-shadow: 0 0 0 rgba(0, 0, 0, 0.16);
      box-shadow: 0 0 0 rgba(0, 0, 0, 0.16);
      border: 0;

      &:hover {
        -webkit-box-shadow: 0 5px 6px rgba(0, 0, 0, 0.16);
        box-shadow: 0 5px 6px rgba(0, 0, 0, 0.16);
        border: 0;
      }
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

      .confirmed {
        text-align: center;

        h3,
        p {
          text-align: center;
        }
      }
    }
  }
}
</style>
