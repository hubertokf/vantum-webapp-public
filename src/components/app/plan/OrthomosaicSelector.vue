<template>
  <div class="orthomosaics orthomosaic-selector" v-if="orthomosaics">
    <!-- <draggable
      class="list-group"
      tag="ul"
      v-model="orthomosaics"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
        <div
          v-for="orthomosaic in orthomosaics"
          class="orthomosaic"
          @click="toggleOrthomosaic(orthomosaic)"
          
          :class="[isActive(orthomosaic) ? 'active' : '']"
          :key="orthomosaic.id"
        >
          <div class="icon">
            <i class="fas fa-map" v-if="orthomosaic.type === 'orthophoto'"></i>
            <i class="fas fa-map" v-if="orthomosaic.type === 'dsm'"></i>
            <i class="fas fa-map" v-if="orthomosaic.type === 'dtm'"></i>
          </div>
          <div class="name">
            <div v-if="orthomosaic.type === 'orthophoto'">Ortofoto</div>
            <div v-if="orthomosaic.type === 'dsm'">Modelo de superfície</div>
            <div v-if="orthomosaic.type === 'dtm'">Modelo de terreno</div>
          </div>
          <div class="download" v-if="isActive(orthomosaic)"><a :href="orthomosaic.image.url"><i class="fas fa-cloud-download-alt" @click="(e)=> e.stopPropagation()"></i></a></div>
          <div class="opacity" v-if="isActive(orthomosaic)">
            <input
              class="slider is-fullwidth is-large is-danger is-circle"
              step="0.01"
              min="0"
              max="1"
              v-model="orthomosaic.opacity"
              type="range"
              @change="updateOpacity(orthomosaic)"
              @click.stop="(e) => e.stopPropagation()"
            >
          </div>
        </div>
      <!-- </transition-group>
    </draggable> -->
  </div>
</template>

<script>
  // import Draggable from "vuedraggable";

  export default {
    name: "orthomosaic-selector",
    data() {
      return {
        drag: false
      }
    },
    components: {
      // Draggable,
    },
    methods: {
      updateOpacity(orthomosaic) {
        this.$root.$emit('updateOpacity', orthomosaic)
      },
      isActive(ref){
        var index = this.$store.getters.getActiveOrthomosaics.findIndex(orthomosaic => orthomosaic.id === ref.id)

        if (index != -1){
          return true
        }
        return false

      },
      toggleOrthomosaic(orthomosaic) {
        // this.$store.dispatch('toggleOrthomosaic', orthomosaic)
        this.$store.dispatch('setActiveOrthomosaics', orthomosaic)
        if (this.$store.getters.getOrthomosaics.length){
          let center = {
            latitude: this.$store.getters.getOrthomosaics[0].image.location.latitude,
            longitude: this.$store.getters.getOrthomosaics[0].image.location.longitude
          }
          this.centerMap(center)
        }
        this.$root.$emit('toggleOrthomosaics')
        // this.$root.$emit('add-orthomosaic', orthomosaic)
        this.$root.$emit('activateOrthomosaics', orthomosaic)
      },
      centerMap(coords) {
        this.$root.$emit('centerMap', coords)
      },
    },
    computed: {
      orthomosaics: {
        get() {
          return this.$store.getters.getOrthomosaics
        },
        set(value) {
          this.$store.dispatch('setOrthomosaics', value);
        },
      },
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      }
    },
  }
</script>

<style lang="scss" scoped>
  .orthomosaics {
      margin-bottom: 20px;

      ul {
        margin: 0;
      }

      .orthomosaic {
        background-color: #e1e1e1;
        padding: 10px;
        cursor: pointer;
        position: relative;
        margin-bottom: 5px;
        height: 50px;

        &.active {
          // font-weight: bold;
          background-color: var(--color-dark);
          .icon {
            color: #f1f1f1;
          }
          .name {
            color: #f1f1f1;
          }
          .opacity {
            .slider {
              background: var(--color-darkerer); /* Grey background */
              opacity: 1; /* Fully shown on mouse-over */

              &::-webkit-slider-thumb {
                background: #f1f1f1; /* Green background */
              }

              &::-moz-range-thumb {
                background: #f1f1f1; /* Green background */
              }
            }
          }
        }

        .icon {
          display: inline-block;
          margin: 0px 5px;
          font-size: 20px;
          color: #c1c1c1;
        }

        .name {
          display: inline-block;
          font-size: 15px;
          line-height: 15px;
          font-weight: bold;
        }

        .opacity {
          display: inline-block;
          margin: 2px 10px;
          position: absolute;
          width: 70px;
          right: 0px;
        }
        .download{
          width: 30px;
          position: absolute;
          right: 85px;
          top: 0;
          margin: 13px 0;
          color: white;

          i{
            color: white;
          }
        }
      }
    }
</style>