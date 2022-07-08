<template>
  <div class="request-email-confirmation-form">
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
      <a class="button" @click="validateBeforeSubmit">Solicitar Email</a>
    </b-field>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'email-confirmation-form',
  data: () => {
    return {
      email: ''
    }
  },

  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.requestEmail()
          return
        }
        this.$buefy.toast.open({
          message: 'Formulário inválido, verifique os campos.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      })
    },

    requestEmail: function () {
      axios({
          url: '/api/v2/user/confirmation',
          data: {email: this.email},
          method: 'POST'
        })
        .then(resp => {
          if (resp.data.message == "emailsent"){
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

<style lang="scss">
  .request-email-confirmation-form{
    
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

    .button{
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
