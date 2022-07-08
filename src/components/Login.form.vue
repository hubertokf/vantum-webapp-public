<template>
  <div class="login-form">
    <form v-on:keyup.enter="validateBeforeSubmit">
      <b-field
        :type="{'is-danger': errors.has('email')}"
        :message="errors.first('email')">
        <b-input v-model="email"
          class="email-input"
          v-validate="'required|email'"
          placeholder="Email"
          pack="fas"
          name="email"
          type="email"
          icon="email">
        </b-input>
      </b-field>

      <b-field
        :type="{'is-danger': errors.has('password')}"
        :message="errors.first('password')">
        <b-input v-model="password"
          class="password-input"
          type="password"
          name="password"
          v-validate="'required'"
          placeholder="Senha"
          pack="fas"
          icon="key"
          password-reveal>
        </b-input>
      </b-field>

      <b-field>
        <a class="login-button button" v-on:keyup.enter="validateBeforeSubmit" @click="validateBeforeSubmit">Login</a>
        <router-link class="button is-text" to="forgotpassword">Esqueci a senha</router-link>
      </b-field>
    </form>

    <div class="newuserlink">
      <router-link to="signup">Ainda não tem uma conta<span v-if="pro"> Profissional</span>?</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login-form',
  props: {
    pro: {
      type: Boolean,
      default: false
    },
    company: {
      type: Boolean,
      default: false
    },
  },
  data: () => {
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.login()
          return
        }
        this.$buefy.toast.open({
          message: 'Formulário inválido, verifique os campos.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      })
    },
    login: function () {
      let email = this.email 
      let password = this.password
      this.$store.dispatch('login', { email, password })
      .then((res) => {
        if (this.$route.query.nextUrl){
          this.$router.push(this.$route.query.nextUrl)
        }else{
          if (this.pro){
            if(res.user.professionalProfile){
              this.$router.push('app/pro')
            } else {

              this.$router.push({ name: 'SignupPro', params: { user: res.user } })
            }
          }else if (this.company){
            if(res.user.professionalProfile){
              this.$router.push('app/pro')
            } else {

              this.$router.push({ name: 'SignupPro', params: { user: res.user } })
            }
          }else{
            this.$router.push({name: 'App' })
          }
        }
      })
      .catch((err) => {
        if (err.response.data.message == "Invalid Password"){
          this.$buefy.toast.open({
            message: 'Senha inválida.',
            type: 'is-danger',
            position: 'is-bottom'
          }) 
        } else if (err.response.data.message == "User not found"){
          this.$buefy.toast.open({
            message: 'Usuário não cadastrado.',
            type: 'is-danger',
            position: 'is-bottom'
          })
        } else if (err.response.data.message == "Email not confirmed"){
          this.$buefy.toast.open({
            message: 'Email não confirmado.',
            duration: 0,
            type: 'is-warning',
            position: 'is-bottom'
          })
          this.$router.push('/emailconfirmation')
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .login-form{
    .email-input{
    }

    .password-input{

    }

    .newuserlink{
      margin-top: 10px;

      a{
        color: #00ce46;
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

    .control.has-icons-left .icon, .control.has-icons-right .icon {
      pointer-events: auto;
    }
  }
</style>
