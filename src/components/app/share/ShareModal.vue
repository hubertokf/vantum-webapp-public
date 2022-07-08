<template>
  <div class="share-modal modal-card">
    <div class="info">
      <div class="columns">
        <div class="column">
          <div class="title">Configurações de Compartilhamento</div>
          <div class="close" @click="$emit('close')	">
            <i class="fas fa-times"></i>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <b-switch
            :value="linkSharing.linkSharing"
            v-model="linkSharing.linkSharing"
            @input="shareLink()"
            type="is-success"
          >Receber link compartilhável</b-switch>
        </div>
      </div>

      <div class="columns" v-if="linkSharing.id">
        <div class="column" style="max-width: 100%;">
          <div class="linkSharing">
            <div class="label">Compartilhamento de link público</div>
            <b-tooltip :label="copyTooltipLabel" :active="copyTooltip" type="is-dark" always>
              <button
                type="button"
                class="link"
                v-clipboard:copy="getLinkSharingURL"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError"
              >{{this.getLinkSharingURL}}</button>
            </b-tooltip>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-7">
          <b-field
            label="Email do usuário"
            :type="{'is-danger': errors.has('user')}"
            :message="errors.first('user')"
          >
            <!-- <v-select
              v-model="user"
              style="height: 2.25em;"
              placeholder="Insira endereços de e-mail"
              :options="options"
              v-validate="'required'"
              name="user"
              @search="onSearch"
            >-->
            <!-- <b-field label="Email"> -->
            <b-input type="email" v-validate="'required'" v-model="share.userEmail"></b-input>
          </b-field>
          <!-- <span slot="no-options">Nada Encontrado.</span>
            </v-select>
          </b-field>-->
        </div>

        <div class="column is-5">
          <b-field label="Tipo de compartilhamento">
            <!-- <v-select v-model="share.level" placeholder="Selecione" :options="listLevels"
            :reduce="listLevels => levels.id" label="name" closeOnSelect="true"
            >
              
            </v-select>-->
            <b-select v-model="share.level" placeholder="Selecione" :expanded="true">
              <option v-for="level in listLevels" :value="level.id" :key="level.id">{{ level.name }}</option>
            </b-select>
          </b-field>
        </div>
      </div>

      <div class="footer">
        <b-button class="button is-primary" @click="shareClick()" :loading="loadingBt">Compartilhar</b-button>
      </div>

      <b-field label="Compartilhado com:">
        <div class="shares">
          <div
            class="columns is-mobile share"
            v-for="(share, index) in getShares"
            :key="'share-'+index"
          >
            <div class="column is-7" v-if="!share.linkSharing">
              <!-- <div v-if="plan.project != null">
                    {{ plan.project.name }}
              </div>-->
              <div class="name" v-if="share.user != null">{{share.user.fullName}}</div>
              <div class="email" v-if="share.user != null">{{share.user.email}}</div>
            </div>
            <div class="column is-4" v-if="!share.linkSharing">
              <div class="type">{{share.levelLabel}}</div>
            </div>

            <div
              class="deleteButton column is-1"
              v-on:click.stop="confirmCustomDelete(share)"
              v-if="!share.linkSharing"
            >
              <i class="fa fa-trash"></i>
            </div>
          </div>
        </div>
      </b-field>
    </div>
  </div>
</template>


<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { _ } from "underscore";
import { setTimeout } from "timers";

