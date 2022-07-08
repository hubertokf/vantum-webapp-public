<template>
  <div class="annotations">
    <div class="annotation"
      v-for="annotation in annotations"
      @click="selectAnnotation(annotation)"
      :class="{ 'active': annotation.selected == true}"
      :style="annotation.selected == true ? '' : ''"
      :key="annotation.id"
    >
      <div class="icon" :style="''">
        <i class="fas" :class="annotationClassIcon(annotation.type)"></i>
      </div>
      <div class="name">{{annotation.name}}</div>
      <div class="data"></div>
      <div class="deleteButton" v-on:click.stop="removeAnnotation(annotation)">
        <i class="fas fa-trash"></i>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "annotations",
    props: {
      annotationList: {
        type: Array,
      },
    },
    data() {
      return {
        annotations: null
      }
    },
    mounted () {
      this.annotations = this.annotationList;
    },
    created () {
      this.$root.$emit('clear-annotations')        
      this.annotations = this.annotationList

      if(this.annotations != null){

        this.annotations.forEach(annotation => {
          this.$root.$emit('add-annotation', annotation)        
        });
  
        this.$root.$on('delete-annotation', (annotationID)=>{
          var annotationIndex = this.annotations.findIndex(annotation => annotation.id === annotationID)
  
          if (annotationIndex != -1){
            this.annotations.splice(annotationIndex, 1)
          }
        });
  
        this.$root.$on('add-annotation', (annotation)=>{
          this.annotations.push(annotation)
        });

        this.$root.$on('clear-annotations', ()=>{
          this.annotations = []
        });
      }

    },
    computed: {
      getAnnotations() {
        return this.$store.getters.getAnnotations 
      }
    },
    methods: {
      centerMap(coords) {
        this.$root.$emit('centerMap', coords)
      },
      update(val) {
        this.value = Number(val);
      },
      style_bgcolor(hex){
        return "background-color: " + hex
      },
      annotationClassIcon(type){
        switch (type) {
          case "marker":
            return "fa-map-marker-alt";
          case "polygon":
            return "fa-draw-polygon";
          case "polyline":
            return "fa-ruler";
          case "rectangle":
            return "fa-square";
          case "circle":
            return "fa-circle";
        }
      },
      selectTool(tool){
        tool.selected = !tool.selected
      },
      selectAnnotation(annotation){
        // annotation.selected = !annotation.selected
        this.$router.push({ name: 'Annotation', params: { annotationId: annotation.id }})
      },
      removeAnnotation(annotation){
        // annotation.selected = !annotation.selected
        this.$root.$emit('delete-annotation', annotation.id)
        this.$store.dispatch('deleteAnnotation', annotation.id)
      },
    },
    
  }
</script>

<style lang="scss" scoped>
.annotations{
  max-height: 150px;
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
  
  .annotation{
    margin-bottom: 5px;
    height: 30px;
    border-radius: 15px;
    cursor: pointer;
    background: none;
    color: black;
    transition: all .2s linear;
    background-color: var(--color-dark);

    &.active{
      color: #F1F1F1;
      background-position: left bottom !important;
    }

    .icon{
      border-radius: 100%;
      color: #F1f1f1;
      height: 30px;
      width: 30px;
      margin-left: 4px;
    }
    
    .name{
      margin-left: 5px;
      display: inline-block;
      color: white;
    }

    .data{
      display: inline-block;
    }
    
    .deleteButton{
      display: inline-block;
      float: right;
      margin: 3px 15px;
      // margin: 0 10px;
      // position: absolute;
      // right: 0;
      cursor: pointer;
      color: white;
      
      &:hover{
        color: red;
      }
    }
  }

}
</style>