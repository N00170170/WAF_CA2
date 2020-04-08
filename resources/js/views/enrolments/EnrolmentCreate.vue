<template>
  <div>
    <b-row align-h="center" class="page-title">
      <b-col lg="6">
        <b-card class="center-page">
          <b-card-title>
            <span v-if="!editing">Create</span>
            <span v-else>Update</span>
            Enrolment
            <router-link :to="`/enrolments`">
              <b-button class="float-right btn btn-primary">
                <b-icon icon="reply-fill" style="transform: scaleX(-1)"></b-icon>Back
              </b-button>
            </router-link>
          </b-card-title>
          <b-form>
            <b-row>
              <b-col sm="7">
                <b-form-group label="Date" label-for="date">
                  <b-form-datepicker
                    required
                    v-model="$v.enrolment.date.$model"
                    :state="validateState('date')"
                    aria-describedby="input-date-live-feedback"
                  ></b-form-datepicker>
                  <b-form-invalid-feedback id="input-date-live-feedback">This is a required field.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col sm="5">
                <b-form-group label="Time" label-for="time">
                  <b-form-timepicker
                    required
                    v-model="$v.enrolment.time.$model"
                    locale="en"
                    :state="validateState('time')"
                    aria-describedby="input-time-live-feedback"
                  ></b-form-timepicker>
                  <b-form-invalid-feedback id="input-time-live-feedback">This is a required field.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-form-group label="Status" label-for="status">
              <b-form-select
                required
                v-model="$v.enrolment.status.$model"
                :options="statuses"
                :state="validateState('status')"
                aria-describedby="input-status-live-feedback"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Please select a status --</b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback id="input-status-live-feedback">This is a required field.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Course" label-for="course">
              <b-form-select
                required
                v-model="$v.enrolment.course_id.$model"
                :state="validateState('course_id')"
                aria-describedby="input-course-live-feedback"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Please select a course --</b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="course in courses"
                  :key="course.id"
                  :value="course.id"
                >{{ course.title }}</b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback id="input-course-live-feedback">This is a required field.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Lecturer" label-for="lecturer">
              <b-form-select
                required
                v-model="$v.enrolment.lecturer_id.$model"
                :state="validateState('lecturer_id')"
                aria-describedby="input-lecturer-live-feedback"
              >
                <b-form-select-option
                  v-for="lecturer in lecturers"
                  :key="lecturer.id"
                  :value="lecturer.id"
                >{{ lecturer.name }}</b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback id="input-lecturer-live-feedback">This is a required field.</b-form-invalid-feedback>
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
import { required } from "vuelidate/lib/validators";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);

export default {
  mixins: [validationMixin],
  name: "EnrolmentCreate",
  components: {
    LoadingSpinner
  },
  props: {
    enrolment: {
      type: Object,
      default() {
        return {
          date: "",
          time: "",
          status: "",
          course: [],
          lecturer: []
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
      courses: [],
      lecturers: [],
      loaded: false,
      submitting: false,
      statuses: [
        { text: "Interested", value: "interested" },
        { text: "Assigned", value: "assigned" },
        { text: "Associate", value: "associate" },
        { text: "Career Break", value: "career_break" }
      ]
    };
  },
  mounted() {
    let app = this;
    let token = localStorage.getItem("token");

    //check if we are editing a lecturer and set loading to true once it has retrieved the lecturer
    if (this.editing && this.lecturer) {
      this.loaded = true;
    } else {
      this.loaded = true;
    }
    // Get courses
    axios
      .get("/api/courses", {
        headers: { Authorization: "Bearer " + token }
      })
      .then(function(response) {
        app.courses = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });

    //Get lecturers
    axios
      .get("/api/lecturers", {
        headers: { Authorization: "Bearer " + token }
      })
      .then(function(response) {
        app.lecturers = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    submit() {
      let app = this;
      let token = localStorage.getItem("token");
      let errors = app.$v.enrolment.$invalid;

      if (!errors) {
        app.submitting = true;
        if (app.editing) {
          axios
            .put("/api/enrolments/" + app.enrolment.id, app.enrolment, {
              headers: { Authorization: "Bearer " + token }
            })
            .then(response => {
              this.$router.push("/enrolments");
            })
            .catch(err => {
              app.submitting = false;
            });
        } else {
          axios
            .post("/api/enrolments", app.enrolment, {
              headers: { Authorization: "Bearer " + token }
            })
            .then(response => {
              this.$router.push("/enrolments");
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
      const { $dirty, $error } = this.$v.enrolment[name];
      return $dirty ? !$error : null;
    }
  },
  validations: {
    enrolment: {
      date: {
        required
      },
      time: {
        required
      },
      status: {
        required
      },
      course_id: {
        required
      },
      lecturer_id: {
        required
      }
    }
  }
};
</script>

<style>
</style>
