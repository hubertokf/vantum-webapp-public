<template>
  <div class="professional-form">
    <b-field
      label="Área de atuação"
      :type="{ 'is-danger': errors.has('actuation') }"
      :message="errors.first('actuation')"
    >
      <b-select
        v-model="professional.actuation"
        name="actuation"
        placeholder="Selecione sua área de atuação"
        expanded
        icon-pack="fas"
        icon="briefcase"
      >
        <option value="agriculture">Agricultura</option>
        <option value="ambiental">Ambiental</option>
        <option value="properties">Arquitetura</option>
        <option value="civil-construction">Construção Civil</option>
        <option value="energy">Energia</option>
        <option value="engineering">Engenharia</option>
        <option value="geotecnology">Geotecnologias</option>
        <option value="governmental">Governamental</option>
        <option value="properties">Imobiliário</option>
        <option value="security">Segurança</option>
      </b-select>
    </b-field>

    <b-field
      :type="{ 'is-danger': errors.has('actuation') }"
      :message="errors.first('actuation')"
    >
      <b-switch v-model="professional.pilot" :value="true" type="is-success">
        Sou piloto de vant
      </b-switch>
    </b-field>

    <div class="columns" v-if="professional.pilot">
      <div class="column">
        <b-field
          label="Tempo de experiência (anos)"
          :type="{ 'is-danger': errors.has('actuation') }"
          :message="errors.first('actuation')"
        >
          <b-numberinput
            expanded
            controls-position="compact"
            v-model="professional.experience"
          ></b-numberinput>
        </b-field>
      </div>

      <div class="column">
        <b-field
          label="Vants que possuo experiência"
          :type="{ 'is-danger': errors.has('experienceVants') }"
          :message="errors.first('experienceVants')"
        >
          <!-- <b-taginput
            v-model="professional.experienceVants"
            :data="vants"
            autocomplete
            :allow-new="true"
            icon="professionale"
            icon-pack="fas"
            placeholder="Digite os vants que possui experiência"
            @typing="getFilteredTags">
          </b-taginput> -->

          <b-taginput
            v-model="professional.experienceVants"
            :data="filteredVants"
            autocomplete
            :allow-new="true"
            name="experienceVants"
            :open-on-focus="true"
            field="professional.experienceVants"
            icon="professionale"
            icon-pack="fas"
            placeholder="Digite os vants que possui experiência"
            @typing="getFilteredVants"
          >
          </b-taginput>
        </b-field>
      </div>
    </div>

    <b-field
      :type="{ 'is-danger': errors.has('actuation') }"
      :message="errors.first('actuation')"
    >
      <b-switch v-model="professional.hasVant" :value="true" type="is-success">
        Possuo vant
      </b-switch>
    </b-field>

    <b-field
      v-if="professional.hasVant"
      label="Vants que possuo"
      :type="{ 'is-danger': errors.has('ownVants') }"
      :message="errors.first('ownVants')"
    >
      <b-taginput
        v-model="professional.ownVants"
        :data="filteredVants"
        autocomplete
        :allow-new="true"
        name="ownVants"
        :open-on-focus="true"
        field="professional.ownVants"
        icon="professionale"
        icon-pack="fas"
        placeholder="Digite os vants que possui"
        @typing="getFilteredVants"
      >
      </b-taginput>

      <!-- <b-taginput
        v-model="professional.ownVants"
        :data="vants"
        autocomplete
        :allow-new="true"
        icon="professionale"
        name="ownVants"
        icon-pack="fas"
        placeholder="Digite os vants que possui experiência"
        @typing="getFilteredTags">
      </b-taginput> -->
    </b-field>

    <!-- <b-field
      label="Raio de Atuação"
      :type="{'is-danger': errors.has('actuation')}"
      :message="errors.first('actuation')"
    >
      <b-numberinput controls-position="compact" v-model="professional.actuationRadius"></b-numberinput> Km
      
    </b-field> -->

    <div class="nextButton has-text-centered" v-if="showButton">
      <a class="button is-primary" @click="submit()" :disabled="btDisabled"
        >Salvar<i class="fas fa-angle-right"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "professional-form",
  props: {
    user: {
      type: Object,
      default: null
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      professional: {
        hasVant: false,
        actuation: "",
        pilot: false,
        experience: 0,
        experienceVants: [],
        ownVants: [],
        actuationRadius: 0
      },

      filteredVants: [
        "Batmap",
        "Zangão",
        "Phantom",
        "Maptor",
        "Echar 20D",
        "Arator 5B",
        "Outro, Qual?"
      ],
      vants: [
        "Batmap",
        "Zangão",
        "Phantom",
        "Maptor",
        "Echar 20D",
        "Arator 5B",
        "Outro, Qual?"
      ]
    };
  },
  mounted() {},
  methods: {
    getFilteredTags(text) {
      this.filteredTags = this.vants.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    createProfessional: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("postProfessional", {
            user: this.user._id,
            ...this.professional
          })
          .then(professional => {
            this.professional = professional;

            this.$buefy.toast.open({
              message: "Perfil profissional cadastrado!",
              type: "is-success"
            });
            resolve(professional);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    updateProfessional: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("editProfessional", this.professional)
          .then(professional => {
            this.$buefy.toast.open({
              message: "Perfil profissional editado!",
              type: "is-success"
            });
            resolve(professional);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    getFilteredVants(text) {
      this.filteredVants = this.vants.filter(option => {
        return option.toLowerCase().indexOf(text.toLowerCase()) >= 0;
      });
    },
    submit() {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll().then(async result => {
          if (result) {
            if (this.professional.id == null) {
              await this.createProfessional()
                .then(professional => {
                  resolve(professional);
                })
                .catch(e => {
                  this.$buefy.toast.open({
                    message: "Perfil profissional não adicionado",
                    type: "is-danger"
                  });
                  reject(e);
                });
            } else {
              await this.updateProfessional()
                .then(professional => {
                  resolve(professional);
                })
                .catch(e => {
                  this.$buefy.toast.open({
                    message: "Perfil profissional não editado",
                    type: "is-danger"
                  });
                  reject(e);
                });
            }
          } else {
            this.$buefy.toast.open({
              message: "Formulário inválido, verifique os campos.",
              type: "is-danger",
              position: "is-bottom"
            });
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.professional-form {
  text-align: left;
}
</style>
