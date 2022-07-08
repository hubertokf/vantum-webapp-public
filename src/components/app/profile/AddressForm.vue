<template>
  <div class="address-form">
    <b-field
      label="CEP"
      :type="{ 'is-danger': errors.has('zipCode') }"
      :message="errors.first('zipCode')"
    >
      <b-input
        v-model="address.zipCode"
        v-validate="'required'"
        name="zipCode"
        icon-pack="fas"
        icon="user"
        @input="zipChanged"
      ></b-input>
    </b-field>
    <b-field
      label="Estado"
      :type="{ 'is-danger': errors.has('state') }"
      :message="errors.first('state')"
    >
      <b-select
        placeholder="Selecione um estado"
        v-model="selectedState"
        v-validate="'required'"
        name="state"
        expanded
        @input="stateSelect"
      >
        <option v-for="state in states" :value="state" :key="'state-' + state.id">{{ state.nome }}</option>
      </b-select>
      <!-- <b-input
        v-model="address.state"
        v-validate="'required'"
        name="state"
        icon-pack="fas"
        icon="user"
        disabled
      ></b-input>-->
    </b-field>
    <b-field
      label="Cidade"
      :type="{ 'is-danger': errors.has('city') }"
      :message="errors.first('city')"
    >
      <b-select
        placeholder="Selecione uma cidade"
        v-model="selectedCity"
        v-validate="'required'"
        name="city"
        expanded
        @input="citySelect"
      >
        <option v-for="city in cities" :value="city" :key="'city-' + city.id">{{ city.nome }}</option>
      </b-select>
      <!-- <b-input
        v-model="address.city"
        v-validate="'required'"
        name="city"
        icon-pack="fas"
        icon="user"
        disabled
      ></b-input>-->
    </b-field>

    <b-field
      label="Endereço"
      :type="{ 'is-danger': errors.has('address1') }"
      :message="errors.first('address1')"
    >
      <b-input v-model="address.address1" v-validate="'required'" name="address1"></b-input>
    </b-field>

    <b-field
      label="Número"
      :type="{ 'is-danger': errors.has('number') }"
      :message="errors.first('number')"
    >
      <b-input v-model="address.houseNumber" v-validate="'required'" name="number"></b-input>
    </b-field>

    <b-field
      label="Complemento"
      :type="{ 'is-danger': errors.has('address2') }"
      :message="errors.first('address2')"
    >
      <b-input v-model="address.address2" name="address2" icon-pack="fas" icon="user"></b-input>
    </b-field>
  </div>
</template>

<script>
import cep from "cep-promise";
import rp from "request-promise";

export default {
  name: "address-form",
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
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
  mounted() {
    if (this.user && this.user.address) {
      this.address = this.$clone(this.user.address);
    }
    this.getStates();
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
    zipChanged() {
      if (this.address.zipCode.length >= 7) {
        var options = {
          uri: "https://api.pagar.me/1/zipcodes/" + this.address.zipCode,
          json: true
        };

        rp(options)
          .then(response => {
            this.address.state = response.state;
            this.address.city = response.city;
            this.address.address1 = response.street;

            let stateIndex = this.states.findIndex(
              state => state.sigla === response.state
            );

            this.selectedState = this.states[stateIndex];

            this.getCities(this.states[stateIndex]);
          })
          .catch(err => {
            // API call failed...
          });

        // cep(this.address.zipCode)
        //   .then(r => {
        //     this.address.state = r.state;
        //     this.address.city = r.city;
        //     this.address.address1 = r.street;

        //     let stateIndex = this.states.findIndex(
        //       state => state.sigla === r.state
        //     );

        //     this.selectedState = this.states[stateIndex];

        //     this.getCities(this.states[stateIndex]);
        //   })
        //   .catch(() => {});
      }
    },
    submit() {
      return new Promise(async (resolve, reject) => {
        const results = Promise.all([
          this.$validator.validate("zipCode"),
          this.$validator.validate("state"),
          this.$validator.validate("city"),
          this.$validator.validate("address1"),
          this.$validator.validate("number")
        ]);

        const areValid = (await results).every(isValid => isValid);

        if (areValid) {
          this.address.zipCode = this.address.zipCode.replace(/\D/g, "");
          let editedUser = {
            id: this.$store.getters.getUser.id,
            address: this.address
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

<style lang="scss" scoped></style>
