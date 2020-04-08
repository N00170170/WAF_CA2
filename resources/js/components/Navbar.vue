<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="primary">
      <b-navbar-brand to="/">
        <!-- <img src='/img/brand/navLogoInverted.png' height='44' class='d-inline-block align-top' alt='InvoiceAmigo' /> -->
        College App
      </b-navbar-brand>
      <b-navbar-toggle target="navbarCollapse" class="float-right"></b-navbar-toggle>
      <b-collapse id="navbarCollapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <!-- Show when logged in -->
          <b-nav-item active to="/courses" v-if="loggedIn">Courses</b-nav-item>
          <b-nav-item active to="/lecturers" v-if="loggedIn">Lecturers</b-nav-item>
          <b-nav-item active to="/enrolments" v-if="loggedIn">Enrolments</b-nav-item>

          <b-nav-item-dropdown
            active
            show
            v-if="loggedIn"
            id="account-dropdown"
            text="Account"
            toggle-class="nav-link-custom"
            right
            style="color: #fff !important"
          >
            <b-dropdown-item @click="logout()">Log Out</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- Show when not logged in -->
          <b-nav-item active to='/login' v-if='!loggedIn'>Login</b-nav-item>
          <b-nav-item active to='/register' v-if='!loggedIn'>Register</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import Vue from "vue";
import { ButtonPlugin, NavPlugin, NavbarPlugin } from "bootstrap-vue";
// Install BootstrapVue
Vue.use(ButtonPlugin);
Vue.use(NavPlugin);
Vue.use(NavbarPlugin);

export default {
  name: "Navbar",
  data() {
    return {};
  },
  props: {
    loggedIn: Boolean
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$emit("logout");
      this.$router.push("/");
    }
  }
};
</script>