export default {
  name: "share-modal",
  components: {
    "v-select": vSelect
  },
  props: {
    plan: {
      type: Object
    },
    project: {
      type: Object
    },
    album: {
      type: Object
    }
  },

  mounted() {
    if (this.project) {
      this.$store
        .dispatch("getSharings", "project=" + this.project.id)
        .then(shares => {
          this.listShares = shares;
          this.share.project = this.project.id;
          this.linkSharing.project = this.project.id;
          this.shareLevelLabel();
          this.findLinkShare();
        });
    } else if (this.plan) {
      this.$store
        .dispatch("getSharings", "plan=" + this.plan.id)
        .then(shares => {
          this.listShares = shares;
          this.share.plan = this.plan.id;
          this.linkSharing.plan = this.plan.id;
          this.shareLevelLabel();
          this.findLinkShare();
        });
    } else if (this.album) {
      this.$store
        .dispatch("getSharings", "album=" + this.album.id)
        .then(shares => {
          this.listShares = shares;
          this.share.album = this.album.id;
          this.linkSharing.album = this.album.id;
          this.shareLevelLabel();
          this.findLinkShare();
        });
    }
  },

  data() {
    return {
      share: {
        level: 1,
        linkSharing: false,
        owner: this.$store.getters.getUser.id,
        project: null,
        plan: null,
        album: null,
        userEmail: null
      },
      linkSharing: {
        id: null,
        level: 1,
        linkSharing: false,
        owner: this.$store.getters.getUser.id,
        project: null,
        plan: null,
        album: null,
        userEmail: null
      },
      copyTooltip: false,
      copyTooltipLabel: "Copiado!",
      shareLinkVariable: false,
      user: null,
      options: [],
      listUsers: [],
      listShares: [],
      loadingBt: false,
      listLevels: [
        { id: "1", name: "Visualizar" },
        { id: "2", name: "Visualizar Editar" },
        { id: "3", name: "Visualizar Editar Compartilhar" }
      ],
      columns: [
        {
          field: "user.fullName",
          label: "Nome",
          centered: true
        },
        {
          field: "user.email",
          label: "E-mail",
          centered: true
        },
        {
          field: "levelLabel",
          label: "Nível de compartilhamento",
          centered: true
        }
      ]
    };
  },
  computed: {
    // getUsers() {
    //   return this.listUsers.map(u => ({label: u.fullName, code: u.id}))
    // }

    getShares: function() {
      return this.listShares.filter(function(s) {
        return !s.linkSharing;
      });
    },
    getLinkSharingURL: function() {
      return "https://app.vantum.com.br/sharing/" + this.linkSharing.id;
    }
  },
  methods: {
    onCopySuccess: function() {
      this.copyTooltipLabel = "Copiado!";
      this.copyTooltip = true;
      setTimeout(() => (this.copyTooltip = false), 2000);
    },
    onCopyError: function() {
      this.copyTooltipLabel = "Falhou!";
      this.copyTooltip = true;
      setTimeout(() => (this.copyTooltip = false), 2000);
    },
    shareLevelLabel() {
      this.listShares.forEach(share => {
        if (share.level == 1) {
          share.levelLabel = "Visualizar";
        } else if (share.level == 2) {
          share.levelLabel = "Visualizar Editar";
        } else if (share.level == 3) {
          share.levelLabel = "Visualizar Editar Compartilhar";
        }
      });
    },

    findLinkShare() {
      this.listShares.forEach(share => {
        if (share.linkSharing) {
          this.linkSharing = share;
        }
      });
    },

    // onSearch(search, loading) {
    //   // https://www.vantum.com.br/app/sharing/ + id
    //   if (search.length > 3) {
    //     loading(true);
    //     this.search(loading, search, this);
    //   }
    // },

    // search: _.debounce((loading, search, vm) => {
    //   vm.$store.dispatch("getEmails", "email=" + search).then(emails => {
    //     // let _this = this
    //     // vm.options = emails.map(u => ({label: u.email+" - "+u.fullName, code: u.id}))
    //     vm.options = emails.map(u => {
    //       // if (u.email is)
    //       // if (!this.listShares.some(function(el){ return el.email === u.email})){
    //       return { label: u.email + " - " + u.fullName, code: u.id };
    //       // }
    //     });
    //     loading(false);
    //   });
    // }, 350),

    shareLink() {
      if (this.linkSharing.linkSharing) {
        this.linkSharing.plan = this.plan;
        this.linkSharing.linkSharing = true;

        this.$store.dispatch("postSharing", this.linkSharing).then(share => {
          this.linkSharing.id = share.id;

          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Link criado"
          });
        });
      } else {
        this.$store.dispatch("deleteSharing", this.linkSharing.id).then(() => {
          this.linkSharing = {
            id: null,
            level: 1,
            linkSharing: false,
            owner: this.$store.getters.getUser.id,
            project: null,
            plan: null,
            album: null,
            userEmail: null
          };
          this.$notify({
            group: "global",
            type: "is-success",
            duration: 2000,
            title: "Link removido"
          });
        });
      }
    },

    shareClick() {
      this.$validator.validateAll().then(async result => {
        if (result) {
          this.loadingBt = true;
          //

          this.share.owner = this.$store.getters.getUser.id;

          this.$store
            .dispatch("postSharing", this.share)
            .then(share => {
              if (share.level == 1) {
                share.levelLabel = "Visualizar";
              } else if (share.level == 2) {
                share.levelLabel = "Visualizar Editar";
              } else if (share.level == 3) {
                share.levelLabel = "Visualizar Editar Compartilhar";
              }
              this.listShares.push(share);
              this.share.userEmail = null;
              this.loadingBt = false;

              this.$notify({
                group: "global",
                type: "is-success",
                duration: 2000,
                title: "Mapa compartilhado"
              });
            })
            .catch(e => {
              if (e.response.data.errorCode == 405) {
                this.loadingBt = false;
                const error = {
                  field: "user",
                  msg: "Usuário não encontrado"
                };
                this.$notify({
                  group: "global",
                  type: "is-error",
                  duration: 2000,
                  title: "Usuário não encontrado"
                });
                this.errors.add(error);
              }
            });
        }
      });
    },

    deleteItem(share) {
      this.$store.dispatch("deleteSharing", share.id).then(() => {
        var index = this.listShares.findIndex(share => share.id === share.id);
        // this.listShares[index] = share
        this.listShares.splice(index, 1);

        this.$notify({
          group: "global",
          type: "is-success",
          duration: 2000,
          title: "Compartilhamento removido"
        });
      });
    },

    confirmCustomDelete(share) {
      this.$buefy.dialog.confirm({
        title: "Deletando Compartilhamento",
        message:
          "Você tem certeza que deseja <b>deletar</b> o compartilhamento ?",
        confirmText: "Deletar Compartilhamento",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteItem(share)
      });
    }
  }
};
</script>

