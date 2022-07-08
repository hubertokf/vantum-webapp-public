
import {services} from './../api'

const state = {
  markerToolStatus: false,
  polygonToolStatus: false,
  rulerToolStatus: false,
  volumeToolStatus: false,
}

const getters = {
  getMarkerToolStatus: state => state.markerToolStatus,
  getPolygonToolStatus: state => state.polygonToolStatus,
  getRulerToolStatus: state => state.rulerToolStatus,
  getVolumeToolStatus: state => state.volumeToolStatus,
}

const mutations = {
  set_marker_tool_status (state, status) {
    state.markerToolStatus = status
  },
  set_polygon_status (state, status) {
    state.polygonToolStatus = status
  },
  set_ruler_status (state, status) {
    state.rulerToolStatus = status
  },
  set_volume_status (state, status) {
    state.volumeToolStatus = status
  },
}

const actions = {
  setMarkerToolStatus({
    commit, 
    state
  }, status) {
    commit('set_marker_tool_status', status)
  },
  setPolygonToolStatus({
    commit, 
    state
  }, status) {
    commit('set_polygon_status', status)
  },
  setRulerToolStatus({
    commit, 
    state
  }, status) {
    commit('set_ruler_status', status)
  },
  setVolumeToolStatus({
    commit, 
    state
  }, status) {
    commit('set_volume_status', status)
  },
  disableTools({
    commit, 
    state
  }) {
    commit('set_marker_tool_status', false)
    commit('set_polygon_status', false)
    commit('set_ruler_status', false)
    commit('set_volume_status', false)
  }
  
}

export default {
  state,
  getters,
  mutations,
  actions
}
