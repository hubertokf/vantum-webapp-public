<template>
  <div class="search-box">
    <b-input
      class="searchInput"
      @input="changed"
      placeholder="Buscar..."
      type="search"
      v-model="search"
      icon="magnify"
      name="search"
    >
    </b-input>
    <!-- <b-dropdown aria-role="is-pulled-right">
      <div class="orderBy" slot="trigger">
        <b-icon icon="filter"></b-icon>
      </div>

      <b-dropdown-item aria-role="listitem">Action</b-dropdown-item>
      <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
      <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
    </b-dropdown> -->
  </div>
</template>

<script>
export default {
  name: "search-box",
  data() {
    return {
      search: ""
    };
  },
  methods: {
    changed() {
      this.$store.dispatch("search", this.search);
    }
  }
};
</script>

<style lang="scss">
.search-box {
  background-color: var(--color-darker);
  // -webkit-box-shadow: 2px 10px rgba(0, 0, 0, 0.4);
  // box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.4);

  .orderBy {
    color: var(--color-dark);
  }

  .searchInput {
    margin: 6px 10px 10px 10px;
    // padding-bottom: 15px;

    input {
      border: 0;
      box-shadow: none;
      border-bottom: 2px solid var(--color-dark);
      background: inherit;
      padding-bottom: 0px;
      color: white;

      &::-webkit-search-cancel-button {
        color: var(--color-light);
      }

      &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: var(--color-shadow);
        opacity: 1; /* Firefox */
      }

      span {
        .icon {
          color: var(--color-dark) !important;
        }
      }

      &:focus {
        border: 0;
        border-bottom: 2px solid var(--color-dark);
      }
    }
  }
}
</style>
