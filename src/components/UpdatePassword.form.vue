<template>
  <div class="update-password-form">
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

    <b-field>
      <a class="login-button button" @click="validateBeforeSubmit">Salvar</a>
    </b-field>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'update-password',
  data: () => {
    return {
      password: '',
      password_confirmation: ''
    }
  },

  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.updatePassword()
          return
        }
        this.$buefy.toast.open({
          message: 'Formulário inválido, verifique os campos.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      })
    },

    updatePassword: function () {
      axios({
          url: '/api/v2/password/update',
          data: {token: this.$parent.token, password: this.password},
          method: 'POST'
        })
        .then(resp => {
          if (resp.data == "OK"){
            this.$router.push({ name: 'Login', params: { newPassword: true }})
          }
        })
        .catch(err => {
          
          if (err.response.data == 'Token Expired/Invalid' || err.response.status == 498){
            this.$buefy.toast.open({
              message: 'Token inválido ou expirado!',
              type: 'is-danger',
              position: 'is-top'
            })
          }else{
            console.log(err)
            console.log(err.response)
          }
        })  
    }
  }
}
</script>

<style lang="scss" scoped>
  .update-password-form{
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
      -webkit-box-shadow: 0 0 0 rgba(236, 76, 76, 0.16);
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
