<template>
  <div class="page">
    <b-loading
      :is-full-page="true"
      :active="isLoadingLists"
      :can-cancel="false"
    ></b-loading>
    <burger-menu ref="burgerMenu">
      <a id="home" href="#">
        <span>Home</span>
      </a>
    </burger-menu>
    <nav-bar ref="nav" :scrollTop="scrollTop">
      <template v-slot:left>
        <div class="burger" @click="openBurgerMenu">
          <b-icon :icon="'menu'" :size="'is-medium'"></b-icon>
        </div>
      </template>

      <template v-slot:title>
        <div class="spacer"></div>
        <div class="companyLogo">
          <img
            v-if="company && company.slug !== 'vantum'"
            :src="company.logo"
          />
          <img v-else src="@/assets/img/logo/logo_hor_w2.svg" />
        </div>
      </template>

      <template v-slot:right>
        <div class="burger" @click="openSearch">
          <b-icon :icon="'magnify'" :size="'is-medium'"></b-icon>
        </div>
      </template>
    </nav-bar>

    <div
      class="list-items"
      id="list-items"
      @scroll="
        a => {
          scrollTop = a.target.scrollTop;
        }
      "
    >

      <ul v-if="!isLoadingLists">
        <li class="item" v-for="item in orderedItems" :key="item.id">
          <plan-item
            v-if="'user' in item && item.plan != null"
            :share="item"
            :object="item.plan"
          ></plan-item>
          <folder-item
            v-if="'user' in item && item.project != null"
            :share="item"
            :object="item.project"
          ></folder-item>
          <plan-item v-if="'tasks' in item" :object="item"></plan-item>
          <folder-item v-if="'projects' in item" :object="item"></folder-item>
        </li>
      </ul>
      <fab-menu :options="fabOptions" :main="fabMain"></fab-menu>
    </div>
  </div>
</template>

<script>
import BurgerMenu from "./ui/BurgerMenu"; // import the CSS transitions you wish to use, in this case we are using `Slide`
import PlanItem from "@/components/app/plan/PlanItem";
import FolderItem from "@/components/app/FolderItem";
import NavBar from "@/components/app/NavBar";
import Fab from "@/components/app/ui/Fab";
export default {
  name: "listsView",
  components: {
    PlanItem,
    FolderItem,
    NavBar,
    "fab-menu": Fab,
    BurgerMenu
  },
  data() {
    return {
      scrollTop: 0,
      isLoading: true,
      fabOptions: [
        {
          icon: "folder",
          label: "Pasta",
          action: () => {
            this.$router.push({
              name: "NewProject"
            });
          }
        },
        {
          icon: "map",
          label: "Mapa",
          action: () => {
            this.$router.push({
              name: "NewPlan"
            });
          }
        }
      ],
      fabMain: {
        icon: "plus"
      }
    };
  },
  methods: {
    openSearch() {
      this.$store.dispatch("toggleSearch");
      this.$store.dispatch("search", "");
    },
    openBurgerMenu() {
      this.$refs.burgerMenu.show();
    }
  },
  computed: {
    isLoadingLists() {
      return this.$store.getters.isLoadingLists;
    },
    user() {
      return this.$store.getters.getUser;
    },
    company() {
      return this.$store.getters.getCurrentCompany;
    },
    filteredItems() {
      return this.items.filter(item => {
        return !item.project && !item.parent;
      });
    },
    // items() {
    //   return [
    //     ...this.$store.getters.getProjects,
    //     ...this.$store.getters.getPlans,
    //   ];
    // },
    items() {
      return [
        ...this.$store.getters.getProjects,
        ...this.$store.getters.getPlans,
        ...this.$store.getters.getSharings
      ];
    },
    orderedItems: function() {
      return this.filteredItems.sort(function(a, b) {
        let compA, compB;
        if (a.name) {
          compA = a.name;
        } else if (a.project) {
          compA = a.project.name;
        } else if (a.plan) {
          compA = a.plan.name;
        }

        if (b.name) {
          compB = b.name;
        } else if (b.project) {
          compB = b.project.name;
        } else if (b.plan) {
          compB = b.plan.name;
        }

        return compA.localeCompare(compB);
      });
      // return this._.orderBy(this.filteredItems, [
      //   ((item) => {
      //
      // ]);
    }

    // getProjects(){
    //   if (this.$store.getters.getSearchTerm != ""){
    //     return this.$store.getters.getProjects.filter(project => {
    //       return project.name.toLowerCase().includes(this.$store.getters.getSearchTerm.toLowerCase())
    //     })
    //   }else{
    //     return this.$store.getters.getProjects
    //   }
    // }
  },
  async mounted() {
    await this.$store.dispatch("setIsLoadingLists", true);

    // if (this.company && this.company.slug == 'vantum'){
    await this.$store.dispatch(
      "getPlans",
      "owner=" + this.$store.getters.getUser._id
    );
    await this.$store.dispatch(
      "getProjects",
      "owner=" + this.$store.getters.getUser._id
    );
    // await this.$store.dispatch(
    //   "getAlbums",
    //   "owner=" + this.$store.getters.getUser._id
    // );
    await this.$store.dispatch(
      "getUserSharings",
      "user=" + this.$store.getters.getUser._id
    );

    // await this.$store.dispatch(
    //   "getExampleAlbums",
    //   "owner=5c5347560d90150017d4c882"
    // );
    // await this.$store.dispatch(
    //   "getExampleProjects",
    //   "owner=5c5347560d90150017d4c882"
    // );
    // await this.$store.dispatch(
    //   "getExamplePlans",
    //   "owner=5c5347560d90150017d4c882"
    // );

    // }else{
    //   await this.$store.dispatch('getPlans', "company="+this.$store.getters.getCurrentCompany._id)
    //   await this.$store.dispatch('getProjects', "company="+this.$store.getters.getCurrentCompany._id)
    //   await this.$store.dispatch('getAlbums', "company="+this.$store.getters.getCurrentCompany._id)
    // }

    await this.$store.dispatch("setIsLoadingLists", false);
  }
};
</script>

<style lang="scss">
.page {
  display: flex;
  flex-flow: column;
  align-items: stretch;
  flex-direction: column;
  height: 100vh;

  .companyLogo {
    display: inline-block;
    text-align: center;
    /* padding: 12px 0px 3px 0; */
    // width: 100px;
    height: 100%;
    margin-left: 10px;
    font-size: 22px;
    font-weight: bold;
    vertical-align: middle;
    max-height: 60px;
    // max-width: 250px;
    align-self: flex-end;

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }

  .pageTitle {
    line-height: 30px;
    font-size: 22px;
    font-weight: bold;
    align-self: flex-end;

    .icon {
      vertical-align: sub;
    }
  }

  .spacer {
    flex-grow: 1 !important;
  }

  .nav-bar {
    flex: 0 1 auto;
  }
  .list-items {
    position: relative;
    overflow-y: auto;
    padding: 10px;
    height: 100%;
    margin: 0;
    flex: 1 1 auto;

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
  }
}
</style>
