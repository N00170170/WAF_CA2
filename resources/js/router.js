import Vue from 'vue'
import Router from "vue-router"
import Login from "./views/auth/Login.vue"
import Register from "./views/auth/Register.vue"

import CoursesIndex from './views/courses/CoursesIndex.vue'
import CourseCreate from './views/courses/CourseCreate.vue'
import CourseUpdate from './views/courses/CourseUpdate.vue'

import LecturersIndex from './views/lecturers/LecturersIndex.vue'
import LecturerCreate from './views/lecturers/LecturerCreate.vue'
import LecturerUpdate from './views/lecturers/LecturerUpdate.vue'

import EnrolmentsIndex from './views/enrolments/EnrolmentsIndex.vue'
import EnrolmentCreate from './views/enrolments/EnrolmentCreate.vue'
import EnrolmentUpdate from './views/enrolments/EnrolmentUpdate.vue'


Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/register',
        name: 'register',
        component: Register,
      },
      {
        path: '/login',
        name: 'login',
        component: Login,
      },
      {
        path: '/courses',
        name: 'coursesindex',
        component: CoursesIndex,
        meta: {
            depthIndex: 1
        }
      },
      {
        path: '/courses/create',
        name: 'coursecreate',
        component: CourseCreate,
        meta: {
            depthIndex: 1
        }
      },
      {
        path: '/courses/edit/:id',
        name: 'courseupdate',
        component: CourseUpdate,
        meta: {
            depthIndex: 1
        }
      },
      {
        path: '/lecturers',
        name: 'lecturersindex',
        component: LecturersIndex,
        meta: {
            depthIndex: 2
        }
      },
      {
        path: '/lecturers/create',
        name: 'lecturercreate',
        component: LecturerCreate,
        meta: {
            depthIndex: 2
        }
      },
      {
        path: '/lecturers/edit/:id',
        name: 'lecturerupdate',
        component: LecturerUpdate,
        meta: {
            depthIndex: 2
        }
      },
      {
        path: '/enrolments',
        name: 'enrolmentsindex',
        component: EnrolmentsIndex,
        meta: {
            depthIndex: 3
        }
      },
      {
        path: '/enrolments/create',
        name: 'enrolmentcreate',
        component: EnrolmentCreate,
        meta: {
            depthIndex: 3
        }
      },
      {
        path: '/enrolments/edit/:id',
        name: 'enrolmentupdate',
        component: EnrolmentUpdate,
        meta: {
            depthIndex: 3
        }
      },
    ]
  })
