<template>
  <div style="display: none;">
  </div>
</template>

<script>

export default {
  name: 'v-marker',
  props: {
    latlng: {
      type: Array,
    },
    options: {
      type: Object,
    },
    featureGroup: {
      type: Object,
    },
    id: {
      type: String,
    }
  },
  data() {
    return {
      layer: {}
    }
  },
  
  beforeDestroy() {
    this.featureGroup.removeLayer(this.layer)
  },
  
  mounted() {

    this.$nextTick(() => {
      let _this = this
      
      this.options.idRef = this.id
      let latlngobj = {lat: this.latlng[0], lng: this.latlng[1]}

      this.layer = L.marker(latlngobj, this.options)
      this.featureGroup.addLayer(this.layer)
      
      this.layer.on('click', function(e) { 
        _this.$emit('click', e)
      })
    })
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>

</style>