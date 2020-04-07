<template>
  <div>
      <h2 class="mb-4 page-title">
        Courses
        <b-button to="/courses/create" class="float-right btn btn-success">+ New</b-button>
      </h2>
    <b-row>
      <b-col md="12">
        <b-table :fields="fields" :items="courses" :busy="isBusy" hover responsive>
          <!-- Loading slot for when table is busy loading data -->
          <template v-slot:table-busy>
            <LoadingSpinner></LoadingSpinner>
          </template>

          <!-- Actions slot -->
          <template class="text-nowrap" v-slot:cell(actions)="data">
            <div class="text-nowrap">
              <router-link :to="`/courses/edit/${data.item.id}`">
                <b-button>
                  <b-icon icon="pencil"></b-icon>
                </b-button>
              </router-link>
              <b-button
                v-on:click="checkForEnrolments(data.item.id, data.index)"
                class="btn btn-danger"
                v-if="data.index!==courseIndexCheck"
              >
                <b-icon icon="trash-fill"></b-icon>
              </b-button>
              <b-button class="btn btn-danger" v-else>
                <b-spinner small label="Loading..."></b-spinner>
              </b-button>
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-modal
      ref="has-enrolments"
      id="has-enrolments"
      hide-footer
      class="modal-backdrop"
      modal-backdrop
      title="Warning"
    >
      <p class="d-block">This course has enrolments, deleting it will also delete it's enrolments.</p>
      <p>Are you sure you want to continue?</p>
      <b-button @click="hideModals">Cancel</b-button>
      <b-button @click="deleteEnrolments()" class="btn btn-danger" v-if="!deleting">Yes</b-button>
      <b-button class="btn btn-danger disabled" v-else>
        <b-spinner small label="Loading..."></b-spinner>
      </b-button>
    </b-modal>

    <b-modal ref="no-enrolments" id="no-enrolments" hide-footer title="Warning">
      <p class="d-block">Are you sure you want to permanently delete this course?</p>
      <b-button @click="hideModals">Cancel</b-button>
      <b-button @click="deleteCourse()" class="btn btn-danger" v-if="!deleting">Yes</b-button>
      <b-button class="btn btn-danger disabled" v-else>
        <b-spinner small label="Loading..."></b-spinner>
      </b-button>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import { ModalPlugin, ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";
import LoadingSpinner from "../../components/LoadingSpinner.vue";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(ModalPlugin);

export default {
  name: "login",
  components: {
    LoadingSpinner,
    ModalPlugin
  },
  data() {
    return {
      email: "",
      name: "",
      password: "",
      courses: null,
      course: [],
      courseIndex: "",
      deleting: false,
      courseIndexCheck: null,
      isBusy: false,
      fields: ["title", "code", "description", "points", "level", "actions"]
    };
  },
  mounted() {
    let app = this;
    let token = localStorage.getItem("token");
    app.isBusy = true;
    axios
      .get("/api/courses", {
        headers: { Authorization: "Bearer " + token }
      })
      .then(function(response) {
        app.courses = response.data.data;
        app.isBusy = false;
      })
      .catch(function(error) {
        console.log(error);
        app.isBusy = false;
      });
  },
  methods: {
    checkForEnrolments(courseid, index) {
      let app = this;
      let token = localStorage.getItem("token");
      app.courseIndexCheck = index;
      app.courseIndex = index;
      axios
        .get("/api/courses/" + courseid, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(function(response) {
          app.course = response.data.data;
          if (!app.course.enrolments.length == 0) {
            app.$bvModal.show("has-enrolments");
          } else {
            app.$bvModal.show("no-enrolments");
          }
          app.courseIndexCheck = null;
          //   app.courseIndex = null;
        })
        .catch(function(error) {
          console.log(error);
          app.courseIndexCheck = null;
          //   app.courseIndex = null;
        });
    },
    deleteEnrolments() {
      let app = this;
      let token = localStorage.getItem("token");
      app.deleting = true;
      //map through array and add unhandled axios.delete() request for each item in array
      let listOfDeleteRequests = app.course.enrolments.map((current, index) =>
        axios.delete("/api/enrolments/" + current.id, {
          headers: { Authorization: "Bearer " + token }
        })
      );

      console.log(listOfDeleteRequests);

      axios.all(listOfDeleteRequests).then(function(response) {
        axios
          .delete("/api/courses/" + app.course.id, {
            headers: { Authorization: "Bearer " + token }
          })
          .then(function(response) {
            app.hideModals();
            app.deleting = false;
            app.$delete(app.courses, app.courseIndex);
            app.courseIndex = null;
          })
          .catch(function(error) {
            console.log(error);
            app.deleting = false;
            app.courseIndex = null;
          });
      });

      //   for (let i = 0; i < app.course.enrolments.length; i++) {
      //     axios
      //       .delete("/api/enrolments/" + app.course.enrolments[i].id, {
      //         headers: { Authorization: "Bearer " + token }
      //       })
      //       .then(function(response){
      //           console.log(i)
      //       })
      //       .catch(function(error) {
      //         console.log(error);
      //       });
      //   }
      //   axios
      //     .delete("/api/courses/" + app.course.id, {
      //       headers: { Authorization: "Bearer " + token }
      //     })
      //     .then(function(response) {
      //       app.hideModals();
      //       app.$delete(app.courses, app.courseIndex);
      //     })
      //     .catch(function(error) {
      //       console.log(error);
      //     });
    },
    deleteCourse() {
      let app = this;
      let token = localStorage.getItem("token");
      app.deleting = true;

      axios
        .delete("/api/courses/" + app.course.id, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(function(response) {
          app.hideModals();
          app.deleting = false;
          app.$delete(app.courses, app.courseIndex);
        })
        .catch(function(error) {
          app.deleting = false;
          console.log(error);
        });
    },
    hideModals() {
      let app = this;
      app.$bvModal.hide("has-enrolments");
      app.$bvModal.hide("no-enrolments");
    }
  }
  //   computed: {
  //     ...mapState({
  //       authLoading: state => state.auth.status === "loading"
  //     })
  //   }
};
</script>

<style>
.page-title{
  padding-top: 20px;  
}
</style>
