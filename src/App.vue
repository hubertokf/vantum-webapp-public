<template>
  <div id="app" v-bind:class="{'notFullpage': !isFullpage}">
    <notifications group="global" position="bottom right" classes />

    <header-view v-if="!isFullpage"></header-view>
    <router-view></router-view>
    <footer-section v-if="!isFullpage"></footer-section>
    <footer-bar v-if="!isFullpage"></footer-bar>
  </div>
</template>

<script>
import * as socketIoClient from "socket.io-client";
import * as sailsIo from "sails.io.js";

export default {
  name: "App",
  components: {},
  data: () => ({
    io: null,
    isFullpage: true
  }),

  created: function() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "set_company_color1") {
        let root = document.documentElement;
        root.style.setProperty("--color-dark", mutation.payload);
      }
      if (mutation.type === "set_company_color2") {
        let root = document.documentElement;
        root.style.setProperty("--color-light", mutation.payload);
      }
      if (mutation.type === "set_company_color3") {
        let root = document.documentElement;
        root.style.setProperty("--color-darker", mutation.payload);
      }
      if (mutation.type === "set_company_color4") {
        let root = document.documentElement;
        root.style.setProperty("--color-lighter", mutation.payload);
      }
    });
    // dependendo da variavel meta passada no route, mostra ou não o header e footer
    this.isFullpage = this.$route.meta.fullpage;

    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout");
        }
        throw err;
      });
    });
  },
  mounted() {
    let split = window.location.host.split(".");
    let t = split[0];

    if (split[1] == "vantum") {
      if (t == "app") {
        t = "vantum";
      }
    } else if (split[1] == "agronatura-ca") {
      t = "agronatura";
    }

    this.$store
      .dispatch("getCompany", "slug=" + t)
      .then(company => {
        let root = document.documentElement;
        root.style.setProperty("--color-dark", company.colors.color1);
        root.style.setProperty("--color-light", company.colors.color2);
        root.style.setProperty("--color-darker", company.colors.color3);
        root.style.setProperty("--color-lighter", company.colors.color4);
      })
      .catch(err => {
        this.$store.dispatch("getCompany", "slug=vantum").then(company => {
          let root = document.documentElement;
          root.style.setProperty("--color-dark", company.colors.color1);
          root.style.setProperty("--color-light", company.colors.color2);
          root.style.setProperty("--color-darker", company.colors.color3);
          root.style.setProperty("--color-lighter", company.colors.color4);
        });
      });
  },

  methods: {
    // isFullpage() {
    //   return this.$route.meta.fullpage;
    // },
    setIoHandler() {
      if (!this.io) {
        const isProductionEnvironment = process.env.NODE_ENV === "production";

        let io = sailsIo(socketIoClient);
        let url;

        if (isProductionEnvironment) {
          url = `${location.protocol}//${location.hostname}${
            location.port ? ":" + location.port : ""
          }`;
        } else url = "http://localhost:1337";

        io.sails.url = url;
        io.sails.environment = process.env.NODE_ENV || "development";
        io.sails.useCORSRouteToGetCookie = false;

        this.$set(this, "io", io);
      }
    },

    signOut() {
      this.deleteCookie("user");
      this.isUserAuthenticated = false;
      localStorage.clear();

      this.$router.push({ name: "Home" });
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box !important;
}

// @font-face {
//   font-family: Noir;
//   src: url(/font/NoirStd-Medium.ttf);
//   font-weight: normal;
// }

.notifications {
  bottom: 100px !important;
  z-index: 999999 !important;
}

.notification {
  margin-bottom: 10px;
}

.vue-notification-template {
  padding: 10px;
  margin: 0 0px 5px;

  font-size: 12px;

  color: #ffffff;
  background: #44a4fc;
  border-left: 5px solid #187fe7;

  &.is-warning {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.is-error {
    background: #e54d42;
    border-left-color: #b82e24;
  }

  &.is-success {
    background: #68cd86;
    border-left-color: #42a85f;
  }
}

#app {
  @font-face {
    font-family: "Material Icons";
    font-style: normal;
    font-weight: 400;
    src: url(https://example.com/MaterialIcons-Regular.eot); /* For IE6-8 */
    src: local("Material Icons"), local("MaterialIcons-Regular"),
      url(https://example.com/MaterialIcons-Regular.woff2) format("woff2"),
      url(https://example.com/MaterialIcons-Regular.woff) format("woff"),
      url(https://example.com/MaterialIcons-Regular.ttf) format("truetype");
  }
  .material-icons {
    font-family: "Material Icons";
    font-weight: normal;
    font-style: normal;
    // font-size: 24px;  /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: "liga";
  }
  /* background: url(./assets/img/bg2.jpg); */
  /* font-family: 'Noir', 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  min-height: 100vh;

  &.notFullpage {
    // padding-bottom: 56px;
  }
}
</style>
