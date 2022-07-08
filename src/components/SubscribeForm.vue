<template>
  <div class="subscribe-form">
    <form @submit.prevent="validateBeforeSubmit">
        <b-field
            :type="{'is-danger': errors.has('name')}"
            :message="errors.first('name')">
            <b-input v-model="name"
              name="name"
              v-validate="'required'"
              placeholder="Nome"
              icon-pack="fas"
              icon="user"/>
        </b-field>

        <b-field
          :type="{'is-danger': errors.has('email')}"
          :message="errors.first('email')">
          <b-input type="text"
            v-model="email"
            name="email"
            v-validate="'required|email'"
            placeholder="Email"
            icon-pack="fas"
            icon="envelope"/>
        </b-field>
          <button type="submit" class="button"> Inscrever </button>
    </form>
  </div>

<!--End mc_embed_signup-->
</template>

<script>
import axios from 'axios'

export default {
  name: 'subscribe-form',
  data () {
    return {
      name: '',
      email: ''
    }
  },
  methods: {
    userSubscribe (name, email) {
      axios.post('/api/v2/subscribe', {
        email,
        name
      })
        .then(response => {
          if (response.data.message == 'User registered') {
            this.$buefy.toast.open({
              message: 'Subscrição efetuada!',
              type: 'is-success',
              position: 'is-bottom'
            })
            this.$router.push({name: 'Signup', query: {name: this.name, email: this.email}})

          } else if (response.data.message == 'User already registered') {
            this.$buefy.toast.open({
              message: 'Usuário já inscrito!',
              type: 'is-warning',
              position: 'is-bottom'
            })
          }
        })
        .catch(({ error }) => {
          this.$buefy.toast.open({
            message: 'Erro!',
            type: 'is-danger',
            position: 'is-bottom'
          })
          // eslint-disable-next-line
          console.log(error)
        })
        .then(() => {
          // console.log('asdf')
          // always executed
        })
    },

    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.userSubscribe(this.name, this.email)
          return
        }
        this.$buefy.toast.open({
          message: 'Formulário inválido, verifique os campos.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .subscribe-form {
    padding-top: 0;

    button{
      color: white;
      background-color: #00ce46;
      font-weight: bold;
      border: 0;

      &:hover {
        background-color: #00ce46;
      }
    }
  }
</style>
