<template>
  <div class="listSelector">
    <b-tooltip
      type="is-white"
      label="Exemplos"
      position="is-right"
      v-if="company && company.slug == 'vantum'"
    >
      <router-link :to="{ name: 'ExampleList'}" class="selector vantum-logo">
        <img src="../../assets/img/Simbolo_branco.png" />
      </router-link>
    </b-tooltip>

    <b-tooltip type="is-white" label="Projetos" position="is-right">
      <router-link :to="{ name: 'ProjectList'}" class="selector">
        <i class="fas fa-map-marker-alt"></i>
        <div class="counter" v-if="counters.project">{{ counters.project }}</div>
      </router-link>
    </b-tooltip>

    <b-tooltip type="is-white" label="Mapas" position="is-right">
      <router-link :to="{ name: 'PlanList'}" class="selector">
        <i class="fas fa-map"></i>
        <div class="counter" v-if="counters.plan">{{ counters.plan }}</div>
      </router-link>
    </b-tooltip>

    <b-tooltip type="is-white" label="Albums" position="is-right">
      <router-link :to="{ name: 'AlbumList'}" class="selector">
        <i class="fas fa-images"></i>
        <div class="counter" v-if="counters.album">{{ counters.album }}</div>
      </router-link>
    </b-tooltip>

    <b-tooltip type="is-white" label="Compartilhamento" position="is-right">
      <router-link :to="{ name: 'SharingList'}" class="selector">
        <i class="fas fa-share-alt"></i>
        <div class="counter" v-if="counters.share">{{ counters.share }}</div>
      </router-link>
    </b-tooltip>

    <!-- <b-tooltip type="is-white" label="Clientes" position="is-right">
      <router-link :to="{ name: 'CustomersList'}" class="selector">
        <i class="fas fa-users"></i>
        <div class="counter" v-if="counters.customers">{{ counters.customers }}</div>
      </router-link>
    </b-tooltip>-->
  </div>
</template>

<script>
export default {
  props: {
    counters: {
      type: Object,
      default: () => {
        return {
          share: 0,
          album: 0,
          project: 0,
          plan: 0,
          customers: 0
        };
      }
    }
  },
  computed: {
    company() {
      return this.$store.getters.getCurrentCompany;
    }
  }
};
</script>

<style lang="scss" scoped>
.listSelector {
  display: inline-block;
  width: 60px;
  height: 100%;
  background-color: var(--color-darker);
  flex-shrink: 0;
  z-index: 1;

  -webkit-box-shadow: 1px 10px 10px rgba(0, 0, 0, 0.16);
  box-shadow: 1px 10px 10px rgba(0, 0, 0, 0.16);

  .vantum-logo {
    padding-top: 12px;
    img {
      height: 35px;
    }
  }

  .tooltip {
    width: inherit;
  }

  .selector {
    display: block;
    height: 60px;
    width: 60px;
    text-align: center;
    font-size: 24px;
    color: #f5f5f5;
    border-bottom: 1px solid var(--color-darkerer);
    -webkit-box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.16);
    box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.16);
    position: relative;

    &.router-link-active {
      background-color: var(--color-dark);
      color: var(--color-lighter);
    }

    i {
      line-height: 60px;
      text-align: center;
      width: 100%;
    }

    .counter {
      border-radius: 50%;
      position: absolute;
      right: 10px;
      top: 10px;
      background-color: var(--color-light);
      color: white;
      width: 15px;
      height: 15px;
      font-size: 9px;
      line-height: 15px;
      font-weight: bold;
    }
  }
}
</style>