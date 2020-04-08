<template>
  <div>
    <b-row align-h="center page-title">
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
                  <b-form-datepicker v-model="enrolment.date"></b-form-datepicker>
                </b-form-group>
              </b-col>
              <b-col sm="5">
                <b-form-group label="Time" label-for="time">
                  <b-form-timepicker v-model="enrolment.time" locale="en"></b-form-timepicker>
                </b-form-group>
              </b-col>
            </b-row>
            <b-form-group label="Status" label-for="status">
              <b-form-select v-model="enrolment.status" :options="statuses">
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Please select a status --</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>

            <b-form-group label="Course" label-for="course">
              <b-form-select v-model="enrolment.course_id">
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Please select a course --</b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="course in courses"
                  :key="course.id"
                  :value="course.id"
                >{{ course.title }}</b-form-select-option>
              </b-form-select>
            </b-form-group>

            <b-form-group label="Lecturer" label-for="lecturer">
              <b-form-select v-model="enrolment.lecturer_id">
                <b-form-select-option
                  v-for="lecturer in lecturers"
                  :key="lecturer.id"
                  :value="lecturer.id"
                >{{ lecturer.name }}</b-form-select-option>
              </b-form-select>
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

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);

export default {
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
    }
  }
};
</script>

<style>
</style>
