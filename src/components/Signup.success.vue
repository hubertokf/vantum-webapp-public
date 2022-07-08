<template>
  <div class="signup-success">
    <b-steps
      size="is-small"
      v-model="activeStep"
      :animated="true"
      :has-navigation="false"
      ariaNextLabel="teste"
      ariaPreviousLabel="teste"
    >
      <b-step-item type="is-success" label="Endereço" :clickable="false">
        <address-form
          :user="user"
          :showButton="false"
          ref="addressForm"
        ></address-form>

        <b-field>
          <b-button
            class="signup-button button next-bt is-primary is-pulled-right"
            @click="saveAddress"
            >Próximo</b-button
          >
        </b-field>
      </b-step-item>

      <b-step-item type="is-success" label="Perfil" :clickable="false">
        <professional-form
          :user="user"
          :showButton="false"
          ref="professionalForm"
        ></professional-form>

        <b-field>
          <b-button
            class="signup-button button next-bt is-primary is-pulled-right"
            @click="saveProfessional"
            >Próximo</b-button
          >
        </b-field>
      </b-step-item>

      <b-step-item type="is-success" label="Finalizar" :clickable="false">
        <h2>
          Obrigado
          <br />
          {{ fullName }}!
        </h2>
        <div class="signupMsg">
          Um email foi enviado. Clique no link para confirmar o seu cadastro
        </div>
        <br />
        <div class="subsMessage" v-if="checkSubscriptionPlan">
          Também entraremos em contato com instruções para pagamento do plano
          selecionado.
        </div>

        <!-- <router-link class="loginlink" to="/login">Fazer login</router-link> -->

        <b-field>
          <b-button
            class="signup-button button finish-bt is-primary is-pulled-right"
            @click="finishStep"
            >Acessar Conta</b-button
          >
        </b-field>
      </b-step-item>
    </b-steps>
  </div>
</template>

<script>
import { page } from "vue-analytics";
import AddressForm from "@/components/app/profile/AddressForm";
import ProfessionalForm from "@/components/app/profile/ProfessionalForm";

export default {
  name: "signup-sucess",
  props: ["userObj", "subscriptionPlan"],
  components: {
    AddressForm,
    "professional-form": ProfessionalForm
  },
  data() {
    return {
      activeStep: 0
    };
  },
  mounted() {
    page("/signup/success");
  },
  computed: {
    checkSubscriptionPlan() {
      if (this.subscriptionPlan != "free") {
        return true;
      } else {
        return false;
      }
    },
    fullName() {
      return this.user ? (this.user.fullName ? this.user.fullName : "") : "";
    },
    user: {
      get() {
        return this.$store.getters.getUser;
      },
      set(value) {
        this.$store.commit("edit_user", value);
      }
    }
  },
  methods: {
    saveAddress() {
      this.$refs.addressForm.submit().then(user => {
        this.user = user;
        this.activeStep++;
      });
    },

    saveProfessional() {
      this.$refs.professionalForm.submit().then(professional => {
        this.user.professional = professional;
        this.activeStep++;
      });
    },

    finishStep() {
      this.$router.push({ name: "App" });
    }
  }
};
</script>

<style lang="scss">
.signup-success {
  .address-form,
  .professional-form {
    margin-bottom: 15px;
  }

  .step-items {
    width: 100%;
  }

  h2 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .subsMessage {
    font-weight: bold;
  }

  .signupMsg {
    font-weight: bold;
  }

  .loginlink {
    margin-top: 20px;
    display: inline-block;
    color: var(--color-light);
  }
}
</style>
