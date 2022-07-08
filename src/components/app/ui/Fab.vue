<template>
  <div class="fab-menu" :class="{ show: show }">
    <div class="main" @click="toggle">
      <b-icon pack="fas" :icon="main.icon"></b-icon>
    </div>
    <ul class="options">
      <li
        class="option"
        v-for="(option, index) in options"
        :key="index"
        @click="fire(option.action)"
      >
        <div class="label">{{ option.label }}</div>
        <b-icon pack="fas" :icon="option.icon" :size="'is-medium'"></b-icon>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "fab-menu",
  props: {
    options: {
      type: Array,
      default: []
    },
    main: {
      type: Object,
      default: () => ({
        icon: "plus"
      })
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
    fire(action) {
      action();
    }
  }
};
</script>

<style lang="scss" scoped>
.fab-menu {
  position: fixed;
  bottom: 65px;
  right: 60px;
  z-index: 20;

  .main {
    cursor: pointer;
    border-radius: 30px;
    border: none;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    background-color: var(--color-dark);
    font-size: 24px;
    color: white;
    padding: 6px 0;
    text-align: center;

    -webkit-transition: 0.2s ease-out;
    -moz-transition: 0.2s ease-out;
    transition: 0.2s ease-out;

    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 30px;
    right: 0;
    bottom: 0;
    z-index: 20;

    .icon {
      font-size: 17px;
      -webkit-transition: -webkit-transform 0.2s ease-in-out;
      -ms-transition: -ms-transform 0.2s ease-in-out;
      transition: transform 0.2s ease-in-out;

      i {
        font-size: 17px;

        &:before {
          font-size: 17px;
        }
      }
    }
  }

  &.show {
    .main {
      outline: none;
      background-color: var(--color-dark);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
      .icon {
        transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
      }
    }

    .options {
      bottom: 55px;

      background-color: rgba(254, 254, 254, 0.8);
      border-radius: 5px;
      padding: 6px;

      .option {
        margin-bottom: 10px;
        opacity: 1;
      }
    }
  }

  .options {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0;
    padding-right: 0px;
    margin: 0;
    list-style: none;
    z-index: 10;
    margin-right: 10px;

    -webkit-transition: 0.2s ease-out;
    -moz-transition: 0.2s ease-out;
    transition: 0.2s ease-out;
    .option {
      display: flex;
      justify-content: flex-end;
      position: relative;
      margin-bottom: -10%;
      color: var(--color-dark);

      -webkit-transition: 0.3s ease-out;
      -moz-transition: 0.3s ease-out;
      transition: 0.3s ease-out;
      opacity: 0;
      cursor: pointer;

      text-shadow: 1px 2px 3px #999;

      .icon{
        font-size: 13px;

        i{
          font-size: 13px;
        }
      }

      .label {
        margin-right: 5px;
        padding: 5px 8px;
        font-size: 15px;
        pointer-events: none;
        margin-bottom: 0;

        -webkit-transition: 0.2s ease-out;
        -moz-transition: 0.2s ease-out;
        transition: 0.2s ease-out;
      }
    }
  }
}
</style>
