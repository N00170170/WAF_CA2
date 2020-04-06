<template>

  <div>
    <b-navbar toggleable='md' type='dark' variant='primary'>
      <b-navbar-brand to='/'>
        <!-- <img src='/img/brand/navLogoInverted.png' height='44' class='d-inline-block align-top' alt='InvoiceAmigo' /> -->
        College App
      </b-navbar-brand>
      <b-navbar-toggle target='navbarCollapse' class='float-right'></b-navbar-toggle>
      <b-collapse id='navbarCollapse' is-nav>
        <!-- <b-navbar-nav> -->
          <!-- <b-nav-item active to='/dash' v-if='isAuthenticated'>Dash</b-nav-item> -->
        <!-- </b-navbar-nav> -->
        <b-navbar-nav class='ml-auto'>
          <!-- Show when logged in -->
          <b-nav-item active to='/courses' >Courses</b-nav-item>
          <b-nav-item active to='/lecturers' >Lecturers</b-nav-item>
          <b-nav-item active to='/enrolments' >Enrolments</b-nav-item>

          <!-- <b-nav-item-dropdown v-if='isAuthenticated' id='my-nav-dropdown' text='Account' toggle-class='nav-link-custom' right>
            <b-dropdown-item active to='/settings'>Settings</b-dropdown-item>
            <b-dropdown-item active to='/cpanel'>cPanel</b-dropdown-item>
            <b-dropdown-item active @click='logout()'>Log Out</b-dropdown-item>
          </b-nav-item-dropdown> -->
          <!-- <b-nav-item active> -->

          <!-- <b-form-checkbox switch v-model='notificationDrawer'>
              
          </b-form-checkbox>-->

          <!-- </b-nav-item> -->
          <!-- Show when not logged in -->
          <!-- <b-nav-item class='text-dark nav-login'  to='/login' v-if='!isAuthenticated'>Login</b-nav-item>
          <b-nav-item class='text-dark nav-login'  to='/register' v-if='!isAuthenticated'>Register</b-nav-item> -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import Vue from "vue";
import {
  ButtonPlugin,
  NavPlugin,
  NavbarPlugin,
} from "bootstrap-vue";
// Install BootstrapVue
Vue.use(ButtonPlugin);
Vue.use(NavPlugin);
Vue.use(NavbarPlugin);

export default {
  data() {
    return {
    };
  },
  components: {
  },
  methods: {
    logout() {
      this.$store
        .dispatch(AUTH_LOGOUT)
        .then(() => {
          this.$router.push("/login");
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>