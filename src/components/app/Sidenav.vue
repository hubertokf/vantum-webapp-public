<template>
  <div class="sidenav">
    <!-- <div class="hide-sidenav" :class="[open ? 'opened' : 'closed']" @click="toggleSidenav">
      <i v-if="open" class="fas fa-angle-double-left"></i>
      <i v-if="!open" class="fas fa-angle-double-right"></i>
    </div> -->
    
    <!-- <user-section></user-section> -->
    <!-- <nav-bar></nav-bar> -->


    <router-view :key="$route.fullPath"></router-view>

    <!-- <div class="appFooter"> -->
      <!-- <div class="helpbutton"><i class="fas fa-question-circle"></i></div> -->
    <!-- </div> -->

    <div class="sidenav-toggle" :class="[open ? 'opened' : 'closed']" @click="toggleSidenav">
      <i v-if="open" class="fas fa-angle-double-left"></i>
      <i v-if="!open" class="fas fa-angle-double-right"></i>
    </div>
  </div>
</template>

<script>
  import {TweenMax, Power4} from 'gsap'
  import ProjectList from '@/components/app/project/ProjectList'
  import UserSection from '@/components/app/UserSection'
  import NavBar from '@/components/app/NavBar'
  import SearchBox from '@/components/app/SearchBox'
  import VShowSlide from 'v-show-slide'

  export default {
    name: 'sidenav',
    data() {
      return {
      }
    },
    components: {
      ProjectList,
      UserSection,
      NavBar,
      "search-box": SearchBox
    },
    computed: {
      open () {
        return this.$store.state.app.sidebarOpen
        // return true
      },
      searchOpen() {
        return this.$store.state.app.searchOpen;
        // return true
      },
    },
    methods: {
      toggleSidenav () {
        this.$store.dispatch('toggleSidebar')
      }
    },
    mounted () {
      const dX = this.open ? 0 : -this.$el.offsetWidth
      TweenMax.set(this.$el, {
        x: dX
      })
    },
    watch: {
      open: function (open) {
        const dX = open ? 0 : -this.$el.offsetWidth
        TweenMax.to(this.$el, 0.6, {
          x: dX,
          ease: Power4.easeOut
        })
      }
    }
  }
</script>

<style lang="scss">
  .sidenav{
    z-index: 2000;
    position: fixed;
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    flex-flow: column;
    left: 0;
    top: 0;
    // padding-top: 120px;
    // border-bottom: 3px solid var(--color-darker); 
  
    text-align: left;
    width: 400px;
    background: #F5F5F5;
    -webkit-box-shadow: 1px 0 10px rgba(0, 0, 0, 0.16);
    box-shadow: 1px 0 10px rgba(0, 0, 0, 0.16);

    @media screen and (max-width: 400px) {
      max-width: 100%;
    }

    .sidenav-toggle{
      cursor: pointer;
      right: -30px;
      width: 30px;
      text-align: center;
      /* vertical-align: middle; */
      height: 55px;
      background-color: var(--color-dark);
      border-radius: 0 5px 5px 0;
      @include v-centerer;

      i{
        color: white;
        @include v-centerer(-50%);
      }
    }

    .hide-sidenav{
      position: absolute;
      cursor: pointer;
      z-index: 2;
      right: 20px;
      top: 10px;
      width: 30px;
      height: 30px;
      text-align: center;

      i{
        color: white;
        @include v-centerer(-50%);
      }
    }

    .appFooter{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50px;
      width: 100%;
      background-color: white;
      -webkit-box-shadow: 2px 10px rgba(0, 0, 0, 0.4);
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.4);

      .helpbutton{
        text-align: center;
        font-size: 25px;
        color: var(--color-dark);
        margin: 7px;
      }
    }
  }
</style>