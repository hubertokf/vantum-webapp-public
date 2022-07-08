<template>
  <div class="phone-form">
    <b-field
      label="Telefone"
      :type="{ 'is-danger': errors.has('phone-a') }"
      :message="errors.first('phone-a')"
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
          name="phone-a"
          v-validate="'required'"
        />
      </div>
    </b-field>
  </div>
</template>

<script>
import VueCountryCode from "vue-country-code";
import "vue-country-code/dist/vue-country-code.css";
export default {
  name: "phone-form",
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  components: {
    VueCountryCode
  },
  data() {
    return {
      phone: {
        number: "",
        phoneType: "",
        countryCode: "55"
      }
    };
  },
  mounted() {
    if (this.user && this.user.phone) {
      this.phone = this.$clone(this.user.phone);
    }
  },
  methods: {
    setPhone(phone) {
      this.phone = phone;
    },
    onSelectCountry: function({ dialCode }) {
      this.phone.countryCode = dialCode;
    },
    submit() {
      return new Promise(async (resolve, reject) => {
        const results = Promise.all([this.$validator.validate("phone-a")]);

        const areValid = (await results).every(isValid => isValid);

        if (areValid) {
          let editedUser = {
            id: this.user.id,
            phone: {
              countryCode: this.phone.countryCode,
              number: this.phone.number.replace(/\D/g, ""),
              phoneType: this.phone.phoneType
            }
          };
          this.$store.dispatch("editLoggedUser", editedUser).then(user => {
            resolve(user);
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.phone-form {
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
</style>
