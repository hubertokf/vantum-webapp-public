<template>
  <div class="forgot-password-form">
    <b-field
      :type="{'is-danger': errors.has('email')}"
      :message="errors.first('email')">
      <b-input v-model="email"
        class="email-input"
        v-validate="'required|email'"
        placeholder="Email"
        name="email"
        pack="fas"
        type="email"
        icon="email">
      </b-input>
    </b-field>

    <b-field>
      <a class="login-button button" @click="validateBeforeSubmit">Recuperar</a>
    </b-field>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'forgot-password',
  data: () => {
    return {
      email: '',
      isComponentModalActive: false
    }
  },

  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.recoverPassword()
          return
        }
        this.$buefy.toast.open({
          message: 'Formulário inválido, verifique os campos.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      })
    },

    recoverPassword: function () {
      axios({
          url: '/api/v2/password/recovery',
          data: {email: this.email},
          method: 'POST'
        })
        .then(resp => {
          if (resp.data.message == "recoverySent"){
            this.$buefy.toast.open({
              message: 'Email de recuperação enviado!',
              type: 'is-success',
              position: 'is-top'
            })
          }
        })
        .catch(err => {
          if (err.response.data.message == 'userNotFound'){
            this.$buefy.toast.open({
              message: 'Email não cadastrado!',
              type: 'is-danger',
              position: 'is-top'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .forgot-password-form{
    .email-input{
    }

    .password-input{

    }

    .newuserlink{
      margin-top: 20px;

      a{
        color: var(--color-light);
      }
    }

    .login-button{
      transition: all 400ms ease;
      background-color: var(--color-light);
      color: #fff;
      -webkit-box-shadow: 0 0 0 rgba(0, 0, 0, 0.16);
      box-shadow: 0 0 0 rgba(0, 0, 0, 0.16);
      border: 0;

      &:hover{
        -webkit-box-shadow: 0 5px 6px rgba(0, 0, 0, 0.16);
        box-shadow: 0 5px 6px rgba(0, 0, 0, 0.16);
        border: 0;
      }
    }
  }
</style>
