<template>
  <div class="appMap">
    <l-map
      :key="componentKey"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      :max-zoom="maxZoom"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
      @click="mapClick"
      ref="mapView"
    >
      <tile-cache></tile-cache>
      <v-polygon
        v-for="(polygon, index) in polygons"
        :id="polygon.id"
        :latlngs="polygon.latlngs"
        :options="polygon.options"
        :featureGroup="drawnItems"
        :key="'polygon-' + polygon.options.idRef + '-' + annotationKey"
      ></v-polygon>

      <v-polyline
        v-for="(polyline, index) in polylines"
        :id="polyline.id"
        :latlngs="polyline.latlngs"
        :options="polyline.options"
        :featureGroup="drawnItems"
        :key="'polyline-' + polyline.options.idRef + '-' + annotationKey"
      ></v-polyline>

      <v-rectangle
        v-for="(rectangle, index) in rectangles"
        :id="rectangle.id"
        :latlngs="rectangle.latlngs"
        :options="rectangle.options"
        :featureGroup="drawnItems"
        :key="'rectangle-' + rectangle.options.idRef + '-' + annotationKey"
      ></v-rectangle>

      <v-circle
        v-for="(circle, index) in circles"
        :latlng="circle.latlng"
        :options="circle.options"
        :featureGroup="drawnItems"
        :id="circle.id"
        :key="'circle-' + circle.options.idRef + '-' + annotationKey"
      ></v-circle>

      <v-marker
        v-for="(marker, index) in markers"
        :id="marker.id"
        :latlng="marker.latlng"
        :options="marker.options"
        :featureGroup="drawnItems"
        :key="'marker-' + marker.options.idRef + '-' + annotationKey"
      ></v-marker>

      <l-tile-layer :url="url" :options="{ maxZoom: 22 }" />
      <l-tile-layer
        v-for="(orthomosaic, index) in orthomosaics"
        :url="orthomosaic.tilesUrl"
        :tms="true"
        :key="orthomosaic.id"
        :ref="'tilelayer-' + index"
        :options="{
            orthomosaicId: orthomosaic.id,
            maxZoom: 22,
            maxNativeZoom: 20,
            bounds: getPlanGeometry,
            useCache: true,
            crossOrigin: true
          }"
      />
      <!-- <l-tile-layer
        v-if="orthomosaic"
        :url="orthomosaic.tilesUrl"
        :tms="true"
        :key="orthomosaic.id"
        :ref="'tilelayermap'"
        :options="{
            orthomosaicId: orthomosaic.id,
            maxZoom: 22,
            maxNativeZoom: 20,
            bounds: getPlanGeometry,
            useCache: true,
            crossOrigin: true
          }"
      />-->
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import Polygon from "@/components/app/drawing/Polygon";
import Polyline from "@/components/app/drawing/Polyline";
import Rectangle from "@/components/app/drawing/Rectangle";
import Circle from "@/components/app/drawing/Circle";
import Marker from "@/components/app/drawing/Marker";
import TileLayerCache from "@/components/app/TileLayerCache";

