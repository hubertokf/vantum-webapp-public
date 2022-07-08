<template>
  <div class="plansSection">
    <b-loading :is-full-page="false" :active.sync="isLoadingLists" :can-cancel="false"></b-loading>

    <div class="planList" v-if="!isLoadingLists">
      <insert-plan
        v-for="(plan) in getPlans"
        :plan="plan"
        :isActive="isActive(plan.id)"
        :key="plan.id"
        @click.native="select(plan)"
      ></insert-plan>
    </div>

    <div class="insertButtons">
      <a class="button is-primary newBT" @click="newPlan()">Novo</a>
      <a class="button is-primary saveBT is-pulled-right" @click="send()">Salvar</a>
      <a class="button is-primary cancelBT is-pulled-right" @click="cancel()">Cancelar</a>
    </div>
  </div>
</template>

<script>
import InsertPlan from "./InsertPlan";
export default {
  name: "insert-plan-list",
  props: {
    projectId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      projectsWithoutParent: [],
      removedInsert: false,
      colorTransparent: [],
      insertedPlans: [],
      project: [],
      plan: [],

      description: ""
    };
  },
  components: {
    "insert-plan": InsertPlan
  },
  mounted() {},

  computed: {
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    },
    getPlans() {
      return this.$store.getters.getPlans.filter(userPlan => {
        return !userPlan.project;
      });
    }
  },
  methods: {
    select(selectedPlan) {
      let index = this.insertedPlans.findIndex(
        plan => plan._id === selectedPlan._id
      );

      if (index == -1) {
        this.insertedPlans.push(selectedPlan);
      } else {
        this.insertedPlans.splice(index, 1);
      }
    },
    isActive(planId) {
      let index = this.insertedPlans.findIndex(plan => plan.id === planId);

      if (index != -1) {
        return true;
      }
      return false;
    },
    send() {
      let objectToSend;
      this.insertedPlans.forEach(insertedPlan => {
        objectToSend = {
          projectParentId: this.projectId,
          plan: insertedPlan
        };
        this.$store.dispatch("insertPlanIntoProject", objectToSend);
      });

      this.$router.go(-1);
    },
    cancel() {
      this.$router.go(-1);
    },

    newPlan() {
      this.$store.dispatch("setNewPlan", null);
      this.$router.push({
        name: "AddPlan",
        params: {
          projectParent: this.projectId
        }
      });
    }
  }
};
</script>

<style lang="scss">
.newPlan {
  margin: 8px;
}
.sendPlans {
  margin: 8px;
}
.plansSection {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  flex: 1;

  .insertButtons {
    padding: 10px;
    margin-bottom: 0;

    .cancelBT {
      margin-right: 10px;
    }

    .newBT {
      text-align: center;
    }

    .saveBT {
    }
  }

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