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
      },
      {
        path: '/courses/create',
        name: 'coursecreate',
        component: CourseCreate,
      },
      {
        path: '/courses/edit/:id',
        name: 'courseupdate',
        component: CourseUpdate,
      },
      {
        path: '/lecturers',
        name: 'lecturersindex',
        component: LecturersIndex,
      },
      {
        path: '/lecturers/create',
        name: 'lecturercreate',
        component: LecturerCreate,
      },
      {
        path: '/lecturers/edit/:id',
        name: 'lecturerupdate',
        component: LecturerUpdate,
      },
    ]
  })
