<template>
  <div class="configContent">
    <nav-bar ref="nav" :scrollTop="scrollTop">
      <template v-slot:left>
        <div class="back" @click="$router.go(-1)">
          <b-icon :icon="'arrow-left'" :size="'is-medium'"></b-icon>
        </div>
      </template>

      <template v-slot:title>
        <!-- <div class="spacer"></div> -->
        <div class="pageTitle">Configurações do Usuário</div>

        <div class="spacer"></div>
      </template>

      <template v-slot:right></template>
    </nav-bar>

    <div class="userConfig" v-if="user">
      <div
        class="userDetails"
        v-if="!passwordForm && !emailForm"
        @scroll="
          a => {
            scrollTop = a.target.scrollTop;
          }
        "
      >
        <div class="detail fullname">
          <strong>Nome:</strong>
          {{user.fullName}}
        </div>
        <div class="detail email">
          <strong>Email:</strong>
          {{user.email}}
        </div>

        <div class="detail currentsubscriptionPlan">
          <strong>Plano:</strong>
          {{ subscriptionPlan }}
        </div>

        <div class="subscriptionPlans" v-if="subscriptionPlan == 'Grátis'">
          <strong>Planos disponíveis:</strong>

          <div class="subscriptionPlan">
            <div class="label">Mensal</div>
            <div class="is-2 pricing">R$ 29,90</div>
            <div class="getButton">
              <a class @click="subscribePlan('monthly')">Assinar</a>
            </div>
          </div>
          <div class="subscriptionPlan">
            <div class="label">Premium</div>
            <div class="pricing">R$ 599,00</div>
            <div class="getButton">
              <a class @click="subscribePlan('premium')">Assinar</a>
            </div>
          </div>
          <div class="compare">
            <a href="https://vantum.com.br/#pricing" target="_blank">Compare os planos</a>
          </div>
        </div>

        <div class="createCompany has-text-centered" v-if="company && company.slug == 'vantum'">
          <router-link :to="{ name: 'SignupCompany', params: { inputUser: this.user } }">
            <a class="button is-primary changePassword">Cadastrar empresa</a>
          </router-link>
        </div>

        <div
          class="editCompany has-text-centered"
          v-if="company && company.slug != 'vantum' && company.owner == getUser._id || getUser.isSuperAdmin"
        >
          <router-link :to="{ name: 'CompanyConfig' }">
            <a class="button is-primary changePassword">Editar empresa</a>
          </router-link>
        </div>

        <div class="has-text-centered">
          <a class="button is-primary changePassword" @click="changePassword()">Trocar Senha</a>
          <!-- <a class="button is-primary changeEmail" @click="changeEmail()">Trocar E-mail</a> -->
        </div>
      </div>

      <password-form v-if="passwordForm"></password-form>

      <email-form v-if="emailForm"></email-form>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import PasswordForm from "./PasswordForm";
import EmailForm from "./EmailForm.vue";
import NavBar from "@/components/app/NavBar";

export default {
  name: "user-config",
  components: {
    NavigationMenu,
    PasswordForm,
    EmailForm,
    NavBar
  },
  data() {
    return {
      scrollTop: 0,
      arrowBack: true,
      user: null,
      passwordForm: false,
      emailForm: false
    };
  },
  mounted() {
    this.user = this.$store.getters.getUser;
  },
  methods: {
    subscribePlan(plan) {
      let req = {
        id: this.user.id,
        subscriptionPlan: plan
      };

      this.$store.dispatch("subscribePlan", req).then(() => {
        this.$buefy.dialog.alert({
          title: "Assinatura de plano",
          message:
            "<p>Em minutos entraremos em contato para prosseguir com a solicitação.</p><br><p>Agradecemos a preferência!</p>",
          confirmText: "OK"
        });
      });
    },
    changePassword() {
      this.passwordForm = true;
    },
    changeEmail() {
      this.emailForm = true;
    }
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    },
    company() {
      return this.$store.getters.getCurrentCompany;
    },
    subscriptionPlan() {
      if (
        this.user.subscriptionPlan != null &&
        this.user.subscriptionPlan != "" &&
        this.user.subscriptionPlan != "free"
      ) {
        return this.user.subscriptionPlan;
      } else if (this.user.subscriptionPlan == "premium") {
        return "Premium";
      } else if (this.user.subscriptionPlan == "monthly") {
        return "Mensal";
      } else {
        return "Grátis";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.configContent {
  position: relative;
  width: 100%;
  overflow-y: auto;

  display: flex;
  flex-flow: column;
  align-items: stretch;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  flex: 1;

  .pageTitle {
    line-height: 30px;
    font-size: 22px;
    font-weight: bold;
    width: calc(100% - 20px);
    align-self: flex-end;

    .icon {
      vertical-align: sub;
    }
  }

  .userConfig {
    width: 100%;
    padding: 10px;
    height: 100%;
    flex-shrink: 0;
    overflow-y: auto;
    flex: 1 1 auto;

    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 8px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      // border-radius: 10px;
      background-color: #888;
    }

    .userDetails {
      .detail {
        margin-bottom: 20px;
      }
    }

    .createCompany,
    .editCompany {
      margin-bottom: 20px;
    }

    .currentsubscriptionPlan {
      margin-bottom: 20px;
    }

    .navigationMenu {
      margin-bottom: 20px;
      margin-top: 20px;
    }

    .subscriptionPlans {
      margin-bottom: 20px;

      .compare {
        text-align: center;
        a {
          color: var(--color-light);
        }
      }

      .subscriptionPlan {
        margin-left: 20px;

        &:first-child {
          margin-top: 10px;
        }

        .label {
          display: inline-block;
          width: 70px;
        }
        .pricing {
          display: inline-block;
          width: 180px;
        }
        .getButton {
          display: inline-block;

          a {
            font-weight: bold;
            color: var(--color-light);
          }
        }
      }
    }

    .changePassword {
      margin-right: 15px;
    }
  }
}
</style>