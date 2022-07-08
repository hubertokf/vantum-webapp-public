<template>
  <div class="project-details" v-if="project">
    <b-collapse class="description" :open.sync="openDescription">
      <div slot="trigger" class="header" role="button">
        <div class="title">Descrição</div>
        <a class="icon">
          <i class="fas" :class="openDescription ? 'fa-angle-down' : 'fa-angle-right'"></i>
        </a>
      </div>
      <p>{{ project.description }}</p>
    </b-collapse>

    <!-- <ul class="plans-selection" v-if="planSelection">
      <div class="label">Selecione:</div>
      <li
        class="plan"
        v-for="(plan, index) in project.plans"
        :key="'plan-'+index"
        @click="selectPlan(plan, index)"
      >
        <div class="date">{{plan.planDate | moment("DD/MM/YYYY")}}</div>
        <span>-</span>
        <div class="name">{{plan.name}}</div>
      </li>
    </ul>-->

    <!-- <div class="plans" v-if="!planSelection && project.plans != undefined">
      <div class="plans-slider">
        <div class="previous" @click="previousMap">
          <i class="fas fa-angle-left"></i>
        </div>

        <div class="date" @click="planSelection = true">
          <i class="fas fa-map"></i>
          {{project.plans[planIndex].planDate | moment("DD/MM/YYYY")}}
        </div>

        <div class="next" @click="nextMap">
          <i class="fas fa-angle-right"></i>
        </div>
      </div>

      <div class="planName">{{project.plans[planIndex].name}}</div>

      <plan-details
        :plan="project.plans[planIndex]"
        ref="planDetails"
        :key="'plandetail-'+project.plans[planIndex].id"
      ></plan-details>
    </div>
    <div class="plans-list" v-if="!planSelection && project.plans != undefined">
      <div v-for="plan in project.plans" :object="plan" :key="plan.id">
        <div>
          <i class="fas fa-map"></i>
          {{plan.name}}
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import PlanDetails from "../plan/PlanDetails";
export default {
  name: "project-details",
  props: {
    project: {
      type: Object,
      default: null
    }
  },
  components: {
    PlanDetails
  },
  data() {
    return {
      planIndex: 0,
      planSelection: false,
      openDescription: false
    };
  },
  mounted() {},
  methods: {
    selectPlan(plan, index) {
      this.planIndex = index;
      this.planSelection = false;
      this.$refs.planDetails.updateOrthomosaics(
        this.project.plans[this.planIndex].orthomosaics
      );
    },
    nextMap() {
      if (this.planIndex < this.project.plans.length - 1) {
        this.planIndex++;
        this.$refs.planDetails.updateOrthomosaics(
          this.project.plans[this.planIndex].orthomosaics
        );
      }
    },
    previousMap() {
      if (this.planIndex > 0) {
        this.planIndex--;
        this.$refs.planDetails.updateOrthomosaics(
          this.project.plans[this.planIndex].orthomosaics
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.plans-list {
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 10px;

  overflow-y: auto;

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

.project-details {
  .plans-selection {
    .plan {
      background-color: var(--color-lighter);
      padding: 5px;
      margin-bottom: 10px;
      position: relative;
      cursor: pointer;

      .date {
        display: inline-block;
      }

      .name {
        display: inline-block;
      }
    }
  }

  .plans-slider {
    text-align: center;
    font-size: 21px;
    line-height: 33px;
    font-weight: bold;
    color: var(--color-dark);

    .date {
      display: inline-block;
      margin: 0 30px;
      cursor: pointer;
    }

    .previous,
    .next {
      display: inline-block;
      background: var(--color-dark);
      color: white;
      border-radius: 100%;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
  }

  .content {
    padding: 0 0px;
    display: flex;
    flex-flow: column;
    height: 100%;
  }

  .description {
    margin-bottom: 20px;
    color: black;

    .title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
      display: inline-block;
    }

    i {
      color: black;
    }
  }

  .planName {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }

  .plans {
    overflow-y: auto;

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

    .plan-item {
      padding: 10px 10px;
      -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.16);
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.16);
      margin-bottom: 10px;
      background-color: var(--color-dark);
      transition: all 0.1s height;

      &.active {
        padding: 0;
        background-color: transparent;
        -webkit-box-shadow: 0px 0px 0px;
        box-shadow: 0px 0px 0px;

        .header {
          .title {
            color: black;
          }
          .icon {
            color: black;
          }
        }
      }

      .header {
        .title {
          font-weight: bold;
          font-size: 16px;
          display: inline-block;
          margin-bottom: 0;
          color: white;
        }
        .icon {
          margin-left: 5px;
          color: white;
        }
      }

      .content {
        padding: 0 0px;
      }
    }
  }
}
</style>