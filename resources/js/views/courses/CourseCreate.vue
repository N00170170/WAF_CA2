<template>
  <div>
    <b-row align-h="center" class="page-title">
      <b-col md="6">
        <b-card class="center-page">
          <b-card-title>
            <!-- Check if we are editing -->
            <span v-if="!editing">Create</span> 
            <span v-else>Update</span>
            Course
            <router-link :to="`/courses`">
              <b-button class="float-right btn btn-primary">
                <b-icon icon="reply-fill" style="transform: scaleX(-1)"></b-icon>Back
              </b-button>
            </router-link>
          </b-card-title>
          <b-form>
            <b-form-group label="Title" label-for="title">
              <b-form-input
                id="title"
                type="text"
                class="form-control"
                name="title"
                required
                autocomplete="current-title"
                v-model="$v.course.title.$model"
                :state="validateState('title')"
                aria-describedby="input-title-live-feedback"
                placeholder="Enter title"
              />
              <b-form-invalid-feedback
                id="input-title-live-feedback"
              >This is a required field and cannot be longer than {{ $v.course.title.$params.maxLength.max }} characters.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Code" label-for="code">
              <b-form-input
                id="code"
                type="text"
                class="form-control"
                name="code"
                required
                autocomplete="current-code"
                v-model="$v.course.code.$model"
                :state="validateState('code')"
                aria-describedby="input-code-live-feedback"
                placeholder="Enter code"
              />
              <b-form-invalid-feedback
                id="input-code-live-feedback"
              >This is a required field and cannot be longer than {{ $v.course.code.$params.maxLength.max }} characters.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Description" label-for="description">
              <b-form-textarea
                id="description"
                class="form-control"
                name="description"
                required
                autocomplete="current-description"
                v-model="$v.course.description.$model"
                :state="validateState('description')"
                aria-describedby="input-description-live-feedback"
                placeholder="Enter description"
                rows="4"
              ></b-form-textarea>
              <b-form-invalid-feedback
                id="input-description-live-feedback"
              >This is a required field.</b-form-invalid-feedback>
            </b-form-group>

            <b-row>
              <b-col sm="6">
                <b-form-group label="Points" label-for="points">
                  <b-form-input
                    id="points"
                    type="number"
                    class="form-control"
                    name="points"
                    required
                    autocomplete="current-points"
                    v-model="$v.course.points.$model"
                    :state="validateState('points')"
                    aria-describedby="input-points-live-feedback"
                    placeholder="Enter points"
                  />
                  <b-form-invalid-feedback
                    id="input-points-live-feedback"
                  >This is a required field and must be between {{ $v.course.points.$params.minValue.min }}-{{ $v.course.points.$params.maxValue.max }} points.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>

              <b-col sm="6">
                <b-form-group label="Level" label-for="level">
                  <b-form-input
                    id="level"
                    type="number"
                    class="form-control"
                    name="level"
                    required
                    autocomplete="current-level"
                    v-model="$v.course.level.$model"
                    :state="validateState('level')"
                    aria-describedby="input-level-live-feedback"
                    placeholder="Enter level"
                  />
                   <b-form-invalid-feedback
                    id="input-level-live-feedback"
                  >This is a required field and must be between {{ $v.course.level.$params.minValue.min }}-{{ $v.course.level.$params.maxValue.max }}.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

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
  maxValue
} from "vuelidate/lib/validators";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);

export default {
  mixins: [validationMixin],
  name: "CourseCreate",
  components: {
    LoadingSpinner
  },
  props: {
    course: {
      type: Object,
      default() {
        return {
          title: "",
          code: null,
          description: "",
          points: "",
          level: ""
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
    //check if we are editing a course and set loading to true once it has retrieved the course
    if (this.editing && this.course) {
      this.loaded = true;
    } else {
      this.loaded = true;
    }
  },
  methods: {
    submit() {
      let app = this;
      let token = localStorage.getItem("token");
      let errors = app.$v.course.$invalid;
      
      //if no validation errors, make axios request
      if (!errors) {
        app.submitting = true;
        if (app.editing) {
          axios
            .put("/api/courses/" + app.course.id, app.course, {
              headers: { Authorization: "Bearer " + token }
            })
            .then(response => {
              this.$router.push("/courses");
            })
            .catch(err => {
              app.submitting = false;
            });
        } else {
          axios
            .post("/api/courses", app.course, {
              headers: { Authorization: "Bearer " + token }
            })
            .then(response => {
              this.$router.push("/courses");
            })
            .catch(err => {
              app.submitting = false;
            });
        }
      } else {
        app.makeToastError();
      }
    },
    //display toast to notify of validation errors
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
      const { $dirty, $error } = this.$v.course[name];
      return $dirty ? !$error : null;
    }
  },
  // validation rules
  validations: {
    course: {
      title: {
        required,
        maxLength: maxLength(50)
      },
      code: {
        required,
        maxLength: maxLength(5)
      },
      description: {
        required
      },
      points: {
        required,
        minValue: minValue(100),
        maxValue: maxValue(600)
      },
      level: {
        required,
        minValue: minValue(7),
        maxValue: maxValue(10)
      }
    }
  }
};
</script>

<style>
</style>