<style lang="scss">
.share-modal {
  margin: auto;
  position: relative;
  // max-width: 100%;
  // padding: 10px;

  .close {
    cursor: pointer;
  }

  .vs__dropdown-toggle,
  .vs__selected,
  .vs__selected-options {
    max-height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vs__dropdown-option--highlight {
    background-color: var(--color-light);
  }

  .vs__selected {
    white-space: nowrap;
  }

  .title {
    color: #363636;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1.125;
  }

  .close {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  .info {
    position: relative;
    background-color: white;
    color: black;
    margin: 0;
    padding: 20px;

    overflow-x: hidden;
    overflow-y: auto;

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

    td {
      text-align: center;
    }
    tr {
      text-align: left;
    }

    .attribute {
      margin-bottom: 10px;

      .label {
        font-weight: bold;
        color: black;
        line-height: 10px;
        margin-bottom: 0px;
      }

      .value {
        display: inline-block;
        color: black;
      }
    }

    .linkSharing {
      border: 1px solid var(--color-lighter);
      max-width: 100%;

      .label {
        background: var(--color-lighter);
        padding: 5px;
        text-align: center;
        font-size: 14px;
        margin-bottom: 0;
      }

      .b-tooltip {
        width: 100%;
      }

      .link {
        text-align: center;
        padding: 5px;
        font-size: 14px;
        overflow: hidden;
        color: var(--color-light);
        width: 100%;
        background: none;
        border: 0;
      }
    }

    .shares {
      .share {
        border-bottom: 1px solid #ccc;
        padding: 6px 12px;
        margin: 0;

        .column {
          padding: 0;
        }

        &:first-child {
          margin-top: 15px;
          border-top: 1px solid #ccc;
        }

        .name {
          font-weight: bold;
        }
        .email {
          font-size: 12px;
          color: #666;
        }
        .type {
          text-align: center;
          color: #666;
          @include v-centerer2;
          font-size: 12px;
          word-spacing: 9999rem;
          line-height: 14px;
        }
      }
    }

    .footer {
      text-align: center;
      padding: 0px;
      margin: 0px;
      background-color: white;

      .button {
        margin-bottom: 20px;
      }
    }

    .deleteButton {
      text-align: center;
      width: 100%;
      position: relative;

      i {
        @include v-centerer;
        cursor: pointer;
        &:hover {
          color: red;
        }
      }
    }
  }
}
</style>
