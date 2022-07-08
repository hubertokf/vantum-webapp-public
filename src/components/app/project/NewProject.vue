<template>
  <div class="newProjectContent">
    <nav-bar ref="nav" :scrollTop="scrollTop">
      <template v-slot:left>
        <div class="back" @click="confirmExit">
          <b-icon :icon="'close'" :size="'is-medium'"></b-icon>
        </div>
      </template>

      <template v-slot:title>
        <!-- <div class="spacer"></div> -->
        <div class="pageTitle">Nova pasta</div>

        <div class="spacer"></div>
      </template>

      <template v-slot:right></template>
    </nav-bar>

    <div
      class="new-project"
      @scroll="
          a => {
            scrollTop = a.target.scrollTop;
          }
        "
    >
      <!-- <navigation-menu title="Nova pasta" :leftIcon="'close'" :ellipsisDd="false"></navigation-menu> -->

      <project-form :showButton="false" :parent="parent" ref="projectForm"></project-form>

      <div class="controlButtons">
        <b-field>
          <b-button class="button next-bt is-primary is-pulled-right" @click="saveProject">Salvar</b-button>
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import ProjectForm from "@/components/app/project/ProjectForm";
import NavBar from "@/components/app/NavBar";

export default {
  name: "new-project",
  components: {
    NavigationMenu,
    NavBar,
    ProjectForm
  },
  props: {
    parent: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      scrollTop: 0,
      isLoading: false
    };
  },
  computed: {},
  mounted() {},
  methods: {
    confirmExit() {
      this.$buefy.dialog.confirm({
        title: "Sair",
        message:
          "Você tem certeza que deseja <b>sair</b> desta tela? Toda informação não salva será perdida.",
        confirmText: "Sair",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.$router.go(-1)
      });
    },
    saveProject() {
      this.$refs.projectForm.submit().then(project => {
        this.$store.dispatch("setNewProject", null);
        this.$store.dispatch("setCurrentProject", null);

        this.$router.push({
          name: "Project",
          params: { projectId: project._id }
        });
      });
    }
  }
};
</script>

<style lang="scss">
.newProjectContent{
overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding-bottom: 55px;
  padding-top: 0;

  position: relative;
  width: 100%;
  overflow-y: auto;

  position: relative;
  width: 100%;
  overflow-y: auto;

  display: flex;
  flex-flow: column;
  align-items: stretch;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  flex: 1;

  .pageTitle {
    line-height: 30px;
    font-size: 22px;
    font-weight: bold;
    width: calc(100% - 20px);
    align-self: flex-end;

    .icon {
      vertical-align: sub;
    }
  }

  .new-project {
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding: 10px;
    flex: 1 1 auto;

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

    .controlButtons {
      position: fixed;
      bottom: 0;
      width: calc(100% - 20px);
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      background-color: #f5f5f5;
      margin-bottom: 10px;

      .field {
        margin-bottom: 0;
      }
    }

    .plan-form {
      margin-bottom: 20px;
    }

    .createPlan {
      cursor: pointer;
    }

    .selectPlan {
      cursor: pointer;
    }

    .newPlan {
      margin-top: 20px;
      cursor: pointer;
    }

    .planSelector {
      margin-right: 10px !important;
    }

    .step-items {
      width: 100%;
    }

    .selectedMaps {
      .selectedMap {
        position: relative;
        padding: 5px;
        background-color: var(--color-lighter);
        color: var(--color-dark);
        margin-bottom: 5px;

        .remove {
          color: red;
          cursor: pointer;
          @include v-centerer;
          right: 10px;
        }
      }
    }

    .albumSource {
      margin-bottom: 20px;
      width: 100%;
    }

    .selectAlbum {
      margin-bottom: 20px;
    }

    .b-steps {
      .steps:not(:last-child) {
        margin-bottom: 5px;
        margin-top: 10px;
      }

      .steps {
        // display: none;

        + .step-content {
          padding: 0;
        }
      }
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
}
</style>
