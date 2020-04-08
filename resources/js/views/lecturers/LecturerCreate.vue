<template>
  <div>
    <b-row align-h="center" class="page-title">
      <b-col md="6">
        <b-card class="cent">
          <b-card-title>
            <span v-if="!editing">Create</span>
            <span v-else>Update</span>
            Lecturer
            <router-link :to="`/lecturers`">
              <b-button class="float-right btn btn-primary">
                <b-icon icon="reply-fill" style="transform: scaleX(-1)"></b-icon>Back
              </b-button>
            </router-link>
          </b-card-title>
          <b-form>
            <b-form-group label="Name" label-for="name">
              <b-form-input
                id="name"
                type="text"
                class="form-control"
                name="name"
                required
                autocomplete="current-name"
                v-model="$v.lecturer.name.$model"
                :state="validateState('name')"
                aria-describedby="input-name-live-feedback"
                placeholder="Enter name"
              />
              <b-form-invalid-feedback
                id="input-name-live-feedback"
              >This is a required field and cannot be longer than {{ $v.lecturer.name.$params.maxLength.max }} characters.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Address" label-for="address">
              <b-form-input
                id="address"
                type="text"
                class="form-control"
                name="address"
                required
                autocomplete="current-address"
                v-model="$v.lecturer.address.$model"
                :state="validateState('address')"
                aria-describedby="input-address-live-feedback"
                placeholder="Enter address"
              />
              <b-form-invalid-feedback
                id="input-address-live-feedback"
              >This is a required field and cannot be longer than {{ $v.lecturer.address.$params.maxLength.max }} characters.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                type="email"
                class="form-control"
                name="email"
                required
                autocomplete="current-email"
                v-model="$v.lecturer.email.$model"
                :state="validateState('email')"
                aria-describedby="input-email-live-feedback"
                placeholder="Enter email"
              />
              <b-form-invalid-feedback
                id="input-email-live-feedback"
              >This is a required field and cannot be longer than {{ $v.lecturer.email.$params.maxLength.max }} characters.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Phone" label-for="phone">
              <b-form-input
                id="phone"
                type="text"
                class="form-control"
                name="phone"
                required
                autocomplete="current-phone"
                v-model="$v.lecturer.phone.$model"
                :state="validateState('phone')"
                aria-describedby="input-phone-live-feedback"
                placeholder="Enter phone"
              />
              <b-form-invalid-feedback
                id="input-phone-live-feedback"
              >This is a required field and cannot be longer than {{ $v.lecturer.phone.$params.maxLength.max }} characters.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label label-for="submit" class="mb-0">
              <b-button
                id="submit"
                v-on:click="submit()"
                v-if="!submitting"
                class="btn btn-success"
              >
                <span v-if="editing">Update</span>
                <span v-else>Create</span>
              </b-button>
              <b-button v-else class="btn btn-info">
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
import LoadingSpinner from "../../components/LoadingSpinner.vue";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minValue,
  maxValue,
  email
} from "vuelidate/lib/validators";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);

export default {
  mixins: [validationMixin],
  name: "LecturerCreate",
  components: {
    LoadingSpinner
  },
  props: {
    lecturer: {
      type: Object,
      default() {
        return {
          name: "",
          address: "",
          email: "",
          phone: ""
        };
      }
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: "",
      name: "",
      loaded: false,
      submitting: false
    };
  },
  mounted() {
    //check if we are editing a lecturer and set loading to true once it has retrieved the lecturer
    if (this.editing && this.lecturer) {
      this.loaded = true;
    } else {
      this.loaded = true;
    }
  },
  methods: {
    submit() {
      let app = this;
      let token = localStorage.getItem("token");
      let errors = app.$v.lecturer.$invalid;

      if (!errors) {
        app.submitting = true;
        if (app.editing) {
          axios
            .put("/api/lecturers/" + app.lecturer.id, app.lecturer, {
              headers: { Authorization: "Bearer " + token }
            })
            .then(response => {
              this.$router.push("/lecturers");
            })
            .catch(err => {
              app.submitting = false;
            });
        } else {
          axios
            .post("/api/lecturers", app.lecturer, {
              headers: { Authorization: "Bearer " + token }
            })
            .then(response => {
              this.$router.push("/lecturers");
            })
            .catch(err => {
              app.submitting = false;
            });
        }
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
      const { $dirty, $error } = this.$v.lecturer[name];
      return $dirty ? !$error : null;
    }
  },
  validations: {
    lecturer: {
      name: {
        required,
        maxLength: maxLength(50)
      },
      address: {
        required,
        maxLength: maxLength(100)
      },
      phone: {
        required,
        maxLength: maxLength(20)
      },
      email: {
        required,
        email,
        maxLength: maxLength(50)
      }
    }
  }
};
</script>

<style>
</style>
