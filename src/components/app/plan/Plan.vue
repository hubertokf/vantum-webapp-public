<template>
  <div class="planContent">
    <nav-bar ref="nav" :scrollTop="scrollTop">
      <div class="overlay" @click="goToMap">
        <div class="hover">ver mapa</div>
      </div>
      <template v-slot:bg>
        <!-- <map-v v-if="plan" :orthomosaic="plan.orthomosaics[0]" :plan="plan"></map-v> -->
      </template>
      <template v-slot:left>
        <div class="back" @click="$router.go(-1)">
          <b-icon :icon="'arrow-left'" :size="'is-medium'"></b-icon>
        </div>
      </template>

      <template v-slot:title>
        <!-- <div class="spacer"></div> -->
        <div class="pageTitle" v-if="plan">{{ plan.name }}</div>

        <div class="spacer"></div>
      </template>

      <template v-slot:right>
        <!-- <b-icon :icon="'map'" :size="'is-medium'"></b-icon> -->
        
        <b-dropdown aria-role="menu" position="is-bottom-left" v-if="!orthomosaicOffline">
          <button class="dropdownMenu" v-if="allowEditVisualization" slot="trigger">
            <b-icon :icon="'dots-vertical'" :size="'is-medium'"></b-icon>
          </button>
          <b-dropdown-item value="edit" aria-role="menuitem" v-on:click="editMode()">
            <i class="fas fa-edit"></i>
            Editar
          </b-dropdown-item>

          <b-dropdown-item value="edit" aria-role="menuitem" v-on:click="showModalShare()">
            <i class="fas fa-share-alt"></i>
            Compartilhar
          </b-dropdown-item>

          <b-dropdown-item
            value="trash"
            aria-role="menuitem"
            v-on:click="confirmCustomDelete()"
            v-if="!example && arrowBack"
          >
            <i class="fas fa-trash"></i>
            Excluir
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </nav-bar>

    <div
      class="plan"
      @scroll="
        a => {
          scrollTop = a.target.scrollTop;
        }
      "
    >
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>

      <!-- <navigation-menu
        v-if="plan && !isLoading"
        :title="plan.name"
        :arrowBack="
          arrowBack && !compareMosaics && !billingView && !orthomosaicOffline
        "
      >
        <b-dropdown-item
          value="edit"
          aria-role="menuitem"
          v-on:click="editMode()"
          v-if="!orthomosaicOffline"
        >
          <i class="fas fa-edit"></i>
          Editar
        </b-dropdown-item>

        <b-dropdown-item
          value="trash"
          aria-role="menuitem"
          v-on:click="confirmCustomDelete()"
          v-if="!example && arrowBack && !orthomosaicOffline"
        >
          <i class="fas fa-trash"></i>
          Excluir
        </b-dropdown-item>
      </navigation-menu>-->

      <offline-orthomosaics
        :orthomosaics="plan.orthomosaics"
        :plan="plan"
        v-if="plan && orthomosaicOffline"
      ></offline-orthomosaics>

      <!-- <div class="billingView" v-if="plan && billingView">
        <billing-view
          :invoiceObj="plan.invoices[0]"
          ref="billingView"
          :showButton="false">
          </billing-view>

          <b-field>
            <b-button
              class="button next-bt is-primary is-pulled-right"
              @click="exitInvoice"
            >Voltar</b-button>
          </b-field>
      </div>-->

      <compare-mosaics :orthomosaics="plan.orthomosaics" v-if="compareMosaics"></compare-mosaics>

      <plan-details
        v-if="
          plan &&
            !isLoading &&
            !edit &&
            !compareMosaics &&
            !billingView &&
            !orthomosaicOffline
        "
        :plan="plan"
      ></plan-details>

      <div
        class="button is-primary offlineMosaics"
        @click="orthomosaicOffline = true"
        v-if="!orthomosaicOffline && !isLoading && !compareMosaics"
      >
        <i class="fas fa-download"></i>
        Mosaicos Offline
      </div>

      <!-- <div class="invoice" v-if="plan && plan.invoices && plan.invoices != [] && !billingView">
        <b-button
          class="button next-bt is-secondary"
          @click="viewInvoice"
        ><i class="fas fa-file-invoice-dollar"></i> Visualizar fatura</b-button>
      </div>-->

      <b-button
        class="selectMosaicsToCompare is-primary"
        @click="selectMosaicsToCompare()"
        v-if="
          !compareMosaics &&
            !isLoading &&
            !billingView &&
            !edit &&
            !orthomosaicOffline
        "
      >
        <i class="fas fa-arrows-alt-h"></i>
        Comparar Ortomosaicos
      </b-button>

      <div class="editPlan" v-if="edit">
        <plan-form v-if="plan && !isLoading" :planObj="plan" :showButton="false" ref="planForm"></plan-form>

        <b-field class="is-pulled-right">
          <b-button
            class="button next-bt is-primary"
            @click="updatePlan"
            :loading="inputLoading"
            :disabled="inputLoading"
          >Salvar</b-button>
        </b-field>
        <b-field class="is-pulled-left">
          <b-button class="button next-bt is-primary" @click="cancelEditMode">Cancelar</b-button>
        </b-field>
      </div>

      <fab-menu
        :options="fabOptions"
        ref="fabMenu"
        v-if="!orthomosaicOffline && !isLoading && !compareMosaics && !edit"
      ></fab-menu>

      <div class="errorNo36tFound" v-if="error && !isLoading">
        Desculpe, este mapa não foi encontrado.
        <br />:(
      </div>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import PlanDetails from "./PlanDetails.vue";
import PlanForm from "./PlanForm.vue";
import CompareMosaics from "./CompareMosaics";
import BillingView from "@/components/app/billing/BillingView";
import OfflineOrthomosaics from "../orthomosaic/OfflineOrthomosaics";
import NavBar from "@/components/app/NavBar";
import Mapp from "@/components/app/Map";
import Fab from "@/components/app/ui/Fab";
import ShareModal from "../share/ShareModal";

export default {
  name: "plan",
  components: {
    NavigationMenu,
    BillingView,
    "plan-details": PlanDetails,
    "plan-form": PlanForm,
    CompareMosaics,
    NavBar,
    "map-v": Mapp,
    "fab-menu": Fab,
    OfflineOrthomosaics
  },
  props: {
    planObject: {
      type: Object,
      default: null
    },
    planId: {
      type: String
    },
    share: {
      type: Object
    },
    example: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ShareModal: ShareModal,
      scrollTop: 0,
      plan: null,
      edit: false,
      inputLoading: false,
      error: false,
      isLoading: false,
      arrowBack: true,
      compareMosaics: false,
      billingView: false,
      orthomosaicOffline: false,
      fabOptions: [
        {
          icon: "ruler",
          label: "Linha",
          action: () => {
            this.addAnnotation("line");
          }
        },
        {
          icon: "draw-polygon",
          label: "Polígono",
          action: () => {
            this.addAnnotation("polygon");
          }
        },
        {
          icon: "vector-square",
          label: "Retângulo",
          action: () => {
            this.addAnnotation("rectangle");
          }
        },
        {
          icon: "circle",
          label: "Círculo",
          action: () => {
            this.addAnnotation("circle");
          }
        },
        {
          icon: "map-marker-alt",
          label: "Marcador",
          action: () => {
            this.addAnnotation("marker");
          }
        }
      ]
    };
  },

  beforeDestroy() {
    // this.$store.dispatch("setCurrentPlan", null);
    // this.$root.$emit("clear-orthomosaics");
  },

  mounted() {
    this.isLoading = true;
    if (this.share && this.share.linkSharing) {
      this.arrowBack = false;
    }
    if (this.planObject != null) {
      this.plan = this.planObject;
      this.$store.dispatch("setCurrentPlan", this.planObject);
      this.isLoading = false;

      if (this.$isMobile && this.plan.orthomosaics.length > 0) {
        this.$store.dispatch("toggleSidebar");
      }
    } else {
      this.$store
        .dispatch("getPlan", this.planId)
        .then(async plan => {
          this.plan = plan;
          this.$store.dispatch("setCurrentPlan", this.plan);

          // this.plan.name = plan.name
          // this.plan.tasks = plan.tasks

          this.isLoading = false;

          if (this.$isMobile && this.plan.orthomosaics.length > 0) {
            this.$store.dispatch("toggleSidebar");
          }
        })
        .catch(e => {
          console.log(e);
          this.isLoading = false;
          this.error = true;
        });
    }
  },
  computed: {
    allowEditVisualization() {
      if (!this.share || (this.share && this.share.level >= 2)) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    showModalShare() {
      this.$buefy.modal.open({
        parent: this,
        component: this.ShareModal,
        hasModalCard: true,
        props: {
          plan: this.object
        }
      });
    },
    addAnnotation(type) {
      this.$refs.fabMenu.toggle();
      switch (type) {
        case "line":
          if (this.$isMobile) {
            this.$store.dispatch("toggleSidebar");
          }
          this.$root.$emit("add-polyline", -1);
          break;
        case "polygon":
          if (this.$isMobile) {
            this.$store.dispatch("toggleSidebar");
          }
          this.$root.$emit("add-polygon", -1);
          break;
        case "rectangle":
          if (this.$isMobile) {
            this.$store.dispatch("toggleSidebar");
          }
          this.$root.$emit("add-rectangle", -1);
          break;
        case "circle":
          if (this.$isMobile) {
            this.$store.dispatch("toggleSidebar");
          }
          this.$root.$emit("add-circle", -1);
          break;
        case "marker":
          if (this.$isMobile) {
            this.$store.dispatch("toggleSidebar");
          }
          this.$root.$emit("add-marker", -1);
          break;
        default:
          break;
      }
    },
    goToMap() {
      this.$store.dispatch("toggleSidebar");
    },
    viewInvoice() {
      this.billingView = true;
      // let invoiceObj = this.plan.invoices[0]
      // this.$router.push({ name: 'PlanBilling', params: { invoiceObj: invoiceObj,showButton:false } })
    },
    exitInvoice() {
      this.billingView = false;
    },
    selectMosaicsToCompare() {
      this.compareMosaics = true;
    },
    stopCompareMosaics() {
      this.compareMosaics = false;
    },
    editMode() {
      this.edit = true;
    },
    cancelEditMode() {
      this.edit = false;
    },
    centerMap(coords) {
      this.$root.$emit("centerMap", coords);
    },
    updatePlan() {
      this.inputLoading = true;
      this.$refs.planForm
        .submit()
        .then(async plan => {
          this.$store.dispatch("editPlan", plan);
          this.plan = plan;

          this.inputLoading = false;
          this.edit = false;
        })
        .catch(() => {
          this.inputLoading = false;
        });
    },
    isActive(ref) {
      var index = this.$store.getters.getActiveOrthomosaics.findIndex(
        orthomosaic => orthomosaic.id === ref.id
      );

      if (index != -1) {
        return true;
      }
      return false;
    },
    deleteItem() {
      if (!this.share) {
        this.$store.dispatch("deletePlan", this.planId).then(() => {
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Mapa removido"
          });
          this.$router.go(-1);
        });
      } else {
        this.$store.dispatch("deleteSharing", this.share.id).then(() => {
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Projeto compartilhado removido"
          });
          this.$router.go(-1);
        });
      }
    },

    confirmCustomDelete() {
      this.$buefy.dialog.confirm({
        title: "Deletando Mapa",
        message:
          "Você tem certeza que deseja <b>deletar</b> o mapa ? Isso é uma ação sem volta.",
        confirmText: "Deletar Mapa",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteItem()
      });
    }
  }
};
</script>

