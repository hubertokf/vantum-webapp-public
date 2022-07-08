<template>
  <div class="navigationMenu">
    <div
      class="leftBt"
      @click="
        typeof backFunction == 'function' ? backFunction() : $router.go(-1)
      "
    >
      <b-icon :icon="leftIcon" :size="'is-medium'"></b-icon>
    </div>

    <div class="sectionTitle">{{ title }}</div>

    <div class="rightBt">
      <b-dropdown aria-role="menu" position="is-bottom-left" v-if="ellipsisDd">
        <button class="dropdownMenu" v-if="allowEditVisualization" slot="trigger">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <slot></slot>
      </b-dropdown>
      <slot name="rightButtons"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "navigation-menu",
  props: {
    ellipsisDd: {
      type: Boolean,
      default: true
    },
    leftIcon: {
      type: String,
      default: "arrow-left"
    },
    title: {
      type: String,
      default: ""
    },
    arrowBack: {
      type: Boolean,
      default: false
    },

    backFunction: {
      type: Function,
      default: null
    },
    share: {
      type: Object
    }
  },

  data() {
    return {
      allowEditVisualization: false
    };
  },
  mounted() {
    this.allowEdit(this.share);
  },
  computed: {},
  methods: {
    allowEdit(share) {
      if (!share || (share && share.level >= 2)) {
        this.allowEditVisualization = true;
      }
    }
  }
};
</script>

<style lang="scss">
.navigationMenu {
  // background-color: var(--color-darker);
  color: #164a39;
  position: relative;
  /* height: 66px; */
  width: 100%;
  padding: 5px 0px 0px 0px;
  margin-bottom: 5px;
  // margin-top: 5px;
  margin-bottom: 20px;

  // @include v-centerer;
  // color: #fefefe;
  // cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  position: sticky;
  top: 0;
  padding-top: 10px;
  margin-bottom: 0;
  padding-bottom: 10px;
  z-index: 2;

  .leftBt {
    display: inline-block;
    text-align: center;

    vertical-align: middle;
    cursor: pointer;

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

  .sectionTitle {
    display: inline-block;
    /* padding: 12px 0px 3px 0; */
    margin-left: 10px;
    font-size: 22px;
    font-weight: bold;
    vertical-align: middle;
    max-width: 250px;
  }

  .rightBt {
    display: inline-block;
    text-align: center;

    vertical-align: middle;
    cursor: pointer;

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
    float: right;
    .dropdownMenu {
      background: none;
      border: 0;
      cursor: pointer;
      font-size: 19px;
      color: var(--color-darker);
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
}
</style>
