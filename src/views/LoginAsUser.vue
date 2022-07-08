<template>
  <div class="login-as-user">
    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
    <img v-if="err" class="lotrSign" src="../assets/img/notPass.svg">
  </div>
</template>

<script>

export default {
  name: "login-as-user",
  data: () => ({
    err: false,
    isLoading: false
  }),

  components: {
  },

  mounted() {
    this.isLoading = true
    if (this.$route.query.token){
      this.signIn(this.$route.query.token)
    }else{
      this.err = true
      this.isLoading = false
    }
  },

  methods: {
    async signIn(token) {
      await this.$store.dispatch(
        "loginAsUser",
        {token: token}
      )
      .then((r)=>{
        if (r.message == "granted"){
          this.isLoading = false
          this.$router.push({name: 'App' })
        }
      })
      .catch((e)=>{
        this.isLoading = false

        this.err = true
        console.log(e)
      })

    },

  }
};
</script>

<style lang="scss" scoped>
.login-as-user {
  background-color: #006746;
  height: 100vh;

  .lotrSign{
    max-height: 50vh;
    margin: auto auto;
    @include v-centerer2;
    -webkit-filter: drop-shadow( 5px 3px 6px rgba(0, 0, 0, .7));
    filter: drop-shadow( 5px 3px 6px rgba(0, 0, 0, .7));
  }

}
</style>
