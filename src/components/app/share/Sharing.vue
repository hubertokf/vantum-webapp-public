<template>
  <div class="sharing">
    
    <plan v-if="share && share.plan" :planId="share.plan.id" :share="share" ></plan>
    <project v-if="share && share.project" :projectId="share.project.id" :share="share"></project>
    <album v-if="share && share.album" :albumId="share.album.id" :share="share"></album>

    <div class="errorNotFound" v-if="error">
      Desculpe, este compartilhamento não foi encontrado.<br /> :(
    </div>
  </div>
</template>

<script>
  import Plan from  '../plan/Plan'
  import Project from  '../project/Project'
  import Album from  '../album/Album'

  export default {
    name: "share",
    components:{
      "plan": Plan,
      "project": Project,
      "album": Album
    },
    props: {
      shareId: {
        type: String
      }
    },
    data() {
      return {
        share: null,
        error: false 
      }
    },

    computed: {
      getUser() {
        return this.$store.state.auth.user
      }
    },

    mounted () {
      this.$store.dispatch('getSharing', this.shareId)
      .then( async (share) => {
        if(share && share.linkSharing){
          this.share = share
        }else if(share && share.user.id == this.getUser.id){
          this.share = share
        }
        else{
          this.error = true
        }
      })
    },
       
    methods: {
    },
  }
</script>

<style lang="scss" scope>
  .sharing{
    width: 100%;
    padding: 10px;
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

    .errorNotFound{
      text-align: center;
      font-weight: bold;
      margin-top: 20px;
    }
  }

</style>