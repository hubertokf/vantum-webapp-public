<template>
  <div class="hotsite overlay section">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="logo">
            <img class="branco" src="../assets/img/Marca_principal_branco.svg">
          </div>
        </div>
        <div class="column is-12">
          <div class="countdown">
            <Timer
              starttime="Sep 5, 2018 15:37:25"
              endtime="Nov 6, 2018 23:59:00"
              trans='{
              "day":"Dias",
              "hours":"Horas",
              "minutes":"Minutos",
              "seconds":"Segundos",
              "expired":"O evento expirou.",
              "status": {
                  "expired":"Expirado",
                  "upcoming":"Futuro"
                }}'
              ></Timer>
          </div>
        </div>
        <div class="column is-4 is-offset-4">
          <div class="subscribe-text">Inscreva-se!</div>
          <subscribe-form action="https://vantum.us19.list-manage.com/subscribe/post?u=c1636792f42f5fd2b362a16e7&amp;id=9a18d28084"></subscribe-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timer from '@/components/Timer'
import SubscribeForm from '@/components/SubscribeForm'

export default {
  name: 'hotsite',
  components: { Timer, SubscribeForm },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .hotsite {
    overflow: hidden;
    position: relative;
    background: url(../assets/img/bg2.jpg) no-repeat center;
    background-size: cover;
    bottom: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    padding-top: 10px;

    .logo{
      // margin-top: 40px;

      img{
        max-height: 250px;
      }
    }

    .countdown{
      color: white;
    }

    .subscribe-text{
      color: white;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    &.overlay {
      position: relative;

      &::before{
        position: absolute;
        content:" ";
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:0;
        background-color: rgba(43,63,74,0.8);
      }
    }
  }

</style>
