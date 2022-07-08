<template>
  <div class="plan-view">

    <div class="info">

      <b-field label="Compartilhado com:">
        <table>
          <tr v-for="share in listShares">
            <td>
            {{ share.user.name }}  
            {{ share.user.email }}  
            </td>
            <td>
            {{ share.level }}  
            </td>
          </tr>
        </table>
        <!-- <b-select placeholder="Selecione" v-model="share.project"> -->
          <!-- <option
            v-for="Share in listShares"
            :value="Share.name"
            :key="Share.id">
            {{ Share.name }}
          </option> -->
        <!-- </b-select> -->
      </b-field>
      
      <b-field label="Usuários">
        <v-select v-model="share.user" :options="options" @search="onSearch" />
      </b-field>

      <b-field label="Tipo de compartilhamento">
        <b-select v-model="share.level" placeholder="Selecione">
          <option
            v-for="level in listLevels"
            :value="level.id"
            :key="level.id">
            {{ level.name }}
          </option>
        </b-select>
      </b-field>

      <div slot="footer">
        <button class="btn_button_salve" @click="sharePlan()">Compartilhar</button>
      </div>

    </div>
  </div>
</template>


<script>
  // import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import {_} from 'underscore'
export default {
    name: 'plan-view',
    components: {
      'v-select': vSelect,
    },
    props: {
      plan: {
        type: Object
      }
    },
    mounted () {
      this.$store.dispatch('getUsers')
      .then((users) => {
        this.listUsers = users
      })

      this.$store.dispatch('getSharings', 'plan='+this.plan.id)
      .then((shares) => {
        this.listShares = shares
      })
    },

    data () {
      return {
        share:{
          // id: null,
          level: '',
          owner: this.$store.getters.getUser.id,
          project: null,
          plan: this.plan.id,
          album: null,
          user: ''
        },
        options: [],
        listUsers: [],
        listShares: [],
        listLevels: [{ id: '1', name: 'Vizualizar' }, {id: '2', name: 'Vizualizar + Editar'}, { id: '3', name: 'Vizualizar + Editar + Compartilhar' }],

      }
    },
    computed: {
      getUsers() {
        return this.listUsers.map(u => ({label: u.fullName, code: u.id}))
      }
    },
    methods: {
      onSearch(search, loading) {
        // https://www.vantum.com.br/app/sharing/ + id
        if(search.length > 3 ){
          loading(true);
          this.search(loading, search, this);
        }
      },

      search: _.debounce((loading, search, vm) => {
        vm.$store.dispatch('getEmails', 'email='+search)
        .then((emails) =>{
          vm.options = emails.map(u => ({label: u.email+" - "+u.fullName, code: u.id}))
          loading(false);
        });
      }, 350),

      sharePlan (){
        this.$store.dispatch('postSharing', this.share)
        .then(() => {
          this.$notify({
            group: 'global',
            type: 'is-success',
            duration: 2000,
            title: 'Mapa compartilhado'
          });
        })
      }
    }
  }
</script>

<style lang="scss">
 .plan-view{
   margin: auto;

    .plan{

    }

    .info{
      position: relative;
      background-color: white;
      color: black;
      margin: 0;
      padding: 20px;
      text-align: center;

      .attribute{
        margin-bottom: 10px;

        .label{
          font-weight: bold;
          color: black;
          line-height: 10px;
          margin-bottom: 0;
        }

        .value{
          display: inline-block;
          color: black;
        }
      }
    }
 }
</style>
