<template>
  <div class="annotation-details">
    <div class="description">
      <div class="label">Descrição:</div>
      <div class="text">{{ annotation.description }}</div>
    </div>

    <div class="length" v-if="annotation.length">
      <div class="label">Comprimento:</div>
      <div class="text">{{ annotation.length | number }} m</div>
    </div>

    <div class="radius" v-if="annotation.options.radius">
      <div class="label">Raio:</div>
      <div class="text">{{ annotation.options.radius | number }} m</div>
    </div>

    <div class="area" v-if="annotation.area">
      <div class="label">Área:</div>
      <b-tooltip :label="areaFormat +' m²'" type="is-success">
        <div class="text">{{ annotation.area/10000 | number }} ha</div>
      </b-tooltip>
    </div>

    <div class="volume" v-if="annotation.volume">
      <div class="label">Volume:</div>
      <div class="text">
        {{ annotation.volume | number }} m
        <sup>3</sup>
      </div>
    </div>

    <div class="color" v-if="annotation.options.color">
      <div class="label">Cor:</div>
      <div
        class="text"
        :style="'background-color: '+annotation.options.color"
      >{{ annotation.options.color }}</div>
    </div>

    <b-collapse class="pointsGroup" :open.sync="openPoints" v-if="annotation">
      <div slot="trigger" class="header" role="button">
        <p class="title">Coordenadas</p>
        <a class="icon">
          <i class="fas" :class="openPoints ? 'fa-angle-down' : 'fa-angle-right'"></i>
        </a>
      </div>
      <div class="content">
        <div
          class="points"
          v-if="annotation.type=='polygon' || annotation.type=='polyline' || annotation.type=='rectangle'"
        >
          <div class="label">Pontos:</div>
          <ul>
            <li
              class="point"
              v-for="(point, index) in annotation.latlngs"
              :key="'point-'+index"
              @click="pointClick(point)"
            >
              <i class="fas fa-crosshairs"></i>
              {{ point | point }}
            </li>
          </ul>
        </div>

        <div class="centroid">
          <div class="label">Centroide:</div>
          <div class="point" @click="pointClick(getCentroid(annotation.latlngs))">
            <i class="fas fa-crosshairs"></i>
            {{ getAnnotationCenter(annotation) | point }}
          </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: "annotation-details",
  props: {
    annotation: {
      type: Object
    }
  },
  data() {
    return {
      openPoints: false
    };
  },
  filters: {
    number(value) {
      const rounded = Math.round(value * 100) / 100;
      return rounded
        .toString()
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    point(value) {
      return value[0] + ", " + value[1];
    }
  },
  computed: {
    formatPoint() {
      return this.data;
    },
    areaFormat() {
      const rounded = Math.round(this.annotation.area * 100) / 100;
      return rounded
        .toString()
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  },
  methods: {
    pointClick(point) {
      let coords = {
        latitude: point[0],
        longitude: point[1]
      };
      this.centerMap(coords);
    },
    centerMap(coords) {
      this.$root.$emit("centerMap", coords);
    },

    getCentroid(arr) {
      if (arr.length && arr.length > 2) {
        return arr.reduce(
          function(x, y) {
            return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length];
          },
          [0, 0]
        );
      } else {
        return arr;
      }
    },

    getAnnotationCenter(annotation) {
      let center;
      if (annotation.type == "rectangle" || annotation.type == "polygon") {
        center = this.getCentroid(annotation.latlngs);
      }
      if (annotation.type == "circle" || annotation.type == "marker") {
        center = annotation.latlng;
        // console.log(center)
      }
      if (annotation.type == "polyline") {
        // melhorar o centro da polyline, atualmente pega o primeiro ponto
        center = annotation.latlngs[0];
      }

      return center;

      // centerObj = {
      //   latitude: center[0],
      //   longitude: center[1]
      // }

      // this.$root.$emit('centerMap', centerObj)
    },

    centerAnnotation(annotation) {
      let center;
      let centerObj;
      if (annotation.type == "rectangle" || annotation.type == "polygon") {
        center = this.getCentroid(annotation.latlngs);
      }
      if (annotation.type == "circle" || annotation.type == "marker") {
        center = annotation.latlng;
      }
      if (annotation.type == "polyline") {
        // melhorar o centro da polyline, atualmente pega o primeiro ponto
        center = annotation.latlngs[0];
      }

      centerObj = {
        latitude: center[0],
        longitude: center[1]
      };

      this.$root.$emit("centerMap", centerObj);
    }
  }
};
</script>

<style lang="scss" scoped>
.annotation-details {
  .description {
    margin-bottom: 20px;

    .label {
      margin-bottom: 0px;
    }

    .text {
    }
  }

  .color {
    .label {
      display: inline-block;
      margin-right: 5px;
    }
    .text {
      display: inline-block;
      color: white;
      color: white;
      border-radius: 7px;
      padding: 2px;
      font-size: 15px;
    }
  }

  .pointsGroup {
    margin-top: 20px;
    margin-bottom: 20px;

    .header {
      .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        display: inline-block;
      }
      .icon {
        margin-left: 5px;
        color: black;
      }
    }
    .content {
      padding: 0 0px;

      .label {
        font-size: 14px;
      }

      .points {
        ul {
          list-style: none;
          margin-top: 0;
          margin-left: 10px;
        }
      }
      .point {
        font-size: 14px;
        cursor: pointer;

        i {
          margin-right: 3px;
        }
      }
    }
  }

  .centroid,
  .points,
  .radius,
  .area,
  .length,
  .volume {
    margin-bottom: 20px;

    .label {
      display: inline-block;
      margin-right: 5px;
    }

    .text {
      display: inline-block;
    }
  }
}
</style>