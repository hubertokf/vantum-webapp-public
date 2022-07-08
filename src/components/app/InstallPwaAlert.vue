<template>
  <div class="pwa-alert" v-if="showInstallBanner">
    <div class="center">
      <div class="logo">
        <img src="@/assets/img/logo/symb_b2.svg" />
      </div>

      <div class="content">
        <button type="button" class="close" @click="close">&times;</button>

        <div class="text">Você gostaria de instalar o nosso aplicativo?</div>

        <a href="#" class="button is-primary installBt" @click.prevent="install">Instalar</a>
      </div>
    </div>
  </div>
</template>

<script>
let installEvent;
export default {
  name: "install-pwa",
  data() {
    return {
      showInstallBanner: false
    };
  },
  created() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      installEvent = e;
      this.showInstallBanner = true;
    });
  },
  methods: {
    install() {
      this.showInstallBanner = false;
      installEvent.prompt();
      installEvent.userChoice.then(() => {
        installEvent = null;
      });
    },
    close() {
      this.showInstallBanner = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.pwa-alert {
  position: absolute;
  bottom: 0;
  background-color: #f5f5f5;
  padding: 20px;
  width: 100%;
  text-align: center;
  display: flex;
  z-index: 9999999;

  .center {
    display: flex;
    margin: auto;

    .logo {
      width: 45px;
      margin-right: 25px;
      padding-top: 5px;
    }

    .content {
      .text {
        margin-bottom: 10px;
        margin-top: 10px;
      }

      .installBt {
        display: block;
      }
    }

    .close {
      position: absolute;
      right: 0;
      top: 0;
      border: 0;
      background: no-repeat;
      font-size: 20px;
      font-weight: bold;
      padding: 5px 20px 0 0;
    }
  }
}
</style>