<template>
  <div class="contact-form">
    <b-field 
      :type="{'is-danger': errors.has('name')}"
      :message="errors.first('name')">
      <b-input v-model="form.fullname"
        v-validate="'required'"
        name="name"
        placeholder="Nome"
        icon-pack="fas"
        icon="user"></b-input>
    </b-field>

    <b-field
      :type="{'is-danger': errors.has('email')}"
      :message="errors.first('email')">
      <b-input type="text"
        v-model="form.email"
        name="email"
        placeholder="Email"
        v-validate="'required|email'"
        icon-pack="fas"
        icon="envelope"/>
    </b-field>

    <b-field
      :type="{'is-danger': errors.has('actuation')}"
      :message="errors.first('actuation')"
      >
      <b-select name="actuation" v-validate="'required'" v-model="form.actuation" placeholder="Área de Atuação" expanded>
        <option value="Mineração">Mineração</option>
        <option value="Agricultura">Agricultura</option>
        <option value="Meio Ambiente">Meio Ambiente</option>
        <option value="Pesquisa">Pesquisa</option>
        <option value="Gestão Pública">Gestão Pública</option>
        <option value="Infraestrutura">Infraestrutura</option>
        <option value="Construção Civil">Construção Civil</option>
        <option value="Topografia">Topografia</option>
      </b-select>
    </b-field>

    <b-field
      :type="{'is-danger': errors.has('message')}"
      :message="errors.first('message')">
      <b-input 
        placeholder="Comente sua dúvida/projeto" 
        name="message" 
        v-model="form.message" 
        v-validate="'required'" 
        maxlength="500" 
        type="textarea"></b-input>
    </b-field>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link" @click="validateBeforeSubmitContactForm">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  name: "contact-form",
  data() {
    return {
      form: {
        fullname: "",
        email: "",
        actuation: null,
        message: ""
      }
    };
  },
  methods: {
    validateBeforeSubmitContactForm() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.sendContactForm();
          return;
        }
        this.$buefy.toast.open({
          message: "Formulário inválido, verifique os campos.",
          type: "is-danger",
          position: "is-bottom"
        });
      });
    },
    sendContactForm() {
      Axios.post("/api/v2/deliver/contactFormVantum", this.form)
        .then(response => {
          this.$buefy.toast.open({
            message: "Formulário de email enviado! Entraremos em contato.",
            type: "is-success",
            position: "is-bottom"
          });
        })
        .catch(({ error }) => {
          this.$buefy.toast.open({
            message: "Erro! Tente novamente mais tarde.",
            type: "is-danger",
            position: "is-bottom"
          });
          // eslint-disable-next-line
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.contact-form {
  button {
    background-color: #00ce46;
    font-weight: bold;

    &:hover {
      background-color: #00ce46;
    }
  }
}
</style>