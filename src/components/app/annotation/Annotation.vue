<template>
  <div class="annotationContent">
    <nav-bar ref="nav" :scrollTop="scrollTop">
      <div class="overlay" @click="goToMap">
        <div class="hover">ver mapa</div>
      </div>
      <template v-slot:bg>
        <map-v v-if="annotation"></map-v>
      </template>
      <template v-slot:left>
        <div class="back" @click="$router.go(-1)">
          <b-icon :icon="'arrow-left'" :size="'is-medium'"></b-icon>
        </div>
      </template>

      <template v-slot:title>
        <!-- <div class="spacer"></div> -->
        <div class="pageTitle" v-if="annotation">{{annotation.name}}</div>

        <div class="spacer"></div>
      </template>

      <template v-slot:right>
        <b-dropdown aria-role="menu" position="is-bottom-left">
          <button class="dropdownMenu" v-if="allowEditVisualization" slot="trigger">
            <b-icon :icon="'dots-vertical'" :size="'is-medium'"></b-icon>
          </button>
          <b-dropdown-item
            v-if="!edit"
            value="edit"
            aria-role="menuitem"
            v-on:click="editAnnotation()"
          >
            <i class="fas fa-edit"></i>
            Editar
          </b-dropdown-item>

          <b-dropdown-item
            value="trash"
            aria-role="menuitem"
            v-on:click="confirmCustomDelete()"
            v-if="arrowBack"
          >
            <i class="fas fa-trash"></i>
            Excluir
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </nav-bar>

    <div
      class="annotation"
      @scroll="
          a => {
            scrollTop = a.target.scrollTop;
          }
        "
    >
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>

      <!-- <navigation-menu
        v-if="annotation && !isLoading"
        :title="annotation.name"
        :arrowBack="arrowBack"
      >
        <b-dropdown-item
          value="edit"
          aria-role="menuitem"
          v-on:click="editAnnotation()"
          v-if="!edit"
        >
          <i class="fas fa-edit"></i>
          Editar
        </b-dropdown-item>

        <b-dropdown-item
          value="trash"
          aria-role="menuitem"
          v-on:click="confirmCustomDelete()"
          v-if="arrowBack"
        >
          <i class="fas fa-trash"></i>
          Excluir
        </b-dropdown-item>
      </navigation-menu>-->

      <annotation-details v-if="annotation && !isLoading && !edit" :annotation="annotation"></annotation-details>
      <annotation-form v-if="annotation && !isLoading && edit" :annotationObj="annotation"></annotation-form>

      <attachments v-if="annotation && !isLoading && !edit" :attachments="attachments"></attachments>

      <div class="errorNotFound" v-if="error && !isLoading">
        Desculpe, esta anotação não foi encontrada.
        <br />:(
      </div>
    </div>

    <div class="attachmentForm" v-if="!edit">
      <b-field>
        <b-input
          class="attachmentInput"
          placeholder="Comentário.."
          v-validate="'required'"
          type="text"
          custom-class="teste"
          v-model="attachment.text"
          name="comment"
        ></b-input>
        <button class="sendButton" @click="sendAttachment">
          <b-icon :icon="'send'" :size="'is-medium'"></b-icon>
        </button>
      </b-field>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import AnnotationDetails from "./AnnotationDetails";
import AnnotationForm from "./AnnotationForm";
import Attachments from "./Attachments";
import NavBar from "@/components/app/NavBar";
import Mapp from "@/components/app/Map";

export default {
  name: "annotation",
  components: {
    NavigationMenu,
    "annotation-details": AnnotationDetails,
    "annotation-form": AnnotationForm,
    "map-v": Mapp,
    NavBar,
    Attachments
  },
  props: {
    annotationObj: {
      type: Object,
      default: null
    },
    annotationId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      scrollTop: 0,
      annotation: null,
      attachment: {
        type: "comment",
        owner: this.$store.getters.getUser,
        text: ""
      },
      isLoading: false,
      edit: false,
      error: false,
      arrowBack: true
    };
  },
  computed: {
    allowEditVisualization() {
      if (!this.share || (this.share && this.share.level >= 2)) {
        return true;
      } else {
        return false;
      }
    },
    attachments() {
      if (this.$store.getters.getCurrentAnnotation) {
        return this.$store.getters.getCurrentAnnotation.attachments;
      } else {
        return [];
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.isLoading = true;
    this.$store
      .dispatch("getAnnotation", to.params.annotationId)
      .then(annotation => {
        this.annotation = annotation;
        this.centerAnnotation(annotation);

        this.isLoading = false;
        next();
      })
      .catch(error => {
        this.isLoading = false;
        this.error = true;
      });
  },
  beforeDestroy() {
    this.$store.dispatch("setCurrentAnnotation", null);
  },
  mounted() {
    this.$root.$emit("clear-annotations");
    this.isLoading = true;
    if (this.annotationObj != null) {
      this.annotation = this.annotationObj;
      this.$store.dispatch("setCurrentAnnotation", this.annotation);
      this.centerAnnotation(this.annotation);
      this.isLoading = false;
    } else {
      this.$store
        .dispatch("getAnnotation", this.annotationId)
        .then(annotation => {
          this.annotation = annotation;
          this.$store.dispatch("setCurrentAnnotation", annotation);
          this.$root.$emit("add-annotation", annotation);
          this.centerAnnotation(annotation);

          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          this.error = true;
        });
    }

    this.$root.$on("edit-annotation", annotation => {
      this.updateAnnotation(annotation);
    });
  },

  methods: {
    goToMap() {
      this.$store.dispatch("toggleSidebar");
    },
    sendAttachment() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$store
            .dispatch("addAttachment", {
              annotation: this.annotation,
              attachment: this.attachment
            })
            .then(attachments => {
              this.annotation.attachments = attachments;
              this.attachment.text = "";
            });
        }
      });
    },
    updateAnnotation(annotation) {
      if (this.annotation.id == annotation.id) {
        this.annotation = annotation;
        this.edit = false;
      }
    },

    getCentroid(arr) {
      return arr.reduce(
        function(x, y) {
          return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length];
        },
        [0, 0]
      );
    },

    centerAnnotation(annotation) {
      let center;
      let centerObj;
      if (annotation.type == "rectangle" || annotation.type == "polygon") {
        // center = this.getCentroid(annotation.latlngs);
        this.$root.$emit("fit-bounds", annotation.latlngs);
      }
      if (annotation.type == "circle" || annotation.type == "marker") {
        centerObj = {
          latitude: annotation.latlng[0],
          longitude: annotation.latlng[1],
          altitude: 14
        };
        this.$root.$emit("centerMap", centerObj);
      }
      if (annotation.type == "polyline") {
        // melhorar o centro da polyline, atualmente pega o primeiro ponto
        // center = annotation.latlngs[0];
        this.$root.$emit("fit-bounds", annotation.latlngs);
      }
    },

    editAnnotation() {
      this.edit = true;
      // this.$router.push({name: 'EditAnnotation', params: {annotationObj: this.annotation}})
    },

    confirmCustomDelete() {
      this.$buefy.dialog.confirm({
        title: "Deletando Anotação",
        message:
          "Você tem certeza que deseja <b>deletar</b> a anotação? Isso é uma ação sem volta.",
        confirmText: "Deletar Anotação",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteAnnotation()
      });
    },

    deleteAnnotation() {
      this.$root.$emit("delete-annotation", this.annotation.id);
      this.$store.dispatch("deleteAnnotation", this.annotation.id);

      this.$store.dispatch("deleteAnnotation", this.annotation.id).then(() => {
        this.$router.go(-1);
        this.$notify({
          group: "global",
          type: "is-success",
          duration: 2000,
          title: "Anotação removido"
        });
      });
    }
  }
};
</script>

