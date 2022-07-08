<template>
  <div class="password-form">

    <!-- <b-field label="Senha antiga"
      :type="{'is-danger': errors.has('oldpassword')}"
      :message="errors.first('oldpassword')">
      <b-input type="password"
        value=""
        name="oldpassword"
        v-validate="'required|min:8'"
        password-reveal
        v-model="oldPassword"
        icon-pack="fas"
        icon="key">
      </b-input>
    </b-field> -->

    <b-field label="Senha"
      :type="{'is-danger': errors.has('password')}"
      :message="errors.first('password')">
      <b-input type="password"
        value=""
        name="password"
        v-validate="'required|min:8|verify_password'"
        ref="password"
        password-reveal
        v-model="password"
        icon-pack="fas"
        icon="key">
      </b-input>
    </b-field>

    <b-field label="Confirme sua senha"
      :type="{'is-danger': errors.has('password_confirmation')}"
      :message="errors.first('password_confirmation')">
      <b-input type="password"
        value=""
        v-validate="'required|confirmed:password'"
        name="password_confirmation"
        password-reveal
        v-model="password_confirmation"
        icon-pack="fas"
        icon="key">
      </b-input>
    </b-field>

    <div class="has-text-centered">
      <a class="button is-primary cancel" @click="cancel()">Cancelar</a>
      <a class="button is-primary save" @click="save()">Salvar</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'password-form',
    data() {
      return {
        oldPassword: "",
        password: "",
        password_confirmation: ""
      }
    },
    methods: {
      cancel() {
        // this.oldPassword = ""
        this.password = ""
        this.password_confirmation = ""
        this.$parent.passwordForm = false
      },
      save() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            let req = {
              id: this.$store.getters.getUser.id,
              // oldPassword: this.oldPassword,
              password: this.password
            }
            this.$store.dispatch('changePassword', req).then(()=>{
              this.$buefy.toast.open({
                message: 'Senha alterada com sucesso!',
                type: 'is-success'
              })
              this.$parent.passwordForm = false
            }).catch(()=>{
              this.$buefy.toast.open({
                message: 'Erro ao alterar a senha',
                type: 'is-danger'
              })
            })
          }else{
            this.$buefy.toast.open({
              message: 'Formulário inválido, verifique os campos.',
              type: 'is-danger',
              position: 'is-bottom'
            })
          }
        })
      }
    },
  }
</script>

<style lang="scss">
  .password-form{
    .cancel{
      margin-right: 20px;
    }

    .control.has-icons-left .icon, .control.has-icons-right .icon {
      pointer-events: auto;
    }
  }

</style>