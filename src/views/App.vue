<template>
  <div class="dashboard">
    <div class="planWarning" v-if="isFreePlan" @click="subscribePlan()">
      Você está utilizando o plano GRATUÍTO, clique aqui para usufruir de todas
      as funcionalidades.
    </div>

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
        ref="map"
      >
        <tile-cache></tile-cache>
        <!-- <draw position="topright" :featureGroup="drawnItems"></draw> -->
        <draw
          position="topright"
          :featureGroup="drawnItems"
          @created="drawCreated"
          @edited="drawEdited"
          @deleted="drawDeleted"
          v-if="showDrawTools"
          :draw="true"
          :edit="true"
        ></draw>

        <draw
          position="topright"
          :featureGroup="drawnItems"
          @created="drawCreated"
          @edited="drawEdited"
          @deleted="drawDeleted"
          v-if="showEditTool"
          :draw="false"
          :edit="true"
        ></draw>

        <v-polygon
          v-for="(polygon, index) in polygons"
          :id="polygon.id"
          @click="annotationClick"
          :latlngs="polygon.latlngs"
          :options="polygon.options"
          :featureGroup="drawnItems"
          :key="'polygon-' + polygon.options.idRef + '-' + annotationKey"
        ></v-polygon>

        <v-polyline
          v-for="(polyline, index) in polylines"
          :id="polyline.id"
          @click="annotationClick"
          :latlngs="polyline.latlngs"
          :options="polyline.options"
          :featureGroup="drawnItems"
          :key="'polyline-' + polyline.options.idRef + '-' + annotationKey"
        ></v-polyline>

        <v-rectangle
          v-for="(rectangle, index) in rectangles"
          :id="rectangle.id"
          @click="annotationClick"
          :latlngs="rectangle.latlngs"
          :options="rectangle.options"
          :featureGroup="drawnItems"
          :key="'rectangle-' + rectangle.options.idRef + '-' + annotationKey"
        ></v-rectangle>

        <v-circle
          v-for="(circle, index) in circles"
          @click="annotationClick"
          :latlng="circle.latlng"
          :options="circle.options"
          :featureGroup="drawnItems"
          :id="circle.id"
          :key="'circle-' + circle.options.idRef + '-' + annotationKey"
        ></v-circle>

        <v-marker
          v-for="(marker, index) in markers"
          @click="annotationClick"
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
          :opacity="parseFloat(orthomosaic.opacity)"
        />
      </l-map>
    </div>
    <sidenav></sidenav>
  </div>
</template>

<script>
import Sidenav from "@/components/app/Sidenav";
import {
  LMap,
  LImageOverlay,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LControlLayers,
  LPolyline,
  LPolygon,
  LFeatureGroup,
  LControl
} from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "leaflet-mouse-position";
import "leaflet-toolbar/dist/leaflet.toolbar.css";
import "leaflet-toolbar/dist/leaflet.toolbar.js";
import Draw from "./Draw";
import Polygon from "../components/app/drawing/Polygon";
import Polyline from "../components/app/drawing/Polyline";
import Rectangle from "../components/app/drawing/Rectangle";
import Circle from "../components/app/drawing/Circle";
import Marker from "../components/app/drawing/Marker";
// import LDrawToolbar from '../components/vue2-leaflet-draw-toolbar/src/App'
import UpdateProfileModal from "../components/app/UpdateProfileModal";
import sideBySide from "leaflet-side-by-side";
import TileLayerCache from "../components/app/TileLayerCache";