<style lang="scss" scope>
.planContent {
  position: relative;
  width: 100%;

  overflow-y: auto;

  display: flex;
  flex-flow: column;
  align-items: stretch;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  flex: 1;

  .pageTitle {
    line-height: 30px;
    font-size: 22px;
    font-weight: bold;
    width: calc(100% - 20px);
    z-index: 3;
    align-self: flex-end;

    .icon {
      vertical-align: sub;
    }
  }

  .overlay {
    height: 100%;
    width: 100%;
    // background-color: rgba(0, 0, 0, 0.4);
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.80632) 0%,
      rgba(0, 212, 255, 0) 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;

    .hover {
      display: none;
      color: #e5e5e5;
      font-weight: bold;
      text-align: center;
      margin: auto;
      width: 100%;
      @include v-centerer;
    }

    &:hover {
      .hover {
        display: block;
      }
    }
  }

  .plan {
    width: 100%;
    padding: 10px;
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;
    overflow-y: auto;
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

    .selectMosaicsToCompare {
      width: 100%;
      margin-bottom: 20px;
    }

    .offlineMosaics {
      width: 100%;
      margin-bottom: 20px;

      i {
        margin-right: 5px;
      }
    }

    .errorNotFound {
      text-align: center;
      font-weight: bold;
      margin-top: 20px;
    }

    .invoice {
      width: 100%;
      margin-bottom: 15px;

      button {
        background-color: var(--color-dark);
        width: 100%;
        margin-top: 0;
      }
    }
  }
}
</style>
