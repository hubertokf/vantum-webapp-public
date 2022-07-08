<template>
  <div class="login-social">
    <div class="columns">

      <!-- <a href="#" class="social-button" id="facebook-connect"> <span>Connect with Facebook</span></a>
      <a href="#" class="social-button" id="google-connect"> <span>Connect with Google</span></a>
      <a href="#" class="social-button" id="linkedin-connect"> <span>Connect with LinkedIn</span></a> -->
      <div class="column">
        <a href="http://localhost:1337/auth/facebook" target="_blank" class="social-button"><i class="fab fa-facebook-f"></i>Facebook</a>
      </div>
      <div class="column">
        <a href="/auth/google" class="social-button"><i class="fab fa-google"></i>Google</a>
      </div>
      <div class="column">
        <a href="/auth/linkedin" class="social-button"><i class="fab fa-linkedin-in"></i>Linkedin</a>
      </div>
      <facebook-login class="social-button"
        appId="374440683335045"
        @login="onLogin"
        @logout="onLogout"
        @sdk-loaded="sdkLoaded">
      </facebook-login>
    </div>
    
  </div>
</template>

<script>
  import Vue from 'vue'
  import facebookLogin from 'facebook-login-vuejs'

  export default {
    name: 'login-social',
    components: {
        facebookLogin
    }, 
    
    data(){
      return{
        idImage, loginImage, mailImage, faceImage,
        isConnected: false,
        name: '',
        email: '',
        personalID: '',
        FB: undefined,
      } 
    },
    methods: {
      getUserData() {
        this.FB.api('/me', 'GET', { fields: 'id,name,email' },
          facebookUser => {
            this.$store.dispatch('facebookLogin', facebookUser)
              .then(() => this.$router.push('/vantum/app'))
              .catch((err) => {})
            console.log("data api",facebookUser)
            this.personalID = facebookUser.id;
            this.email = facebookUser.email;
            this.name = facebookUser.name;
          }
        )
      },
      sdkLoaded(payload) {
        this.isConnected = payload.isConnected
        this.FB = payload.FB
        if (this.isConnected) this.getUserData()
      },
      onLogin() {
        this.isConnected = true
        // console.log("THIS", this.getUserData())
        this.getUserData()
        // this.$store.dispatch('facebookLogin', aux)
      },
      onLogout() {
        this.isConnected = false;
      }
    }    
  }
</script>

