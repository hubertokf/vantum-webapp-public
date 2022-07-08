<template>
  <div>
    <fab-menu :options="fabOptions" :main="fabMain"></fab-menu>
  </div>
</template>
<script>
import ProjectForm from "./ProjectForm";
import Fab from "@/components/app/ui/Fab";

export default {
  components: {
    "fab-menu": Fab,
    "project-form": ProjectForm
  },
  props: {
    addProject: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  data() {
    return {
      showProjectForm: false,
      position: "top-right",
      fabOptions: [
        {
          icon: "folder",
          label: "Pasta",
          action: () => {
            this.insertProject()
          }
        },
        {
          icon: "map",
          label: "Mapa",
          action: () => {
            this.insertPlan()

          }
        }
      ],
      fabMain: {
        icon: "plus"
      }
    };
  },
  mounted() {},
  methods: {
    insertProject() {
      this.$router.push({
        name: "NewProject", 
        params:{ parent: this.album.id }
      });
    },
    insertPlan() {
      this.$router.push({
        name: "NewPlan", 
        params:{ projectParent: this.album.id }
      });
    }
  }
};
</script>
<style lang="scss">
/* This is for documentation purposes and will not be needed in your application */
#create .v-speed-dial {
  /* position: absolute; */
}

#create .v-btn--floating {
  /* position: relative; */
}
.project-buttons {
  margin-right: 30px;

  .fab-wrapper {
    position: fixed !important;
    border-radius: 100%;
    margin-top: 8px;
    margin-left: 8px;
    margin-right: 5px;
    text-align: center;
    color: white;
    bottom: 55px !important;
    right: 45px !important;
    font-size: 22px;
    line-height: 49px;
    width: 50px;
    height: 50px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px,
      rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    cursor: pointer;

    .actions-container {
      overflow: inherit;

      .fab-list {
        position: absolute;
        bottom: 0px;
        right: 0;
        left: 0;
      }
    }

    .fab-main {
      padding: 25px !important;

      i {
        font-weight: bold !important;
        font-size: 30px;
      }
    }

    .actions-container {
      bottom: 0 !important;
      padding-bottom: 0 !important;
    }
  }
}
</style>