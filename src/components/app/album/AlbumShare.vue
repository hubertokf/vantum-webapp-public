<template>
  <div class="album-view">

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
      </b-field>
      
      <b-field label="Usuários">
        <b-select v-model="share.user" placeholder="Selecione">
          <option
            v-for="user in listUsers"
            :value="user.id"
            :key="user.id">
            {{ user.fullName }}
          </option>
        </b-select>
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
        <button class="btn_button_salve" @click="shareAlbum()">Compartilhar</button>
      </div>

    </div>
  </div>
</template>


<script>
  // import axios from 'axios'

export default {
    name: 'album-view',
    props: {
      album: {
        type: Object
      }
    },
    mounted () {
      this.$store.dispatch('getUsers')
      .then((users) => {
        this.listUsers = users
      })

      this.$store.dispatch('getSharings', 'album='+this.album.id)
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
          plan: null,
          album: this.album.id,
          user: ''
        },
        listUsers: [],
        listShares: [],
        listLevels: [{ id: '1', name: 'Vizualizar' }, {id: '2', name: 'Vizualizar + Editar'}, { id: '3', name: 'Vizualizar + Editar + Compartilhar' }],

      }
    },
    methods: {

      shareAlbum (){
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

<style lang="scss" scoped>
 .album-view{
   margin: auto;

    .album{

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
