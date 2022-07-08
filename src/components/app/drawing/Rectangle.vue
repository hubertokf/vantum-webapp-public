<template>
  <div style="display: none;">
  </div>
</template>

<script>

export default {
  name: 'v-rectangle',
  props: {
    latlngs: {
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
      layer: null
    }
  },

  beforeDestroy() {
    this.featureGroup.removeLayer(this.layer)
  },

  mounted() {

    this.$nextTick(() => {
      let _this = this
      this.options.idRef = this.id

      this.layer = L.rectangle(this.latlngs, this.options)
      this.featureGroup.addLayer(this.layer)
      
      // let _this = this
      // this.layer.on('edit', function() {
      //   console.log("editado-"+_this.id)
      // });

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