export default {
  name: "dashboard",
  // mixins: [sideBySide],
  data() {
    return {
      search: "",
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
        zoomControl: false
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
      if (coords.altitude) {
        this.$refs.map.setZoom(coords.altitude);
      }
      this.$refs.map.setCenter([coords.latitude, coords.longitude]);
    });

    this.$root.$on("fit-bounds", coords => {
      // let markers = coords.map(coord => L.marker(coord));
      // console.log(coords);

      // var group = L.featureGroup(coords).addTo(this.$refs.map.mapObject);
      this.$refs.map.mapObject.fitBounds(coords);
      // this.$refs.map.panTo(coords[0]);
    });

    this.$root.$on("updateOpacity", ref => {
      var index = this.orthomosaics.findIndex(
        orthomosaic => orthomosaic.id === ref.id
      );
      this.orthomosaics[index].opacity = ref.opacity;
      var o = this.orthomosaics[index];
      this.orthomosaics.splice(index, 1);
      this.orthomosaics.push(o);
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

    // this.$root.$on('clear-tiles', ()=>{
    //   this.tiles = [];
    //   this.tilesIndex = 0;
    // });

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

    this.$root.$on("start-slide-comparison", () => {
      this.compareMosaics();
    });

    this.$root.$on("stop-slide-comparison", () => {
      this.removeCompareMosaics();
    });
    this.$root.$on("projectMinBound", (northWest, z, resolve) => {
      let map = this.$refs.map.mapObject;
      const min = map
        .project(northWest, z)
        .divideBy(256)
        .floor();
      resolve(min);
    });
    this.$root.$on("projectMaxBound", (southEast, z, resolve) => {
      let map = this.$refs.map.mapObject;
      const max = map
        .project(southEast, z)
        .divideBy(256)
        .floor();
      resolve(max);
    });
    this.$root.$on('add-marker', (marker)=>{
      this.markerDrawer.enable();
    });
    this.$root.$on('add-simpleshape', (marker)=>{
      this.simpleShapeDrawer.enable();
    });
    this.$root.$on('add-polyline', (polyline)=>{
      this.polylineDrawer.enable();
    });
    this.$root.$on('add-polygon', (polyline)=>{
      this.polygonDrawer.enable();
    });
    this.$root.$on('add-rectangle', (polyline)=>{
      this.rectangleDrawer.enable();
    });
    this.$root.$on('add-circle', (polyline)=>{
      this.circleDrawer.enable();
    });
  },
  methods: {
    compareMosaics() {
      let obj1 = this.$refs["tilelayer-0"][0].mapObject;
      let obj2 = this.$refs["tilelayer-1"][0].mapObject;

      this.sideCompareControl = L.control.sideBySide(obj1, obj2);
      this.sideCompareControl.addTo(this.$refs.map.mapObject);
    },
    removeCompareMosaics() {
      if (this.sideCompareControl != null) {
        this.$refs.map.mapObject.removeControl(this.sideCompareControl);
        this.sideCompareControl = null;
      }
    },
    subscribePlan() {
      this.compareMosaics();
      // this.$router.push({name: 'UserConfig'})
    },
    annotationClick(e) {
      let layer = e.target;
      let id = layer.options.idRef;

      // if (layer instanceof L.Polygon){
      //   console.log("clicou Polygon", layer, id)
      // }else if (layer instanceof L.Circle){
      //   console.log("clicou Circle", layer, id)
      // }else if (layer instanceof L.Marker){
      //   console.log("clicou Marker", layer, id)
      // }else if (layer instanceof L.Polyline){
      //   console.log("clicou Polyline", layer, id)
      // }

      this.$router.push({ name: "Annotation", params: { annotationId: id } });
    },
    drawCreated(e) {
      const layer = e.layer,
        type = e.layerType;

      // console.log('CREATED',e)

      let annotation = {
        type: type,
        options: {},
        owner: this.$store.state.auth.user.id,
        plan: null,
        project: null
      };

      if (this.$store.getters.getCurrentPlan != null) {
        annotation.plan = this.$store.getters.getCurrentPlan._id;
      } else {
        if (this.$store.getters.getCurrentProject != null) {
          annotation.project = this.$store.getters.getCurrentProject._id;
        }
      }

      // geometrys = e.layer._latlngs.map(g => ({latitude: g.lat, longitude: g.lng }))
      if (type == "circle") {
        annotation.latlng = [e.layer._latlng.lat, e.layer._latlng.lng];
        annotation.options.radius = e.layer.getRadius();
        annotation.name = "Circulo";
        var radius = layer.getRadius();
        annotation.area = (Math.PI * (radius * radius)).toFixed(2);
      } else if (type == "marker") {
        annotation.latlng = [e.layer._latlng.lat, e.layer._latlng.lng];
        annotation.name = "Marcador";
      } else if (type == "polyline") {
        annotation.latlngs = e.layer._latlngs.map(g => [g.lat, g.lng]);
        annotation.name = "Linha";
        var tempLatLng = null;
        var totalDistance = 0.0;
        e.layer._latlngs.forEach(latlng => {
          if (tempLatLng == null) {
            tempLatLng = latlng;
            return;
          }

          totalDistance += tempLatLng.distanceTo(latlng);
          tempLatLng = latlng;
        });
        annotation.length = totalDistance.toFixed(2);
      } else {
        annotation.latlngs = e.layer._latlngs[0].map(g => [g.lat, g.lng]);
        annotation.name = "Polígono";

        let area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        annotation.area = area.toFixed(2);
      }

      this.$store.dispatch("postAnnotation", annotation).then(annotation => {
        this.$root.$emit("add-annotation", annotation);
      });
    },

    drawEdited(e) {
      const layer = e.layer,
        type = e.layerType;

      // console.log('EDITED',e)
      let _this = this;

      e.layers.eachLayer(function(layer) {
        // console.log(layer)
        // console.log(layer.get('_latlngs'))

        let annotation = {
          options: {}
        };

        if (layer instanceof L.Polygon) {
          annotation.latlngs = layer._latlngs[0].map(g => [g.lat, g.lng]);

          let area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
          annotation.area = area.toFixed(2);
        } else if (layer instanceof L.Circle) {
          annotation.latlngs = [layer._latlng.lat, layer._latlng.lng];
          annotation.options.radius = layer.getRadius();
          let radius = layer.getRadius();
          annotation.area = (Math.PI * (radius * radius)).toFixed(2);
        } else if (layer instanceof L.Marker) {
          annotation.latlngs = [layer._latlng.lat, layer._latlng.lng];
        } else if (layer instanceof L.Polyline) {
          annotation.latlngs = layer._latlngs.map(g => [g.lat, g.lng]);
          let tempLatLng = null;
          let totalDistance = 0.0;
          e.layer._latlngs.forEach(latlng => {
            if (tempLatLng == null) {
              tempLatLng = latlng;
              return;
            }

            totalDistance += tempLatLng.distanceTo(latlng);
            tempLatLng = latlng;
          });
          annotation.length = totalDistance.toFixed(2);
        }

        annotation.id = layer.options.idRef;

        _this.$store.dispatch("editAnnotation", annotation).then(annotation => {
          _this.$root.$emit("edit-annotation", annotation);
        });
      });
    },

    drawDeleted(e) {
      // console.log('DELETED',e)

      let _this = this;

      e.layers.eachLayer(function(layer) {
        // console.log(layer)

        let id = layer.options.idRef;

        _this.$store.dispatch("deleteAnnotation", id).then(annotation => {
          _this.$root.$emit("delete-annotation", id);
        });
      });
    },
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
    getLoggedUser() {
      return this.$store.getters.getUser;
    },
    isFreePlan() {
      if (
        !this.$store.getters.getUser.subscriptionPlan ||
        this.$store.getters.getUser.subscriptionPlan == "free" ||
        this.$store.getters.getUser.subscriptionPlan == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    showDrawTools() {
      if (this.$route.name == "Plan") {
        return true;
      }
      if (this.$route.name == "Project") {
        return true;
      }
      return false;
    },
    showEditTool() {
      if (this.$route.name == "Annotation") {
        return true;
      }
      return false;
    },
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
    Sidenav,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LImageOverlay,
    LTooltip,
    LPolyline,
    LControlLayers,
    LFeatureGroup,
    LPolygon,
    draw: Draw,
    "v-polygon": Polygon,
    "v-polyline": Polyline,
    "v-rectangle": Rectangle,
    "v-circle": Circle,
    "v-marker": Marker,
    "tile-cache": TileLayerCache
    // 'l-draw-toolbar': LDrawToolbar
  },
  mounted() {
    // ask to update profile
    // console.log(this.getLoggedUser);
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      this.polygonDrawer = new window.L.Draw.Polygon(map);
      this.polylineDrawer = new window.L.Draw.Polyline(map);
      this.markerDrawer = new window.L.Draw.Marker(map);
      this.rectangleDrawer = new window.L.Draw.Rectangle(map);
      this.circleDrawer = new window.L.Draw.Circle(map);
      this.simpleShapeDrawer = new window.L.Draw.SimpleShape(map);
    })
    
    if (
      !this.getLoggedUser.phone ||
      this.getLoggedUser.phone == "" ||
      this.getLoggedUser.phone == {} ||
      !this.getLoggedUser.address ||
      this.getLoggedUser.address == "" ||
      this.getLoggedUser.address == {}
    ) {
      this.$buefy.modal.open({
        parent: this,
        component: UpdateProfileModal,
        hasModalCard: true
      });
    }
    // if (this.getLoggedUser.phone

    this.drawnItems = new L.FeatureGroup();

    var map = this.$refs.map.mapObject;

    L.control.mousePosition().addTo(map);

    map.addLayer(this.drawnItems);

    // function onLocationFound(e) {
    //   var radius = e.accuracy / 2;
    //   L.marker(e.latlng).addTo(map)
    //     .bindPopup("You are within " + radius + " meters from this point").openPopup();
    //   // L.circle(e.latlng, radius).addTo(map);
    // }

    // map.on('locationfound', onLocationFound);
    // map.locate({watch: true});

    // this.$watchLocation({
    //   enableHighAccuracy: true, //defaults to false
    //   timeout: Infinity, //defaults to Infinity
    //   maximumAge: 0 //defaults to 0
    // })
    // .then(coordinates => {
    //   console.log(coordinates);
    //   // this.$root.$emit('centerMap', {
    //   //   altitude: 12,
    //   //   latitude: coordinates.lat,
    //   //   longitude: coordinates.lng
    //   // })
    // })

    var userMarkerIcon = L.icon({
      iconUrl: require("@/assets/img/positionMarker2.svg"),

      iconSize: [20, 20], // size of the icon
      iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    map
      .locate({
        watch: true,
        enableHighAccuracy: true
      })
      .on("locationfound", e => {
        if (!this.usermarker) {
          this.usermarker = new L.marker(e.latlng, { icon: userMarkerIcon })
            .bindPopup("Você está aqui")
            .addTo(map);
        } else {
          this.usermarker.setLatLng(e.latlng);
        }
      })
      .on("locationerror", error => {
        if (this.usermarker) {
          map.removeLayer(this.usermarker);
          this.usermarker = null;
        }
      });
  }
};
</script>

<style lang="scss">
.dashboard {
  height: 100vh;
  overflow-y: hidden;

  .planWarning {
    font-size: 13px;
    color: #666;
    padding: 5px;
    text-align: center;
    background-color: #fcd12a;
    font-weight: bold;
    z-index: 1000;
    position: absolute;
    text-align: center;
    width: 100%;
    cursor: pointer;
  }

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

  .leaflet-popup-toolbar {
    width: 94px !important;
  }

  .leaflet-control-mouseposition {
    background-color: rgba(255, 255, 255, 0.6);
    padding: 2px 6px;
    width: 145px;
  }

  .leaflet-top .leaflet-control {
    margin-top: 55px;
  }
}
</style>
