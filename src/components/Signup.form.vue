<template>
  <div class="signup-form">
    <form>
      <b-field
        label="Nome"
        :type="{ 'is-danger': errors.has('name') }"
        :message="errors.first('name')"
      >
        <b-input
          v-model="user.name"
          v-validate="'required'"
          name="name"
          icon-pack="fas"
          icon="user"
        ></b-input>
      </b-field>

      <b-field
        label="Email"
        :type="{ 'is-danger': errors.has('email') }"
        :message="errors.first('email')"
      >
        <b-input
          type="text"
          v-model="user.email"
          name="email"
          v-validate="'required|email|verify_email'"
          icon-pack="fas"
          icon="envelope"
        />
      </b-field>

      <b-field
        label="CPF"
        :type="{ 'is-danger': errors.has('cpf') }"
        :message="errors.first('cpf')"
      >
        <b-input
          type="text"
          v-model="user.cpf"
          name="cpf"
          v-validate="'required'"
          v-mask="'###.###.###-##'"
        />
      </b-field>

      <b-field
        label="Telefone"
        :type="{ 'is-danger': errors.has('phone') }"
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
            name="phone"
            v-validate="'required'"
            v-mask="'(##) ### ### ###'"
          />
        </div>
      </b-field>

      <b-field
        label="Senha"
        :type="{ 'is-danger': errors.has('password') }"
        :message="errors.first('password')"
      >
        <b-input
          type="password"
          value
          name="password"
          v-validate="'required|min:8|verify_password'"
          ref="password"
          password-reveal
          v-model="user.password"
          icon-pack="fas"
          icon="key"
        ></b-input>
      </b-field>

      <b-field
        label="Confirme sua senha"
        :type="{ 'is-danger': errors.has('password_confirmation') }"
        :message="errors.first('password_confirmation')"
      >
        <b-input
          type="password"
          value
          v-validate="'required|confirmed:password'"
          name="password_confirmation"
          password-reveal
          v-model="password_confirmation"
          icon-pack="fas"
          icon="key"
        ></b-input>
      </b-field>

      <b-field
        label="Como nos conheceu?"
        :type="{ 'is-danger': errors.has('referer') }"
        :message="errors.first('referer')"
      >
        <b-taginput
          v-model="user.referers"
          :data="filteredReferers"
          autocomplete
          :allow-new="true"
          :open-on-focus="true"
          field="user.referer"
          icon="label"
          placeholder="Selecione ou digite"
          @typing="getFilteredReferers"
        >
        </b-taginput>
      </b-field>

      <b-field
        :type="{ 'is-danger': errors.has('flag-terms') }"
        :message="{
          'Você deve aceiar os termos para efetuar o cadastro': errors.firstByRule(
            'flag-terms',
            'required'
          )
        }"
      >
        <b-checkbox
          v-model="flagTerms"
          name="flag-terms"
          v-validate="'required:true'"
          type="is-success"
        >
          Declaro que li e aceito&nbsp;
          <span class="terms-link" @click.stop="isTermsModalActive = true"
            >os termos e condições</span
          >.
        </b-checkbox>
      </b-field>

      <b-field v-if="showButton">
        <b-button
          class="signup-button button"
          :loading="loading"
          @click="submit"
          >Registrar</b-button
        >
        <!-- <a class="signup-button button" @click="validateBeforeSubmit">Registrar</a> -->
      </b-field>
    </form>

    <b-modal :active.sync="isTermsModalActive" has-modal-card>
      <terms></terms>
    </b-modal>
  </div>
</template>

<script>
import Terms from "@/components/Terms";
import VueCountryCode from "vue-country-code";
import "vue-country-code/dist/vue-country-code.css";

export default {
  name: "signup-form",
  props: {
    nextUrl: {
      type: String,
      default: null
    },
    showButton: {
      type: Boolean,
      default: true
    },
    redirect: {
      type: Boolean,
      default: true
    },
    userObj: {
      type: Object,
      default: null
    }
  },
  components: {
    Terms,
    VueCountryCode
  },
  data() {
    return {
      isTermsModalActive: false,
      user: {
        name: "",
        email: "",
        password: "",
        cpf: "",
        referers: [],
        subscriptionPlan: "free"
      },
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
        country: "brazil"
      },
      password_confirmation: "",
      flagTerms: false,
      loading: false,
      filteredReferers: ["Google", "Facebook", "Instagram", "Outro, Qual?"],
      referers: ["Google", "Facebook", "Instagram", "Outro, Qual?"],
      masks: {
        cpf: {
          delimiters: [".", ".", "-"],
          blocks: [3, 3, 3, 2],
          numericOnly: true
        },

        phone: {
          delimiters: ["(", ")", " ", " ", " ", " "],
          blocks: [0, 2, 0, 3, 3, 3],
          numericOnly: true
        }
      }
      // is_admin: null
    };
  },
  mounted() {
    if (this.$route.query.name) {
      this.user.name = this.$route.query.name;
    }
    if (this.$route.query.email) {
      this.user.email = this.$route.query.email;
    }
    if (this.$route.query.subscriptionPlan) {
      this.user.subscriptionPlan = this.$route.query.subscriptionPlan;
    }
    if (this.userObj) {
      this.user = this.userObj;
    }
  },
  methods: {
    onSelectCountry: function({ dialCode }) {
      this.phone.countryCode = dialCode;
    },

    register: function() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let user = {
          name: this.user.name,
          email: this.user.email,
          phone: {
            countryCode: this.phone.countryCode,
            number: this.phone.number.replace(/\D/g, ""),
            phoneType: this.phone.phoneType
          },
          cpf: this.user.cpf,
          password: this.user.password,
          referers: this.user.referers,
          subscriptionPlan: this.user.subscriptionPlan
        };
        this.$store
          .dispatch("register", user)
          .then(response => {
            this.loading = false;

            if (this.redirect) {
              this.$router.push({
                name: "SignupSuccess",
                params: {
                  userObj: response.user,
                  subscriptionPlan: this.user.subscriptionPlan
                }
              });
            }
            resolve(response.user);

            // this.$parent.user = user.data.user
            // this.$parent.registered = true;
          })
          .catch(err => {
            this.loading = false;

            console.log(err.response);
            if (err.data.message == "User already registered") {
              this.$buefy.toast.open({
                message: "Usuário já registrado. Esqueceu a senha?",
                type: "is-danger",
                position: "is-bottom"
              });
            }
            reject(err);
          });
      });
    },

    submit() {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.register()
              .then(user => {
                resolve(user);
              })
              .catch(err => {});
            return;
          }
          this.$buefy.toast.open({
            message: "Formulário inválido, verifique os campos.",
            type: "is-danger",
            position: "is-bottom"
          });
        });
      });
    },
    getFilteredReferers(text) {
      this.filteredReferers = this.referers.filter(option => {
        return option.toLowerCase().indexOf(text.toLowerCase()) >= 0;
      });
    }
  }
};
</script>

<style lang="scss">
.signup-form {
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

  .email-input {
  }

  .password-input {
  }

  .animation-content {
    z-index: 1;
    max-width: 960px;
    overflow-y: scroll;
    margin-top: 40px !important;
    margin-bottom: 40px !important;
  }

  .terms-link {
    text-decoration: underline;
    cursor: pointer;
    color: var(--color-light);
  }

  .signup-button {
    transition: all 400ms ease;
    background-color: var(--color-light);
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

  .control.has-icons-left .icon,
  .control.has-icons-right .icon {
    pointer-events: auto;
  }
}
</style>
