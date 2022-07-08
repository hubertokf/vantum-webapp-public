<template>
  <div class="map-tools columns is-mobile">
    <div class="column tool" v-bind:class="{active: markerToolStatus}" @click="markerTool"><i class="fas fa-map-marker-alt"></i></div>

    <div class="column tool" :class="{ 'active': polygonToolStatus }" @click="polygonTool"><i class="fas fa-draw-polygon"></i></div>

    <div class="column tool" :class="{ 'active': rulerToolStatus }" @click="rulerTool"><i class="fas fa-ruler"></i></div>

    <div class="column tool" :class="{ 'active': volumeToolStatus }" @click="volumeTool"><i class="fas fa-cubes"></i></div>
  </div>
</template>

<script>
  export default {
    name: "map-tools",
    data() {
      return {
      }
    },
    computed: {
      markerToolStatus: {
        get() {
          return this.$store.state.map.markerToolStatus
        },
        set(value) {
          this.$store.commit('set_marker_tool_status', value);
        }
      },
      polygonToolStatus: {
        get() {
          return this.$store.state.map.polygonToolStatus
        },
        set(value) {
          this.$store.commit('set_polygon_status', value);
        }
      },
      rulerToolStatus: {
        get() {
          return this.$store.state.map.rulerToolStatus
        },
        set(value) {
          this.$store.commit('set_ruler_status', value);
        }
      },
      volumeToolStatus: {
        get() {
          return this.$store.state.map.volumeToolStatus
        },
        set(value) {
          this.$store.commit('set_volume_status', value);
        }
      },
    },
    methods: {
      markerTool() {
        // let status = !this.markerToolStatus
        // this.disableTools()
        // this.markerToolStatus = status;
        // this.$root.$emit('activateInputMode', 1)
        this.$root.$emit('addmarker', -1)

      },
      polygonTool() {
        // let status = !this.polygonToolStatus
        // this.disableTools()
        // this.polygonToolStatus = status;
        // this.$root.$emit('activateInputMode', -1)
        this.$root.$emit('add-polygon', -1)
      },
      rulerTool() {
        // let status = !this.rulerToolStatus
        // this.disableTools()
        // this.rulerToolStatus = status;
        // this.$root.$emit('activateInputMode', -1)
        this.$root.$emit('add-polyline', -1)
      },
      volumeTool() {
        // let status = !this.volumeToolStatus
        // this.disableTools()
        // this.volumeToolStatus = status;
        // this.$root.$emit('activateInputMode', -1)
        this.$root.$emit('add-simpleshape', -1)

      },
      disableTools(){
        this.markerToolStatus = false;
        this.polygonToolStatus = false;
        this.rulerToolStatus = false;
        this.volumeToolStatus = false;
      }
    },
  }
</script>

<style lang="scss" scoped>
  .map-tools{
    text-align: center;
    padding: 0 10px;

    .tool{
      font-size: 25px;
      padding: 0;
      cursor: pointer;
      border: 1px solid #e1e1e1;
      border-radius: 5px;
      margin: 0 3px;
      -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.16);
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.16);

      &.active{
        background-color: var(--color-dark);
        color: #F1f1f1;
      }
    }
  }

</style>