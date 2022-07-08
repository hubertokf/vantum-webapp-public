<template>
  <div class="email-form">

    <b-field
      label="Novo email"
      :type="{'is-danger': errors.has('email')}"
      :message="errors.first('email')">
      <b-input type="text"
        v-model="email"
        name="email"
        v-validate="'required|email|verify_email'"
        icon-pack="fas"
        icon="envelope"/>
    </b-field>

    <div class="has-text-centered">
      <a class="button is-primary cancel" @click="cancel()">Cancelar</a>
      <a class="button is-primary save" @click="save()">Salvar</a>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'email-form',
    data() {
      return {
        email: ""
      }
    },
    methods: {
      cancel() {
        this.email = ""
        this.$parent.emailForm = false
      },
      save() {
        let req = {
          id: this.$store.getters.getUser.id,
          email: this.email,
        }
        this.$store.dispatch('changeEmail', req).then(()=>{
          this.$buefy.toast.open({
            message: 'Email alterado com sucesso!',
            type: 'is-success'
          })
          this.$parent.emailForm = false

        }).catch(()=>{
          this.$buefy.toast.open({
            message: 'Erro ao alterar o email',
            type: 'is-danger'
          })
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .email-form{
    .cancel{
      margin-right: 20px;
    }
    
  }
</style>