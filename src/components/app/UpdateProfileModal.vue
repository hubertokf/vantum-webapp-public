<template>
  <div class="update-profile-modal modal-card">
    <div class="info">
      <div class="columns">
        <div class="column">
          <div class="title">Atualize seu cadastro!</div>
          <b-steps
            size="is-small"
            v-model="activeStep"
            :animated="isAnimated"
            :has-navigation="hasNavigation"
            ariaNextLabel="teste"
            ariaPreviousLabel="teste"
          >
            <b-step-item
              type="is-success"
              label="Telefone"
              :clickable="isStepsClickable"
            >
              <phone-form :user="user" :showButton="false" ref="phoneForm"></phone-form>

              <b-field>
                <b-button
                  class="signup-button button next-bt is-primary is-pulled-right"
                  @click="savePhone"
                  >Próximo</b-button
                >
              </b-field>
            </b-step-item>

            <b-step-item
              type="is-success"
              label="Endereço"
              :clickable="isStepsClickable"
            >
              <address-form
                :user="user"
                :showButton="false"
                ref="addressForm"
              ></address-form>

              <b-field>
                <b-button
                  class="signup-button button prev-bt is-primary is-pulled-left"
                  @click="previousStep"
                  >Anterior</b-button
                >
              </b-field>
              <b-field>
                <b-button
                  class="signup-button button next-bt is-primary is-pulled-right"
                  @click="saveAddress"
                  >Próximo</b-button
                >
              </b-field>
            </b-step-item>

            <b-step-item
              type="is-success"
              label="Finalizar"
              :clickable="isStepsClickable"
            >
              <div class="thanks">Obrigado!</div>

              <b-field>
                <b-button
                  class="signup-button button finish-bt is-primary is-pulled-right"
                  @click="finishStep"
                  >Finalizar</b-button
                >
              </b-field>
            </b-step-item>
          </b-steps>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCountryCode from "vue-country-code";
import "vue-country-code/dist/vue-country-code.css";
import cep from "cep-promise";
import rp from "request-promise";
import AddressForm from "@/components/app/profile/AddressForm";
import PhoneForm from "@/components/app/profile/PhoneForm";

export default {
  name: "update-profile-modal",
  components: {
    VueCountryCode,
    AddressForm,
    PhoneForm
  },
  mounted() {
    if (this.$store.getters.getUser.phone) {
      this.phone = {
        number: this.$store.getters.getUser.phone.number,
        phoneType: this.$store.getters.getUser.phone.phoneType,
        countryCode: this.$store.getters.getUser.phone.countryCode
      };
      this.activeStep = 1;
    }
    if (this.$store.getters.getUser.address) {
      this.address = {
        address1: this.$store.getters.getUser.address1,
        address2: this.$store.getters.getUser.address2,
        houseNumber: this.$store.getters.getUser.houseNumber,
        zipCode: this.$store.getters.getUser.zipCode,
        city: this.$store.getters.getUser.city,
        state: this.$store.getters.getUser.state,
        country: this.$store.getters.getUser.country
      };
    }
    this.getStates();
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

      editedUser: {},

      phone: {
        number: "",
        phoneType: "",
        countryCode: "55"
      },
      states: [],
      cities: [],
      selectedState: null,
      selectedCity: null,
      address: {
        address1: "",
        address2: "",
        houseNumber: "",
        zipCode: "",
        city: "",
        state: "",
        country: "brazil"
      }
    };
  },
  computed: {
    user: {
      get () {
        return this.$store.getters.getUser;
      },
      set (value) {
        this.$store.commit('edit_user', value)
      }
    }
  },
  methods: {
    stateSelect(state) {
      this.selectedState = state;
      this.address.state = state.sigla;
      this.getCities(state);
    },
    citySelect(city) {
      this.selectedCity = city;
      this.address.city = city.nome;
    },
    getStates() {
      var options = {
        uri: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
        json: true
      };

      rp(options)
        .then(repos => {
          this.states = repos;
        })
        .catch(err => {
          // API call failed...
        });
    },
    getCities(uf) {
      var options = {
        uri:
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" +
          uf.id +
          "/municipios",
        json: true
      };

      rp(options)
        .then(repos => {
          this.cities = repos;
          if (this.address.city) {
            let cityIndex = this.cities.findIndex(
              city => city.nome === this.address.city
            );

            this.selectedCity = this.cities[cityIndex];
          }
        })
        .catch(err => {
          // API call failed...
        });
    },
    onSelectCountry: function({ dialCode }) {
      this.phone.countryCode = dialCode;
    },
    zipChanged() {
      if (this.address.zipCode.length >= 7) {
        cep(this.address.zipCode)
          .then(r => {
            this.address.state = r.state;
            this.address.city = r.city;
            this.address.address1 = r.street;

            let stateIndex = this.states.findIndex(
              state => state.sigla === r.state
            );

            this.selectedState = this.states[stateIndex];
            // this.selectedCity = { nome: r.city };

            this.getCities(this.states[stateIndex]);
          })
          .catch(() => {});
      }
    },

    savePhone() {
      this.$refs.phoneForm.submit().then(user => {
        this.user = user;
        this.activeStep++;
      });
    },
    saveAddress() {
      this.$refs.addressForm.submit().then(user => {
        this.user = user;
        this.activeStep++;
      });
    },
    // savePhone() {
    //   let _this = this;
    //   this.$validator.validate("phone").then(function(result) {
    //     if (result) {
    //       let editedUser = {
    //         id: _this.$store.getters.getUser.id,
    //         phone: {
    //           countryCode: _this.phone.countryCode,
    //           number: _this.phone.number.replace(/\D/g, ""),
    //           phoneType: _this.phone.phoneType
    //         }
    //       };
    //       _this.$store.dispatch("editLoggedUser", editedUser);
    //       _this.activeStep++;
    //       return;
    //     }
    //   });
    // },
    // async saveAddress() {
    //   const results = Promise.all([
    //     this.$validator.validate("zipCode"),
    //     this.$validator.validate("state"),
    //     this.$validator.validate("city"),
    //     this.$validator.validate("address1"),
    //     this.$validator.validate("houseNumber")
    //   ]);

    //   const areValid = (await results).every(isValid => isValid);

    //   if (areValid) {
    //     this.address.zipCode = this.address.zipCode.replace(/\D/g, "");
    //     let editedUser = {
    //       id: this.$store.getters.getUser.id,
    //       address: this.address
    //     };
    //     this.$store.dispatch("editLoggedUser", editedUser);
    //     this.activeStep++;
    //     return;
    //   }
    // },
    skipSocial() {
      this.activeStep++;
    },
    finishStep() {
      this.$parent.close();
    },

    nextStep() {
      if (this.activeStep < 2) {
        if (this.activeStep == 0) {
          this.$validator.validate("phone").then(result => {
            if (result) {
              this.activeStep++;
              return;
            }
          });
        }
      }
    },

    previousStep() {
      if (this.activeStep > 0) {
        this.activeStep--;
      }
    }
  }
};
</script>

<style lang="scss">
.update-profile-modal {
  margin: auto;
  position: relative;
  // max-width: 100%;
  // padding: 10px;

  .phone-form{
    margin-bottom: 20px;
  }

  .address-form{
    margin-bottom: 20px;
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

    .next-bt {
    }
    .prev-bt {
    }
    .skip-bt {
      margin-right: 10px;
    }

    .thanks {
      color: #363636;
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.125;
      text-align: center;
      margin-bottom: 30px;
    }

    .step-items {
      width: 100%;
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
}
</style>
