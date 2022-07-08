<template>
  <div class="bm-overlay" :class="{ open: visible }" @click="hide">
    <div class="bm-menu" :class="{ open: visible }" @click.stop="show">
      <nav class="bm-item-list">
        <!-- <slot></slot> -->
        <div class="content" slot="trigger" v-if="user">
          <div class="companyLogo" v-if="company">
            <img :src="company.logo" />
          </div>
          <div class="userAvatar">
            <img src="@/assets/img/avatar.png" alt="" />
          </div>
          <div class="userName">{{ user.fullName }}</div>
          <div class="config" v-on:click.stop="config()">
            <i class="fas fa-cog"></i> Configuraçoes
          </div>
          <div class="logout" v-on:click.stop="logout()">
            <i class="fas fa-sign-out-alt"></i> Logout
          </div>
        </div>

        <div class="register" v-if="!user">
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
      </nav>
      <span class="bm-cross-button cross-style" @click.stop="closeMenu">
        <span
          v-for="(x, index) in 2"
          :key="x"
          class="bm-cross"
          :style="{
            position: 'absolute',
            width: '3px',
            height: '14px',
            transform: index === 1 ? 'rotate(45deg)' : 'rotate(-45deg)'
          }"
        >
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "burger-menu",
  data() {
    return {
      visible: false
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false
    }
  },
  watch: {
    isOpen() {
      if (this.isOpen && !this.visible) this.show();
      else if (!this.isOpen && this.visible) this.hide();
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    company() {
      return this.$store.getters.getCompany;
    }
  },
  methods: {
    hide() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
    closeMenu() {
      this.visible = false;
    },
    closeMenuOnEsc(e) {
      e = e || window.event;
      if (e.key === "Escape" || e.keyCode === 27) {
        this.closeMenu();
      }
    },
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push({ name: "Login" });
        })
        .catch(err => {
          console.log(err);

          this.$buefy.toast.open({
            message: "Erro ao efetuar o logout.",
            type: "is-danger",
            position: "is-bottom"
          });
        });
    },
    config() {
      this.$router.push({ name: "UserConfig" });
    }
  },
  mounted() {
    if (!this.disableEsc) {
      document.addEventListener("keyup", this.hide);
    }
  }
};
</script>

<style lang="scss">
.bm-overlay {
  height: 100%;
  width: 0;
  background-color: rgba($color: #000000, $alpha: 0.5);
  position: fixed; /* Stay in place */
  z-index: 999; /* Stay on top */
  top: 0;
  left: 0;
  overflow-x: hidden; /* Disable horizontal scroll */

  &.open {
    width: 100%; /* 0 width - change this with JavaScript */
  }
}
.register {
  text-align: center;
  padding: 40px;

  .register-button {
    background-color: var(--color-light);
    margin-right: 15px;

    &:hover {
      background-color: var(--color-light);
    }
  }

  .login-button {
    background-color: white;

    &:hover {
      background-color: white;
    }
  }
}

// .dropdown {
//   @include v-centerer;
//   width: 100%;
// }

.content {
  // @include v-centerer;
  // cursor: pointer;
  padding-top: 0;

  i {
    margin-left: 5px;
    color: white;
  }

  .companyLogo {
    margin-bottom: 5px;
    height: 60px;
    width: 100%;
    text-align: center;

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }

  .userAvatar {
    // display: inline-block;
    vertical-align: middle;
    border-radius: 100%;
    border: 2px solid var(--color-darker);
    height: 60px;
    width: 60px;
    overflow: hidden;
    margin: auto;

    img {
    }
  }

  .userName {
    // display: inline-block;
    text-align: center;
    margin-left: 10px;
    font-weight: bold;
    font-size: 20px;
    color: var(--color-light);
    color: #3bf96e;
    color: white;
    max-width: 230px;
    margin: auto;
    margin-bottom: 20px;

  }

  .config {
    margin-bottom: 20px;
    cursor: pointer;
  }

  .logout {
    margin-bottom: 20px;
    // margin-left: 20px;
    cursor: pointer;
  }
}
html {
  height: 100%;
}
.line-style {
  position: absolute;
  height: 20%;
  left: 0;
  right: 0;
}
.cross-style {
  position: absolute;
  top: 12px;
  right: 2px;
  cursor: pointer;
}
.bm-cross {
  background: #bdc3c7;
}
.bm-cross-button {
  height: 24px;
  width: 24px;
}
.bm-cross-button.hidden {
  display: none;
}
.bm-menu {
  height: 100%; /* 100% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1000; /* Stay on top */
  top: 0;
  left: 0;
  background-color: rgb(63, 63, 65); /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /*0.5 second transition effect to slide in the sidenav*/

  &.open {
    width: 300px; /* 0 width - change this with JavaScript */
  }
}

.bm-item-list {
  color: #b8b7ad;
  // margin-left: 10%;
  font-size: 20px;
}
.bm-item-list > * {
  // display: flex;
  text-decoration: none;
  padding: 0.7em;
}
.bm-item-list > * > span {
  margin-left: 10px;
  font-weight: 700;
  color: white;
}
</style>
