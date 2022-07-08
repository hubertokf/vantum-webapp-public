<template>
  <div class="comparePlans">
    <div class="title">Comparar mapas</div>

    <ul class="plansList">
      <li class="plan" v-for="(plan, index) in plans" :key="'plan-'+index">
        <div class="planName">{{plan.name}}</div>
        <ul class="orthomosaicsList">
          <li
            class="orthomosaic"
            v-for="(orthomosaic, index) in plan.orthomosaics"
            :key="'orthomosaic-'+index"
          >
            <b-checkbox
              type="is-success"
              v-model="mosaicsToCompare"
              :native-value="orthomosaic"
              @input="checked"
              :disabled="mosaicsToCompare.length >= 2 && mosaicsToCompare.indexOf(orthomosaic) === -1"
            >{{orthomosaic.type}}</b-checkbox>
          </li>
        </ul>
      </li>
    </ul>

    <div class="controlButtons">
      <b-button class="cancelbt is-primary is-pulled-left" @click="cancel()">Cancelar</b-button>

      <b-button class="comparebt is-primary is-pulled-right" @click="compare()">Comparar Mapas</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "compare-plans",
  props: {
    plans: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      mosaicsToCompare: []
    };
  },
  mounted() {
    this.$root.$emit("clear-orthomosaics");
  },
  watch: {
    mosaicsToCompare() {
      this.updateOrthomosaics();
    }
  },
  methods: {
    checked() {
      this.$root.$emit("stop-slide-comparison");
    },
    compare() {
      if (this.mosaicsToCompare.length == 2) {
        this.$root.$emit("stop-slide-comparison");

        this.$root.$emit("start-slide-comparison");

        if (this.$isMobile) {
          this.$store.dispatch("toggleSidebar");
        }
      } else {
        this.$buefy.dialog.alert({
          title: "Error",
          message: "Você deve selecionar 2 mosaicos para fazer a comparação",
          type: "is-danger",
          hasIcon: true,
          icon: "times-circle",
          iconPack: "fa"
        });
      }
    },
    updateOrthomosaics() {
      this.$root.$emit("clear-orthomosaics");

      this.mosaicsToCompare.forEach(mosaic => {
        var location = {
          altitude: 14,
          latitude: mosaic.image.location.latitude,
          longitude: mosaic.image.location.longitude
        };

        this.centerMap(location);
        this.$root.$emit("add-orthomosaic", mosaic);
      });
    },
    cancel() {
      this.$root.$emit("stop-slide-comparison");
      this.$parent.stopComparePlans();
    },

    centerMap(coords) {
      this.$root.$emit("centerMap", coords);
    }
  }
};
</script>

<style lang="scss" scoped>
.comparePlans {
  .title {
    font-size: 22px;
    text-align: center;
    width: 100%;
    display: inline-block;
  }
  .cancelbt {
    margin-right: 20px;
  }
  .comparebt {
  }
  .plansList {
    .plan {
      .planName {
        font-weight: bold;
      }
    }
  }
  .orthomosaicsList {
    margin-left: 10px;

    .orthomosaic {
    }
  }

  .controlButtons {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>