<style lang="scss" scoped>
  .login-social{

    .social-button {
      display: inline-block;
      font-size: 12px;
      font-weight: bold;
      padding: 5px;
      border-radius: 5px;
      margin: 0 5px;
      color: #000;
      background-color: #F7F7F7;

      i{
        width: 18px;
        height: 18px;
        font-size: 7px;
        margin-left: 0;
        display: inline-block;
        font-weight: normal;
        width: 25px;
        height: 25px;
        background-color: #000;
        color: #fff;
        border-radius: 25px;
        text-align: center;
        padding-top: 5px;
        font-size: 15px;
        margin: 0 5px;
        -webkit-transition: all 0.3s ease;
        transition: all 0.3s ease;
      
        &[class*="fa-facebook"] {
          background-color: #3b5998;
        }

        &[class*="fa-google"] {
          background-color: #dd4b39;
        }

        &[class*="fa-linkedin"] {
          background-color: #007bb6;
        }
      }
      
    }

    // .social-button {
    //   background-position: 25px 0px;
    //   box-sizing: border-box;
    //   color: rgb(255, 255, 255);
    //   cursor: pointer;
    //   display: inline-block;
    //   height: 50px;
    //   line-height: 50px;
    //   text-align: left;
    //   text-decoration: none;
    //   text-transform: uppercase;
    //   vertical-align: middle;
    //   width: 100%;
    //   border-radius: 3px;
    //   margin: 10px auto;
    //   outline: rgb(255, 255, 255) none 0px;
    //   padding-left: 20%;
    //   transition: all 0.2s cubic-bezier(0.72, 0.01, 0.56, 1) 0s;
    //   -webkit-transition: all .3s ease;
    //   -moz-transition: all .3s ease;
    //   -ms-transition: all .3s ease;
    //   -o-transition: all .3s ease;
    //   transition: all .3s ease;

    //   &#facebook-connect{
    //     background: rgb(255, 255, 255) url('https://eswarasai.com/projects/social-login/img/facebook.svg') no-repeat scroll 5px 0px / 30px 50px padding-box border-box;
    //     border: 1px solid rgb(60, 90, 154);

    //     &:hover {
    //       border-color: rgb(60, 90, 154);
    //       background: rgb(60, 90, 154) url('https://eswarasai.com/projects/social-login/img/facebook-white.svg') no-repeat scroll 5px 0px / 30px 50px padding-box border-box;
    //       -webkit-transition: all .8s ease-out;
    //       -moz-transition: all .3s ease;
    //       -ms-transition: all .3s ease;
    //       -o-transition: all .3s ease;
    //       transition: all .3s ease-out;

    //       span {
    //         color: #FFF;
    //         -webkit-transition: all .3s ease;
    //         -moz-transition: all .3s ease;
    //         -ms-transition: all .3s ease;
    //         -o-transition: all .3s ease;
    //         transition: all .3s ease;
    //       }
    //     }

    //     span{
    //       box-sizing: border-box;
    //       color: rgb(60, 90, 154);
    //       cursor: pointer;
    //       text-align: center;
    //       text-transform: uppercase;
    //       border: 0px none rgb(255, 255, 255);
    //       outline: rgb(255, 255, 255) none 0px;
    //       -webkit-transition: all .3s ease;
    //       -moz-transition: all .3s ease;
    //       -ms-transition: all .3s ease;
    //       -o-transition: all .3s ease;
    //       transition: all .3s ease;
    //     }
    //   }

    //   &#google-connect{
    //     background: rgb(255, 255, 255) url('https://eswarasai.com/projects/social-login/img/google-plus.png') no-repeat scroll 5px 0px / 50px 50px padding-box border-box;
    //     border: 1px solid rgb(220, 74, 61);

    //     &:hover {
    //       border-color: rgb(220, 74, 61);
    //       background: rgb(220, 74, 61) url('https://eswarasai.com/projects/social-login/img/google-plus-white.png') no-repeat scroll 5px 0px / 50px 50px padding-box border-box;
    //       -webkit-transition: all .8s ease-out;
    //       -moz-transition: all .3s ease;
    //       -ms-transition: all .3s ease;
    //       -o-transition: all .3s ease;
    //       transition: all .3s ease-out;

    //       span {
    //         color: #FFF;
    //         -webkit-transition: all .3s ease;
    //         -moz-transition: all .3s ease;
    //         -ms-transition: all .3s ease;
    //         -o-transition: all .3s ease;
    //         transition: all .3s ease;
    //       }
    //     }

    //     span{
    //       box-sizing: border-box;
    //       color: rgb(220, 74, 61);
    //       cursor: pointer;
    //       text-align: center;
    //       text-transform: uppercase;
    //       border: 0px none rgb(220, 74, 61);
    //       outline: rgb(255, 255, 255) none 0px;
    //       -webkit-transition: all .3s ease;
    //       -moz-transition: all .3s ease;
    //       -ms-transition: all .3s ease;
    //       -o-transition: all .3s ease;
    //       transition: all .3s ease;
    //     }
    //   }

    //   &#linkedin-connect{
    //     background: rgb(255, 255, 255) url('https://eswarasai.com/projects/social-login/img/linkedin.svg') no-repeat scroll 13px 0px / 28px 45px padding-box border-box;
    //     border: 1px solid rgb(0, 119, 181);

    //     &:hover {
    //       border-color: rgb(0, 119, 181);
    //       background: rgb(0, 119, 181) url('https://eswarasai.com/projects/social-login/img/linkedin-white.svg') no-repeat scroll 13px 0px / 28px 45px padding-box border-box;
    //       -webkit-transition: all .8s ease-out;
    //       -moz-transition: all .3s ease;
    //       -ms-transition: all .3s ease;
    //       -o-transition: all .3s ease;
    //       transition: all .3s ease-out;

    //       span {
    //         color: #FFF;
    //         -webkit-transition: all .3s ease;
    //         -moz-transition: all .3s ease;
    //         -ms-transition: all .3s ease;
    //         -o-transition: all .3s ease;
    //         transition: all .3s ease;
    //       }
    //     }

    //     span{
    //       box-sizing: border-box;
    //       color: rgb(0, 119, 181);
    //       cursor: pointer;
    //       text-align: center;
    //       text-transform: uppercase;
    //       border: 0px none rgb(0, 119, 181);
    //       outline: rgb(255, 255, 255) none 0px;
    //       -webkit-transition: all .3s ease;
    //       -moz-transition: all .3s ease;
    //       -ms-transition: all .3s ease;
    //       -o-transition: all .3s ease;
    //       transition: all .3s ease;
    //     }
    //   }
    // }
  }
</style>
