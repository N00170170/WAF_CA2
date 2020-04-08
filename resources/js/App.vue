<template>
<!-- If route is /, apply bg class to display background image on page -->
  <div v-bind:class="{ 'bg': $route.path == '/' }"> 
    <Navbar :loggedIn="this.loggedIn" v-on:login="setLoggedIn" v-on:logout="setLoggedOut"></Navbar>
    <b-container align-h="center">
      <transition :name="transitionName" mode="out-in">
        <router-view :loggedIn="this.loggedIn" v-on:login="setLoggedIn" v-on:logout="setLoggedOut"></router-view>
      </transition>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import Navbar from "./components/Navbar.vue";

export default {
  name: "app",
  components: {
    Navbar
  },
  data() {
    return {
      loggedIn: false
    };
  },
  created() {
    if (localStorage.getItem('token')) {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }
  },
  methods: {
    setLoggedIn() {
      this.loggedIn = true;
    },
    setLoggedOut() {
      this.loggedIn = false;
    }
  },
  watch: {
    $route(to, from) {
      //Choose transition based on page location or amount of partitions in url
      if (!!to.meta.depthIndex && !!from.meta.depthIndex) {
        if (to.meta.depthIndex < from.meta.depthIndex) {
          this.transitionName = "slide-right";
        } else if (to.meta.depthIndex > from.meta.depthIndex) {
          this.transitionName = "slide-left";
        } else {
          this.transitionName = "fade";
        }
      } else {
        this.transitionName = "fade";
      }
    }
  }
};
</script>

<style>

.center-page {
  margin: auto;
}

.b-container {
  margin: auto;
  height: 100%;

}

.page-title {
  padding-top: 20px;

}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bg {
    background-image: url("https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 1s, transform 1s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.2s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
