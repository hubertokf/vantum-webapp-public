<template>
  <div class="project-form">
    <div class="content">
      <b-field
        label="Nome da Pasta"
        :type="{ 'is-danger': errors.has('name') }"
        :message="errors.first('name')"
      >
        <b-input
          v-model="project.name"
          v-validate="'required'"
          name="name"
          placeholder="Nome da Pasta"
        ></b-input>
      </b-field>

      <b-field label="Descrição">
        <b-input
          maxlength="150"
          v-model="project.description"
          type="textarea"
        ></b-input>
      </b-field>

      <div class="has-text-centered" v-if="showButton">
        <a class="button is-primary" @click="submit()" :disabled="btDisabled"
          >Proximo</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";

export default {
  name: "project-form",
  components: {
    "navigation-menu": NavigationMenu
  },
  props: {
    showButton: {
      type: Boolean,
      default: true
    },
    parent: {
      type: String,
      default: null
    },
    projectObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      btDisabled: false,
      project: {
        id: "",
        name: "",
        description: "",
        owner: this.$store.state.auth.user.id,
        plans: [],
        parent: null
      },
      currentPlan: "",
      typeAction: "",
      listPlans: []
    };
  },
  mounted() {
    if (this.$store.getters.getNewProject != null) {
      this.project = this.$store.getters.getNewProject;
    }
    if (this.projectObj != null) {
      this.project = this.projectObj;
      this.$store.dispatch("setNewProject", this.project);
    }
  },
  methods: {
    createProject: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("postProject", this.project)
          .then(project => {
            if (this.parent) {
              this.project = project;
              this.project.parent = this.parent;
              let objectToSend = {
                projectParentId: this.parent,
                project: this.project
              };
              this.$store.dispatch("setNewProject", this.project);
              this.$store.dispatch("insertIntoProject", objectToSend);

              this.$buefy.toast.open({
                message: "Projeto cadastrado!",
                type: "is-success"
              });
              resolve(project);
            } else {
              this.project = project;
              this.$store.dispatch("setNewProject", this.project);
              this.$buefy.toast.open({
                message: "Projeto cadastrado!",
                type: "is-success"
              });
              resolve(project);
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    updateProject: function() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("editProject", this.project)
          .then(project => {
            this.$buefy.toast.open({
              message: "Projeto editado!",
              type: "is-success"
            });
            resolve(project);
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
            if (this.$store.getters.getNewProject == null) {
              this.$store.dispatch("setNewProject", this.project);

              await this.createProject()
                .then(project => {
                  resolve(project);
                })
                .catch(e => {
                  this.$buefy.toast.open({
                    message: "Projeto não adicionado",
                    type: "is-danger"
                  });
                  reject(e);
                });
            } else {
              this.$store.dispatch("setNewProject", this.project);

              await this.updateProject()
                .then(project => {
                  resolve(project);
                })
                .catch(e => {
                  this.$buefy.toast.open({
                    message: "Projeto não editado",
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
.project-form {
  overflow-y: auto;
  overflow-x: hidden;
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

    .mapSection {
      margin-bottom: 20px;

      .selectPlan {
        text-align: center;
        display: inline-block;
        margin-right: 15px;
        margin-top: 26px;
        color: var(--color-dark);
        cursor: pointer;

        .labeltext {
          font-size: 10px;
        }
      }

      .createPlan {
        display: inline-block;
        text-align: center;
        margin-top: 26px;
        color: var(--color-dark);
        cursor: pointer;

        .labeltext {
          font-size: 10px;
        }
      }
    }
  }
}
</style>
