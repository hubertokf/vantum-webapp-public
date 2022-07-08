<template>
  <div class="plan-form">
    <div class="content">
      <b-field
        label="Nome do mapa"
        :type="{'is-danger': errors.has('name')}"
        :message="errors.first('name')"
      >
        <b-input
          v-model="plan.name"
          v-validate="'required'"
          name="name"
          placeholder="Nome do Mapa (ex:Mapa-lugar)"
        ></b-input>
      </b-field>

      <b-field label="Data do voo">
        <b-datepicker
          placeholder="Digite ou selecione uma data..."
          v-model="plan.planDate"
          icon="calendar-today"
          editable
        ></b-datepicker>
      </b-field>

      <b-field label="Descrição">
        <b-input maxlength="150" v-model="plan.description" type="textarea"></b-input>
      </b-field>

      <div class="nextButton has-text-centered" v-if="showButton">
        <a class="button is-primary" @click="submit()" :disabled="btDisabled">
          Salvar
          <i class="fas fa-angle-right"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "plan-form",
  props: {
    showButton: {
      type: Boolean,
      default: true
    },
    planObj: {
      type: Object,
      default: null
    },
    project: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      plan: {
        id: "",
        name: "",
        description: "",
        location: "",
        planDate: new Date(),
        album: null,
        owner: this.$store.state.auth.user.id,
        project: null
      }
    };
  },
  mounted() {
    if (this.$store.getters.getNewPlan != null) {
      this.plan = this.$store.getters.getNewPlan;
    }
    if (this.planObj != null) {
      this.plan = this.planObj;
      if (this.planObj.planDate != "" && this.planObj.planDate != null) {
        this.planObj.planDate = new Date(this.planObj.planDate);
      } else {
        this.planObj.planDate = new Date();
      }
      this.$store.dispatch("setNewPlan", this.plan);
    }
  },
  methods: {
    createPlan: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("postPlan", this.plan)
          .then(plan => {
            this.plan = plan;
            if (plan.planDate != "" && plan.planDate != null) {
              this.plan.planDate = new Date(plan.planDate);
            } else {
              this.plan.planDate = new Date();
            }
            if (this.project) {
              this.plan.project = this.project;
              let objectToSend = {
                projectParentId: this.project,
                plan: this.plan
              };
              this.$store.dispatch("insertPlanIntoProject", objectToSend);
            }

            this.$store.dispatch("setNewPlan", this.plan);

            this.$buefy.toast.open({
              message: "Mapa cadastrado!",
              type: "is-success"
            });
            resolve(plan);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    updatePlan: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("editPlan", this.plan)
          .then(plan => {
            this.$buefy.toast.open({
              message: "Mapa editado!",
              type: "is-success"
            });
            resolve(plan);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    submit() {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll().then(async result => {
          if (result) {
            if (this.$store.getters.getNewPlan == null) {
              this.$store.dispatch("setNewPlan", this.plan);

              await this.createPlan()
                .then(plan => {
                  resolve(plan);
                })
                .catch(e => {
                  this.$buefy.toast.open({
                    message: "Mapa não adicionado",
                    type: "is-danger"
                  });
                  reject(e);
                });
            } else {
              this.$store.dispatch("setNewPlan", this.plan);

              await this.updatePlan()
                .then(plan => {
                  resolve(plan);
                })
                .catch(e => {
                  this.$buefy.toast.open({
                    message: "Mapa não editado",
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

<style lang="scss">
.plan-form {
  overflow-y: auto;
  width: 100%;

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

  .content {
    // padding: 10px;

    .sectionTitle {
      padding: 3px 0px 3px 0;

      h2 {
        font-size: 20px;
        font-weight: bold;
        line-height: inherit;
      }
    }

    .button {
      margin-top: 20px;
      background-color: var(--color-light);
    }
  }
}
</style>