<template>
  <div>
      <h2 class="mb-4 page-title">
        Lecturers
        <b-button to="/lecturers/create" class="float-right btn btn-success">+ New</b-button>
      </h2>
    <b-row>
      <b-col md="12">
        <b-table :fields="fields" :items="lecturers" :busy="isBusy" hover responsive>
          <!-- Loading slot for when table is busy loading data -->
          <template v-slot:table-busy>
            <LoadingSpinner></LoadingSpinner>
          </template>

          <!-- Actions slot -->
          <template class="text-nowrap" v-slot:cell(actions)="data">
            <div class="text-nowrap">
              <router-link :to="`/lecturers/edit/${data.item.id}`">
                <b-button>
                  <b-icon icon="pencil"></b-icon>
                </b-button>
              </router-link>
              <b-button
                v-on:click="checkForEnrolments(data.item.id, data.index)"
                class="btn btn-danger"
                v-if="data.index!==lecturerIndexCheck"
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
      <p class="d-block">This lecturer has enrolments, deleting it will also delete it's enrolments.</p>
      <p>Are you sure you want to continue?</p>
      <b-button @click="hideModals">Cancel</b-button>
      <b-button @click="deleteEnrolments()" class="btn btn-danger" v-if="!deleting">Yes</b-button>
      <b-button class="btn btn-danger disabled" v-else>
        <b-spinner small label="Loading..."></b-spinner>
      </b-button>
    </b-modal>

    <b-modal ref="no-enrolments" id="no-enrolments" hide-footer title="Warning">
      <p class="d-block">Are you sure you want to permanently delete this lecturer?</p>
      <b-button @click="hideModals">Cancel</b-button>
      <b-button @click="deleteLecturer()" class="btn btn-danger" v-if="!deleting">Yes</b-button>
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
  name: "LecturersIndex",
  components: {
    LoadingSpinner,
    ModalPlugin
  },
  data() {
    return {
      email: "",
      name: "",
      password: "",
      lecturers: null,
      lecturer: [],
      lecturerIndex: "",
      deleting: false,
      lecturerIndexCheck: null,
      isBusy: false,
      fields: ["name", "address", "email", "phone", "actions"]
    };
  },
  mounted() {
    let app = this;
    let token = localStorage.getItem("token");
    app.isBusy = true;
    axios
      .get("/api/lecturers", {
        headers: { Authorization: "Bearer " + token }
      })
      .then(function(response) {
        app.lecturers = response.data.data;
        app.isBusy = false;
      })
      .catch(function(error) {
        console.log(error);
        app.isBusy = false;
      });
  },
  methods: {
    checkForEnrolments(lecturerid, index) {
      let app = this;
      let token = localStorage.getItem("token");
      app.lecturerIndexCheck = index;
      app.lecturerIndex = index;
      axios
        .get("/api/lecturers/" + lecturerid, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(function(response) {
          app.lecturer = response.data.data;
          if (!app.lecturer.enrolments.length == 0) {
            app.$bvModal.show("has-enrolments");
          } else {
            app.$bvModal.show("no-enrolments");
          }
          app.lecturerIndexCheck = null;
        })
        .catch(function(error) {
          console.log(error);
          app.lecturerIndexCheck = null;
        });
    },
    deleteEnrolments() {
      let app = this;
      let token = localStorage.getItem("token");
      app.deleting = true;
      //map through array and add unhandled axios.delete() request for each item in array
      let listOfDeleteRequests = app.lecturer.enrolments.map((current, index) =>
        axios.delete("/api/enrolments/" + current.id, {
          headers: { Authorization: "Bearer " + token }
        })
      );

      console.log(listOfDeleteRequests);

      axios.all(listOfDeleteRequests).then(function(response) {
        axios
          .delete("/api/lecturers/" + app.lecturer.id, {
            headers: { Authorization: "Bearer " + token }
          })
          .then(function(response) {
            app.hideModals();
            app.deleting = false;
            app.$delete(app.lecturers, app.lecturerIndex);
            app.lecturerIndex = null;
          })
          .catch(function(error) {
            console.log(error);
            app.deleting = false;
            app.lecturerIndex = null;
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
    deleteLecturer() {
      let app = this;
      let token = localStorage.getItem("token");
      app.deleting = true;

      axios
        .delete("/api/lecturers/" + app.lecturer.id, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(function(response) {
          app.hideModals();
          app.deleting = false;
          app.$delete(app.lecturers, app.lecturerIndex);
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
};
</script>

<style>
</style>
