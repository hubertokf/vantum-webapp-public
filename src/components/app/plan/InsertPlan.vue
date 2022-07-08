<template>
  <div class="plan-item" :class="[isActive ? 'active' : '']">
    <div class="shareFlag" v-if="share">
      <i class="fas fa-share-alt"></i>
    </div>
    <div class="icon">
      <i class="fas fa-map"></i>
    </div>

    <div class="info">
      <div class="name">{{ plan.name }}</div>
      <div class="creationDate">{{ plan.createdAt | moment("DD/MM/YYYY HH:mm") }}</div>
      <div class="owner">{{ plan.owner.fullName }}</div>
    </div>
  </div>
</template>

<script>
// import ProjectShare from './ProjectShare.vue';

export default {
  name: "insert-plan",
  data() {
    return {
      colorTransparent: "",
      chosenProjects: [],
      removedInsert: false,
      projectId: "",
      shareVariable: false
    };
  },
  props: {
    plan: {
      type: Object
    },
    share: {
      type: Object,
      default: null
    },
    example: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  mounted() {},

  methods: {
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    }
  }
};
</script>

<style lang="scss" scoped>
.plan-item {
  padding: 15px 0;
  position: relative;
  background: white;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  cursor: pointer;
  overflow: hidden;

  &.active {
    background-color: #006746;
    color: white !important;
    .info {
      .creationDate,
      .owner {
        color: white;
      }
    }
    .icon {
      i {
        color: white;
      }
    }
  }

  .shareFlag {
    color: white;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    left: -16px;
    top: -3px;
    background-color: #006746;
    display: block;
    height: 25px;
    position: absolute;
    width: 50px;
    text-align: center;
    font-size: 16px;
    line-height: 26px;

    i {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  &:last-child {
    margin-bottom: 7px;
  }

  .icon {
    display: inline-block;
    height: 50px;
    width: 50px;
    overflow: hidden;
    margin: 3px 10px 3px 10px;
    float: left;
    text-align: center;

    img {
      width: 35px;
      @include v-centerer;
    }

    i {
      // margin-left: 5px;
      line-height: 50px;
      font-size: 40px;
      color: var(--color-dark);
    }
  }

  .info {
    display: inline-block;
    line-height: 16px;

    .name {
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
    }

    .creationDate {
      font-size: 12px;
      color: #666;
    }

    .owner {
      color: #666;
      font-size: 11px;
    }
  }

  .tools {
    @include v-centerer;
    padding: 10px;
    right: 0;
    text-align: center;

    .deleteItem {
      cursor: pointer;
      margin-bottom: 5px;
      &:hover {
        color: red;
      }
    }

    .shareItem {
      cursor: pointer;

      &:hover {
        color: green;
      }
    }
  }
}
</style>