export default {
  name: "dashboard",
  // mixins: [sideBySide],
  props: {
    orthomosaic: {
      type: Object,
      default: null
    },

    plan: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      op: 1,
      blakey: 0,
      componentKey: 0,
      annotationKey: 0,
      maxZoom: 22,
      projects: this.$store.state.app.projects,
      zoom: 4, // não usado, ver computed mapZoom
      center: L.latLng(-13.0618256, -63.5501318), // não usado, ver computed mapCenter
      url: "http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      tileUrl: "http://localhost:1337/odm_orthophoto/{z}/{x}/{y}.png",
      drawnItems: null,

      // bounds: [[-31.8870864349, -52.6375153957], [-31.875783158, -52.6497473174]],
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false,
        attributionControl: false
      },
      orthomosaics: [],
      markers: [],
      polylines: [],
      polygons: [],
      rectangles: [],
      circles: [],
      usermarker: null,
      sideCompareControl: null
    };
  },
  created() {
    this.$root.$on("map-rerender", () => {
      this.componentKey++;
    });
    this.$root.$on("centerMap", coords => {
      if (this.$refs.mapView) {
        if (coords.altitude) {
          this.$refs.mapView.setZoom(coords.altitude);
        }
        this.$refs.mapView.setCenter([coords.latitude, coords.longitude]);
      }
    });
    this.$root.$on("fit-bounds", coords => {
      // let markers = coords.map(coord => L.marker(coord));
      // console.log(coords);
      // var group = L.featureGroup(coords).addTo(this.$refs.mapView.mapView);
      if (this.$refs.mapView) {
        this.$refs.mapView.mapObject.fitBounds(coords);
      // this.$refs.mapView.panTo(coords[0]);
      }
    });
    this.$root.$on("add-orthomosaic", ortho => {
      var index = this.orthomosaics.findIndex(
        orthomosaic => orthomosaic.id === ortho.id
      );
      if (index == -1) {
        this.orthomosaics.push(ortho);
      }
    });
    this.$root.$on("remove-orthomosaic", orthomosaicID => {
      var index = this.orthomosaics.findIndex(
        orthomosaic => orthomosaic.id === orthomosaicID
      );
      if (index != -1) {
        this.orthomosaics.splice(index, 1);
      }
    });
    this.$root.$on("clear-orthomosaics", () => {
      this.$store.dispatch("clearOrthomosaics");
      this.orthomosaics = [];
    });
    this.$root.$on("activateOrthomosaics", ref => {
      var index = this.orthomosaics.findIndex(
        orthomosaic => orthomosaic.id === ref.id
      );
      if (index == -1) {
        this.orthomosaics.push(ref);
      } else {
        // if (ref.selected == this.orthomosaics[index].selected){
        this.orthomosaics.splice(index, 1);
        // }else{
        //   this.orthomosaics[index] = ref
        //   console.log("outro")
        // }
      }
    });
    this.$root.$on("clear-tiles", () => {
      this.tiles = [];
      this.tilesIndex = 0;
    });
    this.$root.$on("clear-annotations", () => {
      this.polygons = [];
      this.polylines = [];
      this.markers = [];
      this.rectangles = [];
      this.circles = [];
    });

    this.$root.$on("add-annotation", annotation => {
      if (annotation.type == "polygon") {
        this.polygons.push(annotation);
      }
      if (annotation.type == "polyline") {
        this.polylines.push(annotation);
      }
      if (annotation.type == "marker") {
        this.markers.push(annotation);
      }
      if (annotation.type == "rectangle") {
        this.rectangles.push(annotation);
      }
      if (annotation.type == "circle") {
        this.circles.push(annotation);
      }
    });

    this.$root.$on("edit-annotation", annotation => {
      this.annotationKey = this.annotationKey + 1;
      var polygonsIndex = this.polygons.findIndex(
        objAnnotation => objAnnotation.id === annotation.id
      );
      var polylinesIndex = this.polylines.findIndex(
        objAnnotation => objAnnotation.id === annotation.id
      );
      var markersIndex = this.markers.findIndex(
        objAnnotation => objAnnotation.id === annotation.id
      );
      var rectanglesIndex = this.rectangles.findIndex(
        objAnnotation => objAnnotation.id === annotation.id
      );
      var circlesIndex = this.circles.findIndex(
        objAnnotation => objAnnotation.id === annotation.id
      );

      if (polygonsIndex != -1) {
        this.polygons.splice(polygonsIndex, 1);
        this.polygons.push(annotation);
      }
      if (polylinesIndex != -1) {
        this.polylines.splice(polylinesIndex, 1);
        this.polylines.push(annotation);
      }
      if (markersIndex != -1) {
        this.markers.splice(markersIndex, 1);
        this.markers.push(annotation);
      }
      if (rectanglesIndex != -1) {
        this.rectangles.splice(rectanglesIndex, 1);
        this.rectangles.push(annotation);
      }
      if (circlesIndex != -1) {
        this.circles.splice(circlesIndex, 1);
        this.circles.push(annotation);
      }
    });

    this.$root.$on("delete-annotation", annotationID => {
      var polygonsIndex = this.polygons.findIndex(
        annotation => annotation.id === annotationID
      );
      var polylinesIndex = this.polylines.findIndex(
        annotation => annotation.id === annotationID
      );
      var markersIndex = this.markers.findIndex(
        annotation => annotation.id === annotationID
      );
      var rectanglesIndex = this.rectangles.findIndex(
        annotation => annotation.id === annotationID
      );
      var circlesIndex = this.circles.findIndex(
        annotation => annotation.id === annotationID
      );

      if (polygonsIndex != -1) {
        this.polygons.splice(polygonsIndex, 1);
      }
      if (polylinesIndex != -1) {
        this.polylines.splice(polylinesIndex, 1);
      }
      if (markersIndex != -1) {
        this.markers.splice(markersIndex, 1);
      }
      if (rectanglesIndex != -1) {
        this.rectangles.splice(rectanglesIndex, 1);
      }
      if (circlesIndex != -1) {
        this.circles.splice(circlesIndex, 1);
      }
    });
  },
  methods: {
    mapClick() {},
    zoomUpdate(zoom) {
      // this.currentZoom = zoom;
    },
    centerUpdate(center) {
      // this.currentCenter = center;
    },
    getOrthoBounds(ortho) {
      if (ortho) {
        if (ortho.bounds && ortho.bounds.length > 0) {
          return ortho.bounds;
        } else if (ortho.geometrys && ortho.geometrys.length > 0) {
          return ortho.geometrys.map(a => [a.latitude, a.longitude]);
        } else {
          return null;
        }
      }
    }
  },
  computed: {
    computedOrthomosaics() {
      return this.orthomosaics;
      // return this.$store.getters.getOrthomosaics
    },
    computedAnnotations() {
      // return this.annotations
      return this.annotations;
    },
    getPlanGeometry() {
      if (
        this.$store.getters.getCurrentPlan != null &&
        this.$store.getters.getCurrentPlan.bounds &&
        this.$store.getters.getCurrentPlan.bounds.length > 0
      ) {
        var teste = this.$store.getters.getCurrentPlan.bounds;
        // let result = teste.map(a => [a.latitude, a.longitude]);

        return teste;
      } else {
        return null;
      }
    }
  },
  components: {
    LMap,
    LTileLayer,
    "v-polygon": Polygon,
    "v-polyline": Polyline,
    "v-rectangle": Rectangle,
    "v-circle": Circle,
    "v-marker": Marker,
    "tile-cache": TileLayerCache
  },
  watch: {
    orthomosaic(newValue, oldValue) {
      if (newValue.bounds) {
        map.fitBounds(newValue.bounds);
      } else {
        let coords = {
          latitude: newValue.image.location.latitude,
          longitude: newValue.image.location.latitude,
          altitude: 12
        };

        map.setZoom(coords.altitude);
        map.setCenter([coords.latitude, coords.longitude]);
      }
    }
  },
  mounted() {
    var map = this.$refs.mapView.mapObject;
    this.drawnItems = new L.FeatureGroup();
    map.addLayer(this.drawnItems);
  }
};
</script>

<style lang="scss">
.appMap {
  height: 100%;
  width: 100%;

  .vue2leaflet-map {
    height: 100%;
    width: 100%;

    .leaflet-sbs {
      width: 0;
    }
  }
}
</style>
