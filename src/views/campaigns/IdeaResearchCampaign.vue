<template>
  <div class="idea-research">
    <div class="container">
      <div class="columns">
        <div class="is-offset-4 column is-4">
          <div class="logo">
            <a href="/">
              <img class="branco" src="../../assets/img/Marca_principal_branco.svg">
            </a>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="is-offset-3 column is-6">
          <div class="info">
            <h1>Formulário de participação</h1>
            <p>Preencha o formulário para participar da pesquisa de usuários.</p>

            <b-steps size="is-small" v-model="activeStep" :animated="isAnimated" :has-navigation="hasNavigation" ariaNextLabel="teste" ariaPreviousLabel="teste">
              <b-step-item type="is-success" label="Telefone" :clickable="isStepsClickable">
                <b-field
                  label="Telefone"
                  :type="{'is-danger': errors.has('phone')}"
                  :message="errors.first('phone')"
                >
                  <div class="phone-field">
                    <vue-country-code
                      class="phone-country"
                      @onSelect="onSelectCountry"
                      :disabledFetchingCountry="true"
                      :preferredCountries="['br']"
                      :enabledCountryCode="true"
                    />

                    <b-input
                      type="tel"
                      class="phone-input"
                      v-model="phone.number"
                      v-mask="'(##) ### ### ###'"
                      name="phone"
                      v-validate="'required'"
                    />
                  </div>
                </b-field>

                <b-field>
                  <b-button
                    class="signup-button button next-bt is-primary is-pulled-right"
                    @click="savePhone"
                  >Próximo</b-button>
                </b-field>
              </b-step-item>

              <b-step-item type="is-success" label="Endereço" :clickable="isStepsClickable">
                <b-field
                  label="CEP"
                  :type="{'is-danger': errors.has('zipCode')}"
                  :message="errors.first('zipCode')"
                >
                  <b-input v-model="address.zipCode" v-validate="'required'" name="zipCode" icon-pack="fas" icon="user" @input="zipChanged" v-mask="'##.###-###'"></b-input>
                </b-field>
                <b-field
                  label="Estado"
                  :type="{'is-danger': errors.has('state')}"
                  :message="errors.first('state')"
                >
                  <b-input v-model="address.state" v-validate="'required'" name="state" icon-pack="fas" icon="user" disabled></b-input>
                </b-field>
                <b-field
                  label="Cidade"
                  :type="{'is-danger': errors.has('city')}"
                  :message="errors.first('city')"
                >
                  <b-input v-model="address.city" v-validate="'required'" name="city" icon-pack="fas" icon="user" disabled></b-input>
                </b-field>

                <b-field
                  label="Endereço"
                  :type="{'is-danger': errors.has('address1')}"
                  :message="errors.first('address1')"
                >
                  <b-input v-model="address.address1" v-validate="'required'" name="address1" icon-pack="fas" icon="user" disabled></b-input>
                </b-field>

                <b-field
                  label="Número"
                  :type="{'is-danger': errors.has('houseNumber')}"
                  :message="errors.first('houseNumber')"
                >
                  <b-input v-model="address.houseNumber" v-validate="'required'" name="houseNumber" icon-pack="fas" icon="user"></b-input>
                </b-field>

                <b-field
                  label="Complemento"
                  :type="{'is-danger': errors.has('address2')}"
                  :message="errors.first('address2')"
                >
                  <b-input v-model="address.address2" name="address2" icon-pack="fas" icon="user"></b-input>
                </b-field>

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

              <b-step-item type="is-success" label="Ideia" :clickable="isStepsClickable">
                <b-field
                  label="Atuação"
                  :type="{'is-danger': errors.has('actuation')}"
                  :message="errors.first('actuation')"
                >
                  <b-input
                    type="text"
                    v-model="actuation"
                    name="actuation"
                    v-validate="'required'"
                  />
                </b-field>


                <b-field
                  label="Ideia"
                  :type="{'is-danger': errors.has('idea')}"
                  :message="errors.first('idea')">
                  <b-input 
                    maxlength="600"
                    type="textarea"
                    v-model="idea"
                    name="idea"
                    v-validate="'required'"
                  ></b-input>
                </b-field>

                <b-field>
                  <b-button
                    class="signup-button button finish-bt is-primary is-pulled-right"
                    @click="saveIdeaStep"
                  >Finalizar</b-button>
                </b-field>
              </b-step-item>

              <b-step-item type="is-success" label="Finalizar" :clickable="isStepsClickable">
                <div class="thanks">Obrigado pela participação!</div>

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
import VueCountryCode from "vue-country-code";
import "vue-country-code/dist/vue-country-code.css";
import cep from 'cep-promise'

