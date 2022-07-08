<template>
  <div class="annotation-form" v-if="annotation">
    <div class="name">
      <b-field
        label="Nome"
        :type="{'is-danger': errors.has('name')}"
        :message="errors.first('name')"
      >
        <b-input
          v-model="annotation.name"
          v-validate="'required'"
          name="name"
          placeholder="Nome da anotação"
        ></b-input>
      </b-field>
    </div>

    <div class="description">
      <b-field
        label="Descrição"
        :type="{'is-danger': errors.has('description')}"
        :message="errors.first('description')"
      >
        <b-input
          v-model="annotation.description"
          type="textarea"
          v-validate
          name="description"
          placeholder="Descrição da anotação"
        ></b-input>
      </b-field>
    </div>
    <div class="color">
      <div class="label">Cor:</div>
      <color-picker :color="annotation.options.color" v-model="annotation.options.color"></color-picker>

      <!-- <div class="text">{{ annotation.options.color }} {{ annotation.color }}</div> -->
    </div>

    <div class="actionButtons has-text-centered">
      <a class="button is-primary" @click="cancel()">Cancelar</a>
      <a class="button is-primary" @click="validateSubmit()">Salvar</a>
    </div>
  </div>
</template>

<script>
import ColorPicker from "../ui/ColorPicker";

export default {
  name: "annotation-form",
  props: {
    annotationObj: {
      type: Object,
      default: null
    }
  },
  components: {
    ColorPicker
  },
  data() {
    return {
      annotation: null
    };
  },
  mounted() {
    if (this.annotationObj != null) {
      this.annotation = this.annotationObj;
    }
  },
  methods: {
    cancel: function() {
      this.$parent.edit = false;
    },
    updateAnnotation: function() {
      return new Promise((resolve, reject) => {
        let a = {
          id: this.annotation.id,
          name: this.annotation.name,
          description: this.annotation.description,
          options: this.annotation.options
        };
        this.$store.dispatch("editAnnotation", a).then(annotation => {
          this.$root.$emit("edit-annotation", annotation);

          resolve(annotation);
        });
      });
    },
    validateSubmit() {
      this.$validator.validateAll().then(async result => {
        if (result) {
          this.updateAnnotation().then(() => {
            this.$buefy.toast.open({
              message: "Anotação atualizada!",
              type: "is-success"
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.annotation-form {
  .name,
  .description {
    margin-bottom: 15px;
  }

  .color {
    margin-bottom: 20px;
  }

  .actionButtons {
    .button {
      margin: 0 10px;
    }
  }
}
</style>