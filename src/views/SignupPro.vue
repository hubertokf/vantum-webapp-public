<template>
  <div class="signup-pro">
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
            <b-steps
              size="is-small"
              v-model="activeStep"
              :animated="true"
              :has-navigation="false"
            >
              <b-step-item type="is-success" label="Usuário" :clickable="isStepsClickable">
                <h1>Cadastro de Usuário Profissional</h1>
                <signup-form :showButton="false" :userObj="user" ref="signupForm"></signup-form>

                <b-field>
                  <b-button
                    class="signup-button button next-bt is-primary is-pulled-right"
                    @click="saveAccount"
                  >Próximo</b-button>
                </b-field>

              </b-step-item>

              <b-step-item type="is-success" label="Telefone" :clickable="isStepsClickable">
                <h1>Cadastro de Telefone</h1>
                <phone-form :user="user" :showButton="false" ref="phoneForm"></phone-form>

                <b-field>
                  <b-button
                    class="signup-button button next-bt is-primary is-pulled-right"
                    @click="savePhone"
                  >Próximo</b-button>
                </b-field>
              </b-step-item>

              <b-step-item type="is-success" label="Endereço" :clickable="isStepsClickable">
                <h1>Cadastro de Endereço</h1>
                <address-form :user="user" :showButton="false" ref="addressForm"></address-form>

                <b-field>
                  <b-button
                    class="signup-button button prev-bt is-primary is-pulled-left"
                    @click="previousStep"
                  >Anterior</b-button>
                </b-field>
                <b-field>
                  <b-button
                    class="signup-button button next-bt is-primary is-pulled-right"
                    @click="saveAddress"
                  >Próximo</b-button>
                </b-field>
              </b-step-item>
              
              <b-step-item type="is-success" label="Perfil Profissional" :clickable="isStepsClickable">
                <h1>Cadastro de Profissional</h1>
                <professional-form :user="user" :showButton="false" ref="professionalForm"></professional-form>

                <b-field>
                  <b-button
                    class="signup-button button prev-bt is-primary is-pulled-left"
                    @click="previousStep"
                  >Anterior</b-button>
                </b-field>
                <b-field>
                  <b-button
                    class="signup-button button next-bt is-primary is-pulled-right"
                    @click="saveProfessional"
                  >Próximo</b-button>
                </b-field>
              </b-step-item>

              <b-step-item type="is-success" label="Finalizar" :clickable="isStepsClickable">
                <div class="thanks">Obrigado!</div>

                <b-field>
                  <b-button
                    class="signup-button button finish-bt is-primary is-pulled-right"
                    @click="finishStep"
                  >Finalizar</b-button>
                </b-field>
              </b-step-item>
            </b-steps>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignupForm from "@/components/Signup.form";
import PhoneForm from "@/components/app/profile/PhoneForm";
import AddressForm from "@/components/app/profile/AddressForm";
import ProfessionalForm from "@/components/app/profile/ProfessionalForm";
export default {
  name: "signup-pro",
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  components: {
    SignupForm,
    PhoneForm,
    AddressForm,
    ProfessionalForm
  },
  data() {
    return {
      isStepsClickable: true,
      activeStep: 3,
      subscriptionPlan: ""
    };
  },
  mounted() {
    if (this.user) {
      if (!this.user.phone) {
        this.activeStep = 1
      }else if(!this.user.address) {
        this.activeStep = 2
      }else{
        this.activeStep = 3
      }
    }
  },

  computed: {
    company() {
      return this.$store.getters.getCurrentCompany 
    },
  },
  methods: {
    saveAccount (){
      this.$refs.signupForm.submit().then(()=>{
        this.activeStep++
      })
    },
    savePhone (){
      this.$refs.phoneForm.submit().then(()=>{
        this.activeStep++        
      })
    },
    saveAddress (){
      this.$refs.addressForm.submit().then(()=>{
        this.activeStep++        
      })
    },
    saveProfessional (){
      this.$refs.professionalForm.submit().then(()=>{
        this.activeStep++
      })
    },
    previousStep() {
      if (this.activeStep > 0){
        this.activeStep--
      }
    },
    finishStep() {
      this.$router.push('/vantum/app/pro')
    },
  },
};
</script>

<style lang="scss">
.signup-pro {
  padding-top: 70px;
  // background-color: #00ce46;
  background-color: var(--color-dark);
  // background-color: #006746;
  min-height: 100vh;

  .logo {
    img {
      width: 200px;
    }
  }

  .signup-box {
    padding: 35px 30px;
    border-radius: 10px;
    margin-bottom: 50px;
    background-color: white;
    -webkit-box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);

    .signup-form, .phone-form, .address-form, .professional-form{
      margin-bottom: 15px;
    }

    .step-items{
      width: 100%;
    }

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