export default {
  name: "idea-research",
  components: {
    VueCountryCode
  },
  data() {
    return {
      activeStep: 0,
      showSocial: false,
      isAnimated: true,
      hasNavigation: false,
      isStepsClickable: true,
      isProfileSuccess: false,
      loading: false,
      idea: "",
      editedUser: {},
      actuation: "",

      user: null,

      phone: {
        number: "",
        phoneType: "",
        countryCode: "55"
      },
      address: {
        address1: "",
        address2: "",
        houseNumber: "",
        zipCode: "",
        city: "",
        state: "",
        country: "brazil",
      }
    };
  },

  mounted() {
    this.user = this.$store.getters.getUser
  },

  methods: {
    onSelectCountry: function({ dialCode }) {
      this.phone.countryCode = dialCode;
    },
    zipChanged(){
      if (this.address.zipCode.length >= 7){
        cep(this.address.zipCode).then((r)=>{
          this.address.state = r.state
          this.address.city = r.city
          this.address.address1 = r.street
        })
        .catch(()=>{})
      }
    },
    savePhone(){
      let _this = this
      this.$validator.validate('phone').then(function(result) {
        if (result) {
          let editedUser = { 
            id:_this.$store.getters.getUser.id,
            phone: {
              countryCode: _this.phone.countryCode,
              number: _this.phone.number.replace(/\D/g,''),
              phoneType: _this.phone.phoneType
            }
          }
          _this.$store.dispatch('editLoggedUser', editedUser)
          _this.activeStep++
          return;
        }
      });
    },
    async saveAddress(){
      const results = Promise.all([
        this.$validator.validate('zipCode'),
        this.$validator.validate('state'),
        this.$validator.validate('city'),
        this.$validator.validate('address1'),
        this.$validator.validate('houseNumber')
      ]);

      const areValid = (await results).every(isValid => isValid);

      if (areValid) {
        this.address.zipCode = this.address.zipCode.replace(/\D/g,'')
        let editedUser = { 
          id: this.$store.getters.getUser.id,
          address: this.address
        }
        this.$store.dispatch('editLoggedUser', editedUser)
        this.activeStep++
        return;
      }

    },
    skipSocial(){
      this.activeStep++
    },
    async saveIdeaStep(){

      const results = Promise.all([
        this.$validator.validate('idea')
      ]);

      const areValid = (await results).every(isValid => isValid);

      let params = {
        idea: this.idea,
        user: this.$store.getters.getUser,
        actuation: this.actuation
      }

      if (areValid) {
        this.$store.dispatch('postIdea', params)
        this.activeStep++
        return;
      }

    },
    finishStep(){
      this.$router.push('/vantum/app')
    },

    nextStep() {
      if (this.activeStep < 2){
        if (this.activeStep == 0){
          this.$validator.validate('phone').then(result => {
            if (result) {
              this.activeStep++
              return;
             }
          });
        }

      }
    },

    previousStep() {
      if (this.activeStep > 0){
        this.activeStep--
      }
    }
  }
};
</script>

<style lang="scss">
.idea-research {
  padding-top: 70px;
  // background-color: #00ce46;
  background-color: #006746;
  min-height: 100vh;

  h1{
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 20px;
  }

  p{
    text-align: left;
    margin-bottom: 20px;
  }


  .logo {
    img {
      width: 200px;
    }
  }

  .title {
    color: #363636;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1.125;
    text-align: center;
  }


  .info {
    position: relative;
    background-color: white;
    color: black;
    margin: 0;
    padding: 20px;

    overflow-x: hidden;
    overflow-y: auto;


    .b-steps{

      .steps{

        .step-items{
          width: 100%;
        }
      }
        
    }


    .next-bt{
    }
    .prev-bt{
    }
    .skip-bt{
      margin-right: 10px;
    }

    .thanks{
      color: #363636;
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.125;
      text-align: center;
      margin-bottom: 30px;
    }
    


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

    .field {
      .label {
        text-align: left;
      }
    }

    label.label {
      text-align: left;
    }

    .vue-country-select {
      border: 1px solid #dbdbdb;
      border-right: 0;
    }

    .phone-field {
      text-align: left;
      position: relative;

      .phone-country {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        border: 0;

        .iti-flag {
          margin-right: 3px;
        }

        .dropdown {
          width: 80px;

          ul {
            z-index: 10;
          }

          &:hover {
            background-color: transparent;
          }
        }
      }

      .phone-input {
        input {
          padding-left: 80px;
        }
      }
    }
  }

  .login-box {
    padding: 35px 30px;
    margin-bottom: 50px;
    border-radius: 10px;
    background-color: white;
    -webkit-box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.16);

    .form-content {

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
