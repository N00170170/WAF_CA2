<template>
  <div>
    <b-row align-h="center" class="page-title">
      <b-col md="5">
        <b-card class="center-page">
          <b-card-title>Register</b-card-title>
          <b-form>
            <b-form-group label="Name" label-for="name">
              <b-form-input
                id="name"
                type="text"
                class="form-control"
                name="name"
                required
                autocomplete="current-name"
                v-model="$v.name.$model"
                :state="validateState('name')"
                aria-describedby="input-name-live-feedback"
                placeholder="Enter name"
              />
              <b-form-invalid-feedback
                id="input-name-live-feedback"
              >This is a required field.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                type="email"
                class="form-control"
                name="email"
                required
                autocomplete="current-email"
                v-model="$v.email.$model"
                :state="validateState('email')"
                aria-describedby="input-email-live-feedback"
                placeholder="Enter email"
              />
              <b-form-invalid-feedback
                id="input-email-live-feedback"
              >This is a required field.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Password" label-for="password">
              <b-form-input
                id="password"
                type="password"
                class="form-control"
                name="password"
                required
                autocomplete="current-password"
                v-model="$v.password.$model"
                :state="validateState('password')"
                aria-describedby="input-password-live-feedback"
                placeholder="Enter password"
              />
              <b-form-invalid-feedback
                id="input-password-live-feedback"
              >This is a required field and must be at least {{ $v.password.$params.minLength.min }} characters.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Confirm Password" label-for="password-confirm">
              <b-form-input
                id="password-confirm"
                type="password"
                class="form-control"
                name="password-confirm"
                required
                autocomplete="current-password"
                v-model="$v.passwordConfirm.$model"
                :state="validateState('passwordConfirm')"
                aria-describedby="input-password-confirm-live-feedback"
                placeholder="Confirm password"
              />
              <b-form-invalid-feedback
                id="input-password-confirm-live-feedback"
              >Passwords must match.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label label-for="register" class="mb-0">
              <b-button
                id="register"
                v-on:click="register()"
                class="btn btn-success"
                v-if="!authLoading"
              >Register</b-button>
              <b-button v-else>
                <b-spinner small label="Loading..."></b-spinner>
              </b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { FormPlugin, ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  email,
  sameAs,
  sameAsPassword
} from "vuelidate/lib/validators";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);

export default {
  mixins: [validationMixin],
  name: "Register",
  data() {
    return {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
      authLoading: false
    };
  },
  methods: {
    register() {
      let app = this;
      let errors = app.$v.$invalid;

      if (!errors) {
        app.authLoading = true;
        axios
          .post("/api/register", {
            name: app.name,
            email: app.email,
            password: app.password
          })
          .then(function(response) {
            (app.name = response.data.name),
              (app.email = response.data.email),
              localStorage.setItem("token", response.data.token);
            app.$emit("login");
            app.$router.push("/courses");
          })
          .catch(function(error) {
            app.authLoading = false;
            console.log(error);
          });
      } else {
        app.makeToastError();
      }
    },
    makeToastError(append = false) {
      this.$bvToast.toast(`Validation errors`, {
        title: "Form Error",
        variant: "danger",
        toaster: "b-toaster-bottom-right",
        autoHideDelay: 3000,
        appendToast: append
      });
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    }
  },
  validations: {
    name: {
      required,
      maxLength: maxLength(255)
    },
    email: {
      required,
      email,
      maxLength: maxLength(255)
    },
    password: {
      required,
      minLength: minLength(8)
    },
    passwordConfirm: {
      required,
      sameAsPassword: sameAs('password')
    }
  }
};
</script>

<style>
</style>