<style lang="scss">
.annotationContent {
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
    z-index: 3;
    align-self: flex-end;

    .icon {
      vertical-align: sub;
    }
  }

  .overlay {
    height: 100%;
    width: 100%;
    // background-color: rgba(0, 0, 0, 0.4);
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.80632) 0%,
      rgba(0, 212, 255, 0) 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;

    .hover {
      display: none;
      color: #e5e5e5;
      font-weight: bold;
      text-align: center;
      margin: auto;
      width: 100%;
      @include v-centerer;
    }

    &:hover {
      .hover {
        display: block;
      }
    }
  }

  .attachmentForm {
    background-color: #f5f5f5;
    position: absolute;
    padding: 10px;
    width: 100%;
    bottom: 0;

    .attachmentInput {
      width: 100%;

      input {
        outline: none;
        border: 0;
        box-shadow: none;
        border-bottom: 2px solid var(--color-dark);
        background: inherit;
        padding-bottom: 0px;
        color: var(--color-dark);
      }
    }

    .sendButton {
      color: var(--color-dark);
      background: none;
      border: 0;
      cursor: pointer;
      font-size: 28px;
    }
  }

  .annotation {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1 1 auto;

    .navigationMenu {
      margin-bottom: 20px;

      .editButton {
        color: var(--color-darker);
      }
      .deleteButton {
        color: var(--color-darker);
      }
    }
  }
}
</style>