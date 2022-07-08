<template>
  <div class="plansSection">
    <b-loading :is-full-page="false" :active.sync="isLoadingLists" :can-cancel="false"></b-loading>
    <div class="planList" v-if="!isLoadingLists">
      <plan-item v-for="(plan) in getPlans" :object="plan" :key="plan.id"></plan-item>
    </div>

    <router-link :to="{ name: 'PlanForm'}">
      <div class="addPlan">
        <i class="fas fa-plus"></i>
      </div>
    </router-link>
  </div>
</template>

<script>
import PlanItem from "./PlanItem";

export default {
  name: "plan-list",
  data() {
    return {
      plans: [],
      description: ""
    };
  },
  components: {
    "plan-item": PlanItem
  },
  created() {},
  mounted() {
    var coords = {
      altitude: 4,
      latitude: -13.0618256,
      longitude: -63.5501318
    };
    this.$root.$emit("centerMap", coords);
    this.$store.dispatch("setNewPlan", null);
    this.$store.dispatch("setNewProject", null);
    this.$store.dispatch("setNewAlbum", null);
    this.$store.dispatch("setNewTask", null);
    this.$store.dispatch("", false)

    // this.$root.$emit('clear-markers')
    // console.log(this.getPlans)

    // this.getPlans.forEach(plan => {
    // // console.log("Oi")
    //   if (plan.location != "" || plan.location != null){
    //     this.$root.$emit('add-marker', {
    //       latitude: plan.location.latitude,
    //       longitude: plan.location.longitude
    //     })
    //   }
    // });
    // this.$root.$emit('map-rerender')
    this.$root.$emit("clear-annotations");
  },
  computed: {
    getPlans() {
      return this.$store.getters.getPlans;
    },
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    }
  },
  methods: {
    filteredList() {
      this.$store.dispatch("getPlans").then(plans => {
        return plans;
      });
    }
  }
};
</script>

<style lang="scss">
.plansSection {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  flex: 1;

  .addPlan {
    position: absolute;
    background: var(--color-dark);
    border-radius: 100%;
    margin-top: 8px;
    margin-left: 8px;
    margin-right: 5px;
    text-align: center;
    color: white;
    bottom: 55px;
    right: 45px;
    font-size: 22px;
    line-height: 49px;
    width: 50px;
    height: 50px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
      rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
      rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    cursor: pointer;
  }

  .planList {
    position: relative;
    overflow-y: auto;
    padding: 10px;
    height: 100%;

    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 8px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      // border-radius: 10px;
      background-color: #888;
    }
  }
}
</style>