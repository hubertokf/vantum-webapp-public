<template>
  <div class="nav-bar-content">
    <div class="nav-bar" :style="{ height: height + 'px' }">
      <div class="bg">
        <!-- <div class="overlay"></div> -->
        <slot name="bg"></slot>
      </div>
      <div class="leftBt">
        <slot name="left"></slot>
        <!-- <div
        class="back"
        v-if="back"
        @click="
          typeof backFunction == 'function' ? backFunction() : $router.go(-1)
        "
      >
        <b-icon :icon="'arrow-left'" :size="'is-medium'"></b-icon>
      </div>

      <div
        class="burguer"
        v-if="burger"
        @click="
          typeof backFunction == 'function' ? backFunction() : $router.go(-1)
        "
      >
        <b-icon :icon="'menu'" :size="'is-medium'"></b-icon>
      </div>
      <div
        class="close"
        v-if="close"
        @click="
          typeof backFunction == 'function' ? backFunction() : $router.go(-1)
        "
      >
        <b-icon :icon="'close'" :size="'is-medium'"></b-icon>
        </div>-->
      </div>

      <slot class="sectionTitle" name="title"></slot>

      <div class="spacer"></div>

      <div class="rightBt">
        <slot name="right"></slot>

        <!-- <b-dropdown aria-role="menu" position="is-bottom-left" v-if="ellipsisDd">
            <button class="dropdownMenu" v-if="allowEditVisualization" slot="trigger">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <slot></slot>
        </b-dropdown>-->
        <!-- <slot name="rightButtons"></slot> -->
      </div>
      <slot></slot>

      <!-- <div class="companyLogo" v-if="company">
        <img :src="company.logo" />
      </div>-->
    </div>
    <search-box v-show-slide="searchOpen"></search-box>
  </div>
</template>

<script>
import SearchBox from "@/components/app/SearchBox";

export default {
  name: "nav-bar",
  props: {
    scrollTop: {
      type: Number,
      default: 160
    },
    share: {
      type: Object
    }
  },
  components: {
    "search-box": SearchBox
  },
  data() {
    return {};
  },
  mounted() {
    // window.onscroll = function() {scrollFunction()};
    // function scrollFunction() {
    // }
  },
  methods: {
    onscroll(a) {}
  },
  computed: {
    searchOpen() {
      return this.$store.state.app.searchOpen;
      // return true
    },
    height() {
      if (this.scrollTop > 50) {
        //start shrink
        return 50;
      } else if (this.scrollTop > 30) {
        let a0 = 30;
        let a1 = 50;
        let b0 = 50;
        let b1 = 160;
        let v = this.scrollTop;
        let r = v - a0 + (b1 - b0) / (a1 - a0) + a1;

        return r;
      } else {
        return 140;
      }
    },
    burger: {
      get() {
        return this.$store.state.navbar.burger;
      },
      set(value) {
        this.$store.commit("set_burger", value);
      }
    },
    back: {
      get() {
        return this.$store.state.navbar.back;
      },
      set(value) {
        this.$store.commit("set_back", value);
      }
    },
    close: {
      get() {
        return this.$store.state.navbar.close;
      },
      set(value) {
        this.$store.commit("set_close", value);
      }
    },
    company() {
      return this.$store.getters.getCurrentCompany;
    },
    getUser() {
      if (this.$store.state.auth.user.hasOwnProperty("id")) {
        return this.$store.state.auth.user;
      } else {
        return null;
      }
    }
  }
};
</script>

<style lang="scss">
.nav-bar {
  padding: 10px 10px;
  background-color: #303333;
  background-color: #0c1013;
  background-color: var(--color-dark);
  height: 160px;
  // position: absolute;
  position: relative;
  width: 100%;
  // top: 0;
  z-index: 1;

  -webkit-box-shadow: 2px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.4);

  transition: height 0.3s ease-in-out;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  color: #fefefe;

  &.shrink {
    height: 50px;
  }

  .spacer {
    flex-grow: 1 !important;
  }

  .bg {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    .dashboard {
      height: 100%;
    }
  }

  .overlay {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }

  // .navigation {
  // background-color: var(--color-darker);
  // color: #164a39;
  // position: relative;
  // /* height: 66px; */
  // width: 100%;
  // padding: 5px 0px 0px 0px;
  // margin-bottom: 5px;
  // // margin-top: 5px;
  // margin-bottom: 20px;

  // // @include v-centerer;
  // // color: #fefefe;
  // // cursor: pointer;
  // position: sticky;
  // top: 0;
  // padding-top: 10px;
  // margin-bottom: 0;
  // padding-bottom: 10px;
  // padding-top: 0px;
  // z-index: 3;

  .sectionTitle {
    display: inline-block;
    /* padding: 12px 0px 3px 0; */
    margin-left: 10px;
    font-size: 22px;
    font-weight: bold;
    vertical-align: middle;
    max-width: 250px;
    align-self: flex-end;
    z-index: 3;
  }

  .middleContent {
    line-height: 30px;
    font-size: 22px;
    font-weight: bold;
    width: calc(100% - 20px);
    align-self: flex-end;
    z-index: 3;

    .icon {
      vertical-align: sub;
    }
  }

  .leftBt {
    display: inline-block;
    text-align: center;
    z-index: 3;

    vertical-align: middle;
    cursor: pointer;

    margin-right: 10px;

    .icon {
      font-size: 25px;

      i {
        font-size: 25px;

        &:before {
          font-size: 25px;
        }
      }
    }
  }

  .rightBt {
    display: inline-block;
    text-align: center;
    min-width: 40px;
    z-index: 3;

    vertical-align: middle;
    cursor: pointer;

    text-align: center;

    .icon {
      font-size: 25px;

      i {
        font-size: 25px;

        &:before {
          font-size: 25px;
        }
      }
    }
  }

  .dropdown {
    // position: relative;
    // top: inherit;
    // transform: none;

    button {
      background: none;
      border: 0;
      color: white;
      cursor: pointer;
    }

    .dropdown-item.is-active {
      background-color: var(--color-dark);
      color: white;
    }
  }

  .icons {
    display: inline-block;
    line-height: 15px;
    vertical-align: middle;

    .back-button {
      cursor: pointer;
    }
  }

  .slot {
    display: inline-block;
    margin-left: 20px;
    float: right;

    // position: absolute;
    // right: 0;
    // float: right;
    // line-height: 33px;
    // font-size: 17px;

    .button {
      background: none;
      border: 0;
      height: 30px;
      // display: block;
    }

    .editButton {
      color: var(--color-darker);
    }

    .deleteButton {
      // margin: 0 10px;
      // position: absolute;
      // right: 0;
      cursor: pointer;

      &:hover {
        color: red;
      }
    }
  }
  // }

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
      display: inline-block;
      vertical-align: middle;
      border-radius: 100%;
      border: 2px solid var(--color-darker);
      height: 40px;
      width: 40px;
      overflow: hidden;

      img {
      }
    }

    .userName {
      display: inline-block;
      margin-left: 10px;
      font-weight: bold;
      color: var(--color-light);
      color: #3bf96e;
      color: white;
      max-width: 230px;
    }

    .config {
      display: inline-block;
      margin-left: 20px;
      cursor: pointer;
    }

    .logout {
      display: inline-block;
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
</style>
