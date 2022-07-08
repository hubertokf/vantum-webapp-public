<template>
  <div style="display: none;">
    <!-- <slot v-if="ready" /> -->
  </div>
</template>

<script>

import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import 'leaflet-toolbar/dist/leaflet.toolbar.css'
import 'leaflet-toolbar/dist/leaflet.toolbar.js'

export default {
  props: {
    featureGroup: {
      type: Object,
    },
    position: {
      type: String,
    },
  },

  data() {
    return {
      map: null,
      drawControl: null
    }
  },

  beforeDestroy() {
    this.map.removeControl(this.drawControl)
  },

  mounted() {
    let parent = this.findRealParent(this)
    this.map = parent.mapObject
    
    this.$nextTick(() => {
      this.drawControl = new L.Control.Draw({
        position: this.position,
        draw: {
          polyline: {
            allowIntersection: false,
            showArea: true
          },
          polygon: true,
          rectangle: true,
          circle: true,
          marker: true,
          circlemarker: false,
          // simpleshape: true
        },
        edit: {
          featureGroup: this.featureGroup,
          remove: false
        },
        buttons: {
          polygon: 'Draw an awesome polygon'
        }
        
      });

      L.drawLocal.draw.toolbar.actions.text = 'Cancelar';
      L.drawLocal.draw.toolbar.actions.title = 'Cancelar desenho';

      L.drawLocal.draw.toolbar.finish.text = 'Finalizar';
      L.drawLocal.draw.toolbar.finish.title = 'Finalizar desenho';

      L.drawLocal.draw.toolbar.undo.text = 'Apagar último ponto';
      L.drawLocal.draw.toolbar.undo.title = 'Apagar último ponto desenhado';
      
      L.drawLocal.draw.toolbar.buttons.polyline = 'Linha';
      L.drawLocal.draw.toolbar.buttons.polygon = 'Polígono';
      L.drawLocal.draw.toolbar.buttons.rectangle = 'Retangulo';
      L.drawLocal.draw.toolbar.buttons.circle = 'Círculo';
      L.drawLocal.draw.toolbar.buttons.circlemarker = 'Marcador circular';
      L.drawLocal.draw.toolbar.buttons.marker = 'Marcador';

      L.drawLocal.draw.handlers.circle.radius = 'Raio';
      L.drawLocal.draw.handlers.polyline.error = '"<strong>Erro:</strong> as linha não podem cruzar!"';

      L.drawLocal.draw.handlers.polyline.tooltip.start = 'Clique nos pontos para desenhar';
      L.drawLocal.draw.handlers.polygon.tooltip.start = 'Clique nos pontos para desenha';
      L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Clique e arraste para desenhar';
      L.drawLocal.draw.handlers.circle.tooltip.start = 'Clique e arraste para desenhar';
      L.drawLocal.draw.handlers.marker.tooltip.start = 'Clique no ponto';

      L.drawLocal.edit.handlers.edit.tooltip.text = "Arraste os marcadores para editar o desenho."
      L.drawLocal.edit.handlers.edit.tooltip.subtext = "Clique em cancelar para desfazer as mudanças"
      L.drawLocal.edit.handlers.remove.tooltip.text = "Clique no desenho para remover"
      L.drawLocal.edit.toolbar.actions.cancel.text = "Cancelar"
      L.drawLocal.edit.toolbar.actions.cancel.title = "Cancelar Edição, discarta todas mudanças"
      L.drawLocal.edit.toolbar.actions.clearAll.text = "Limpar tudo"
      L.drawLocal.edit.toolbar.actions.clearAll.title = "Limpar todas as layers"
      L.drawLocal.edit.toolbar.actions.save.text = "Salvar"
      L.drawLocal.edit.toolbar.actions.save.title = "Salvar mudanças"
      L.drawLocal.edit.toolbar.buttons.edit = "Editar desenhos"
      L.drawLocal.edit.toolbar.buttons.editDisabled = "Nenhum desenho para editar"
      L.drawLocal.edit.toolbar.buttons.remove = "Remover desenhos"
      L.drawLocal.edit.toolbar.buttons.removeDisabled = "Nenhum desenho para remover"



      parent.mapObject.addControl(this.drawControl);

      parent.mapObject.on('draw:created', (e) => {
        this.$emit('created', e)
      });

      parent.mapObject.on('draw:deleted', (e) => {
        this.$emit('deleted', e)
      })

      parent.mapObject.on('draw:edited', (e) => {
        this.$emit('edited', e)
      });
    })
  },
  methods: {
    findRealParent: (firstVueParent) => {
      let found = false;
      while (!found) {
        if (firstVueParent.mapObject === undefined) {
          firstVueParent = firstVueParent.$parent;
        } else {
          found = true;
        }
      }
      return firstVueParent;
    }
  },
};
</script>

<style lang="scss" scoped>

</style>