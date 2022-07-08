<template>
  <div class="companyConfigContent">
    <nav-bar ref="nav" :scrollTop="scrollTop">
      <template v-slot:left>
        <div class="back" @click="$router.go(-1)">
          <b-icon :icon="'arrow-left'" :size="'is-medium'"></b-icon>
        </div>
      </template>

      <template v-slot:title>
        <!-- <div class="spacer"></div> -->
        <div class="pageTitle">Configurações do Usuário</div>

        <div class="spacer"></div>
      </template>

      <template v-slot:right></template>
    </nav-bar>
    <div
      class="companyConfig"
      v-if="user"
      @scroll="
          a => {
            scrollTop = a.target.scrollTop;
          }
        "
    >
      <div class="companyDetails">
        <div class="detail fullname">
          <strong>Nome:</strong>
          {{company.name}}
        </div>
        <div class="detail email">
          <strong>CNPJ:</strong>
          {{company.cnpj}}
        </div>
        <b-field
          label="Cor 1"
          :type="{'is-danger': errors.has('color1')}"
          :message="errors.first('color1')"
        >
          <color-picker :color="color1" v-model="color1"></color-picker>
        </b-field>
        <b-field
          label="Cor 2"
          :type="{'is-danger': errors.has('color2')}"
          :message="errors.first('color2')"
        >
          <color-picker :color="color2" v-model="color2"></color-picker>
        </b-field>
        <b-field
          label="Cor 3"
          :type="{'is-danger': errors.has('color3')}"
          :message="errors.first('color3')"
        >
          <color-picker :color="color3" v-model="color3"></color-picker>
        </b-field>

        <b-field
          label="Cor 4"
          :type="{'is-danger': errors.has('color4')}"
          :message="errors.first('color4')"
        >
          <color-picker :color="color4" v-model="color4"></color-picker>
        </b-field>

        <div class="has-text-centered">
          <a class="button is-primary cancel" @click="cancel()">Cancelar</a>
          <a class="button is-primary save" @click="save()">Salvar</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationMenu from "../NavigationMenu";
import ColorPicker from "../ui/ColorPicker";
import NavBar from "@/components/app/NavBar";

export default {
  name: "company-config",
  components: {
    NavigationMenu,
    ColorPicker,
    NavBar
  },
  data() {
    return {
      scrollTop: 0,
      oldCompany: null,
      arrowBack: true
    };
  },
  mounted() {
    this.oldCompany = JSON.parse(
      JSON.stringify(this.$store.getters.getCurrentCompany)
    );
  },
  methods: {
    cancel() {
      this.$store.commit("set_company_color1", this.oldCompany.colors.color1);
      this.$store.commit("set_company_color2", this.oldCompany.colors.color2);
      this.$store.commit("set_company_color3", this.oldCompany.colors.color3);
      this.$store.commit("set_company_color4", this.oldCompany.colors.color4);

      this.$router.go(-2);
    },
    save() {
      this.$store.dispatch("putCompany").then(() => {
        this.$router.go(-2);
      });
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    company: {
      get() {
        return this.$store.getters.getCurrentCompany;
      },
      set(value) {
        this.$store.commit("set_company", value);
      }
    },
    color1: {
      get() {
        return this.$store.getters.getCurrentCompany.colors.color1;
      },
      set(value) {
        this.$store.commit("set_company_color1", value);
      }
    },
    color2: {
      get() {
        return this.$store.getters.getCurrentCompany.colors.color2;
      },
      set(value) {
        this.$store.commit("set_company_color2", value);
      }
    },
    color3: {
      get() {
        return this.$store.getters.getCurrentCompany.colors.color3;
      },
      set(value) {
        this.$store.commit("set_company_color3", value);
      }
    },
    color4: {
      get() {
        return this.$store.getters.getCurrentCompany.colors.color4;
      },
      set(value) {
        this.$store.commit("set_company_color4", value);
      }
    }
    // company() {
    //   return this.$store.getters.getCurrentCompany
    // },
  }
};
</script>

<style lang="scss" scoped>
.companyConfigContent {
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
    align-self: flex-end;

    .icon {
      vertical-align: sub;
    }
  }

  .companyConfig {
    padding: 10px;

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

    .companyDetails {
      .detail {
        margin-bottom: 20px;
      }
    }

    .cancel {
      margin-right: 20px;
    }

    .save {
    }

    .navigationMenu {
      margin-bottom: 20px;
      margin-top: 20px;
    }
  }
}
</style>