<template>
  <div class="share-item" @click="open()" :key="object.id">
    <div class="icon">
      <i class="fas fa-share-alt"></i>
      <!-- <img src="@/assets/img/placeholder.svg" alt=""> -->
    </div>

    <div class="info">
      <div class="name">{{ object.name }}</div>
      <div class="creationDate">{{ object.createdAt | moment("DD/MM/YYYY HH:mm") }}</div>
      <div class="owner">{{ object.owner.fullName }}</div>
    </div>
    <div class="tools">
      <div class="deleteItem" v-on:click.stop="confirmCustomDelete()">
        <i class="fas fa-trash"></i>
      </div>
      <!-- <div class="shareItem" v-on:click.stop="share(share)">
        <i class="material-icons">share</i>
      </div> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: "share-item",
    data() {
      return {

      }
    },
    props: {
      object: {
        type: Object
      },
    },
    methods: {
      open() {
        var objectID
        objectID = this.object.id

        this.$parent.$router.push({ name: 'Sharing', params: { shareId: objectID } })
        // this.$parent.$router.push({ name: 'Project', params: { objectID: objectID } })
      },
      deleteItem() {
        // if(this.object.owner.id == this.$store.getters.getUser.id){
          // this.$store.dispatch('deleteProject', this.object.id)
          //   .then( () => {
          //     this.$parent.removeItem(this.object)
          //     this.$notify({
          //       group: 'global',
          //       type: 'is-success',
          //       duration: 2000,
          //       title: 'Projeto removido'
          //     });
          //   })
        // }
        // else{
        this.$store.dispatch('deleteSharing', this.object.id)
          .then( () => {
            this.$notify({
              group: 'global',
              type: 'is-success',
              duration: 2000,
              title: 'Projeto compartilhado removido'
            });
          })
        }        
      },

      confirmCustomDelete() {
        this.$buefy.dialog.confirm({
          title: 'Deletando Compartilhamento',
          message: 'Você tem certeza que deseja <b>deletar</b> o compartilhamento ? Isso é uma ação sem volta.',          
          confirmText: 'Deletar Projeto',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.deleteItem(this.object)
        })
      },

      share(){
        this.$notify({
          group: 'global',
          type: 'is-success',
          duration: 2000,
          title: 'Em desenvolvimento'
        });
      }
    }
  }
  
</script>

<style lang="scss" scoped>
  .share-item{
    padding: 15px 0;
    position: relative;
    background: white;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    margin-top: 8px;
    margin-left: 8px;
    margin-right: 5px;
    cursor: pointer;

    &:last-child{
      margin-bottom: 7px;
    }
    
    .icon{
      display: inline-block;
      height: 50px;
      width: 50px;
      overflow: hidden;
      margin: 3px 10px 3px 10px;
      float: left;
      text-align: center;

      img{
        width: 35px;
          @include v-centerer;
      }
      
      i{
        // margin-left: 5px;
        line-height: 50px;
        font-size: 40px;
        color: var(--color-dark);
      }
    }

    .info{
      display: inline-block;
      line-height: 16px;

      .name{
        font-size: 16px;
        line-height: 22px;
        font-weight: bold;
      }
      
      .creationDate{
        font-size: 12px;
        color: #666;
      }

      .owner{
        color: #666;
        font-size: 11px;
      }
    }

    .tools{
      @include v-centerer;
      padding: 10px;
      right: 0;
      text-align: center;
      
      .deleteItem{
      cursor: pointer;
      margin-bottom: 5px;
      &:hover{
        color: red;
      }
    }

    .shareItem{
      cursor: pointer;
      
      &:hover{
        color: green;
      }
    }

    }

    
  }
</style>