<template>
  <div>
    <h2 class="mb-4 page-title">
      Enrolments
      <b-button to="/enrolments/create" class="float-right btn btn-success">+ New</b-button>
    </h2>
    <b-row>
      <b-col md="12">
        <b-table :fields="fields" :items="enrolments" :busy="isBusy" hover responsive>
          <!-- Loading slot for when table is busy loading data -->
          <template v-slot:table-busy>
            <LoadingSpinner></LoadingSpinner>
          </template>

          <!-- Date slot -->
          <template v-slot:cell(date)="data">{{ dateToString(data.item.date) }}</template>

          <!-- Time slot -->
          <template v-slot:cell(time)="data">{{ timeToString(data.item.time) }}</template>

          <!-- Status slot -->
          <template v-slot:cell(status)="data">
            <span v-if="data.item.status=='interested'">Interested</span>
            <span v-else-if="data.item.status=='assigned'">Assigned</span>
            <span v-else-if="data.item.status=='associate'">Associate</span>
            <span v-else-if="data.item.status=='career_break'">Career Break</span>
          </template>

          <!-- Course slot -->
          <template v-slot:cell(course)="data">{{ data.item.course.title }}</template>

          <!-- Lecturer slot -->
          <template v-slot:cell(lecturer)="data">{{ data.item.lecturer.name }}</template>

          <!-- Actions slot -->
          <template class="text-nowrap" v-slot:cell(actions)="data">
            <div class="text-nowrap">
              <router-link :to="`/enrolments/edit/${data.item.id}`">
                <b-button>
                  <b-icon icon="pencil"></b-icon>
                </b-button>
              </router-link>
              <b-button
                v-on:click="confirmDelete(data.item, data.index)"
                class="btn btn-danger"
                v-if="data.index!==enrolmentIndexCheck"
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

    <b-modal ref="confirm-delete" id="confirm-delete" hide-footer title="Warning">
      <p class="d-block">Are you sure you want to permanently delete this enrolment?</p>
      <b-button @click="hideModals">Cancel</b-button>
      <b-button @click="deleteEnrolment()" class="btn btn-danger" v-if="!deleting">Yes</b-button>
      <b-button class="btn btn-danger disabled" v-else>
        <b-spinner small label="Loading..."></b-spinner>
      </b-button>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import moment from "moment";
import { ModalPlugin, ButtonPlugin, SpinnerPlugin } from "bootstrap-vue";
import LoadingSpinner from "../../components/LoadingSpinner.vue";

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(ModalPlugin);

export default {
  name: "EnrolmentsIndex",
  components: {
    LoadingSpinner,
    ModalPlugin
  },
  data() {
    return {
      email: "",
      name: "",
      password: "",
      enrolments: null,
      enrolment: [],
      enrolmentIndex: "",
      deleting: false,
      enrolmentIndexCheck: null,
      isBusy: false,
      fields: ["date", "time", "status", "course", "lecturer", "actions"]
    };
  },
  mounted() {
    let app = this;
    let token = localStorage.getItem("token");
    app.isBusy = true;
    axios
      .get("/api/enrolments", {
        headers: { Authorization: "Bearer " + token }
      })
      .then(function(response) {
        app.enrolments = response.data.data;
        app.isBusy = false;
      })
      .catch(function(error) {
        console.log(error);
        app.isBusy = false;
      });
  },
  methods: {
    confirmDelete(enrolment, enrolmentIndex) {
      let app = this;
      app.enrolment = enrolment;
      app.enrolmentIndex = enrolmentIndex;
      app.$bvModal.show("confirm-delete");
    },
    deleteEnrolment() {
      let app = this;
      let token = localStorage.getItem("token");
      app.deleting = true;

      axios
        .delete("/api/enrolments/" + app.enrolment.id, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(function(response) {
          app.hideModals();
          app.deleting = false;
          app.$delete(app.enrolments, app.enrolmentIndex);
          app.enrolmentIndex = null;
        })
        .catch(function(error) {
          console.log(error);
          app.deleting = false;
          app.enrolmentIndex = null;
        });
    },
    //hide modals
    hideModals() {
      let app = this;
      app.$bvModal.hide("confirm-delete");
    },
    //convert date into friendlier format
    dateToString(date) {
      return new Date(date).toDateString();
    },
    //convert time into friendlier format
    timeToString(time) {
      var parsedTime = moment(time, "HH:mm:ss"); //parse time into timestamp
      return moment(parsedTime).format("h:mm A"); //format timestamp to custom format
    }
  }
};
</script>

<style>
</style>
