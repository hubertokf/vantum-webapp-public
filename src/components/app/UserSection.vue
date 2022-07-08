<template>
  <div class="userSection">
    <div class="content" slot="trigger" v-if="getUser" >
      <div class="companyLogo" v-if="company">
        <img :src="company.logo">
      </div>
      <div class="userAvatar" >
        <img src="@/assets/img/avatar.png" alt="">
      </div>
      <div class="userName">{{ getUser.fullName }}</div>
      <b-tooltip label="Configurações" 
        type="is-light"
        position="is-bottom">
        <div class="config" v-on:click.stop="config()">
          <i class="fas fa-cog"></i>
        </div>
      </b-tooltip>
      <b-tooltip label="Sair" 
        type="is-light"
        position="is-bottom">
        <div class="logout" v-on:click.stop="logout()">
          <i class="fas fa-sign-out-alt"></i>
        </div>
      </b-tooltip>
    </div>
    <div class="register"  v-if="!getUser">
      <a class="button is-primary register-button" href="/signup">
        <span class="icon">
          <i class="fas fa-user-plus"></i>
        </span>
        <span>Criar conta</span>
      </a>
      <a class="bd-tw-button button login-button" href="/login">
        <span class="icon">
          <i class="fas fa-sign-in-alt"></i>
        </span>
        <span>Login</span>
      </a>
        
    </div>
  </div>
</template>

<script>
  export default {
    name: 'user-section',
    methods: {
      logout(){
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push({name:'Login'})
        })
        .catch((err) => {
          console.log(err)
          
          this.$buefy.toast.open({
            message: 'Erro ao efetuar o logout.',
            type: 'is-danger',
            position: 'is-bottom'
          })
        })
      },
      config(){
        this.$router.push({name: 'UserConfig'})
      }
    },
    computed: {
      company() {
        return this.$store.getters.getCurrentCompany 
      },
      getUser() {
        if(this.$store.state.auth.user.hasOwnProperty("id")){
          return this.$store.state.auth.user 
        }else{
          return null
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .userSection{
      padding: 10px 10px;
      background-color: #303333;
      background-color: #0c1013;
      background-color: var(--color-dark);
      height: 120px;
      // position: absolute;
      position: relative;
      width: 100%;
      // top: 0;
      z-index: 1;

      -webkit-box-shadow: 2px 10px rgba(0, 0, 0, 0.4);
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.4);

      .register{
        text-align: center;
        padding: 40px;

        .register-button {
          background-color: var(--color-light);
          margin-right: 15px;

          &:hover{
            background-color: var(--color-light);
          }
        }

        .login-button {
          background-color: white;

          &:hover{
            background-color: white;
          }
        }
      }

      .dropdown{
        @include v-centerer;
        width: 100%;
      }

      .content{
        // @include v-centerer;
        // cursor: pointer;

        i{
          margin-left: 5px;
          color: white;
        }


        .companyLogo{
          margin-bottom: 5px;
          height: 60px;
          width: 100%;
          text-align: center;

          img{
            max-height: 100%;
            max-width: 100%;
          }
        }

        .userAvatar{
          display: inline-block;
          vertical-align: middle;
          border-radius: 100%;
          border: 2px solid var(--color-darker);
          height: 40px;
          width: 40px;
          overflow: hidden;
    
          img{
          }
        }
  
        .userName{
          display: inline-block;
          margin-left: 10px;
          font-weight: bold;
          color: var(--color-light);
          color: #3bf96e;
          color: white;
          max-width: 230px;
        }

        .config{
          display: inline-block;
          margin-left: 20px;
          cursor: pointer;
        }

        .logout{
          display: inline-block;
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }
</style>