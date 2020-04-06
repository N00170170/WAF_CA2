<template>
  <div>
    <b-container fluid >
      <b-row align-h="center">
          <b-col md="3">
              <b-form>
                  <b-form-group label='Name' label-for='name'>
                      <b-form-input id='name' type='text' class='form-control' name='name' required autocomplete='current-name' v-model='name' @keydown.enter.native='login()'/>
                  </b-form-group>

                  <b-form-group label='Email' label-for='email'>
                      <b-form-input id='email' type='email' class='form-control' name='email' required autocomplete='current-email' v-model='email' @keydown.enter.native='login()'/>
                  </b-form-group>

                  <b-form-group label='Password' label-for='password'>
                      <b-form-input id='password' type='password' class='form-control' name='password' required autocomplete='current-password' v-model='password' @keydown.enter.native='login()'/>
                  </b-form-group>

                  <b-form-group label label-for='register' class='mb-0'>
                    <b-button id='register' v-on:click='register()' class="btn btn-success" v-if='!authLoading'>Register</b-button>
                    <b-button v-else >
                      <b-spinner small label='Loading...'></b-spinner>
                    </b-button>
                    <!--                                
                                          <a class="btn btn-link" href="{{ route('password.request') }}">
                                              Forgot your password
                    </a>-->
                  </b-form-group>
              </b-form>
          </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from "axios";
import { FormPlugin, ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);

export default {
  name: 'register',
  components: {
  },
  data() {
    return {
        email: "",
        name: "",
        password: "",
        authLoading: false
    }
  },
  methods: {
      register() {
          let app = this;
          app.authLoading = true;
          axios.post('/api/register', {
              name: app.name,
              email: app.email,
              password: app.password
          })
          .then(function(response){
              app.name = response.data.name,
              app.email = response.data.email,
              localStorage.setItem('token', response.data.token)
              app.$router.push('/courses')
          })
          .catch(function(error){
              app.authLoading = false;
              console.log(error);
          });
      }
  },
//   computed: {
//     ...mapState({
//       authLoading: state => state.auth.status === "loading"
//     })
//   }
}
</script>

<style>
</style>