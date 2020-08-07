import VueRouter from 'vue-router'

export const routes = [
  {
    path: '/',
    component: () => import('./components/WebGL/AppUIs/Landing/LandingPage.vue')
  },
  {
    path: '/course',
    component: () => import('./components/WebGL/AppUIs/Shared/CourseLayout.vue'),
    children: [
      {
        path: '',
        name: 'Course Catalogue',
        component: () => import('./components/WebGL/AppUIs/Course/CourseCatalogue.vue')
      },
      {
        path: '/javascript-basics',
        name: 'JavaScript Basics',
        component: () => import('./components/WebGL/AppUIs/Course/JSBasics.vue')
      },
      {
        path: '/es6-basics',
        name: 'ES6 Basics',
        component: () => import('./components/WebGL/AppUIs/Course/JSBasics.vue')
      },
      {
        path: '/canavs-basics',
        name: 'Canvas 2D Basics',
        component: () => import('./components/WebGL/AppUIs/Course/JSBasics.vue')
      },
      {
        path: '/webgl-basics',
        name: 'WebGL Concept Basics',
        component: () => import('./components/WebGL/AppUIs/Course/JSBasics.vue')
      },
      {
        path: '/threejs-basics',
        name: 'ThreeJS Basics',
        component: () => import('./components/WebGL/AppUIs/Course/JSBasics.vue')
      },
      {
        path: '/threejs-intermediate',
        name: 'ThreeJS InterMediate',
        component: () => import('./components/WebGL/AppUIs/Course/JSBasics.vue')
      }
    ]
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes
})
