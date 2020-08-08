import VueRouter from 'vue-router'

export const routes = [
  {
    path: '/',
    component: () => import('./components/WebGL/AppUIs/Landing/LandingPage.vue')
  },
  {
    path: '/lessons/js-basics',
    component: () => import('./components/WebGL/AppUIs/Shared/CourseLayout.vue'),
    children: [
      {
        path: 'varaibles',
        name: 'Variables',
        component: () => import('./components/WebGL/AppUIs/CourseDetailForJSBasics/L01Variables.vue')
      }
    ]
  },
  {
    path: '/course',
    component: () => import('./components/WebGL/AppUIs/Shared/CourseLayout.vue'),
    children: [
      {
        path: '',
        name: 'Course Catalogue',
        component: () => import('./components/WebGL/AppUIs/CourseIntro/CourseCatalogue.vue')
      },
      {
        path: 'javascript-basics',
        name: 'JavaScript Basics',
        inProgress: true,
        component: () => import('./components/WebGL/AppUIs/CourseIntro/JSBasics.vue')
      },
      {
        path: 'es6-basics',
        name: 'ES6 Basics',
        inProgress: true,

        component: () => import('./components/WebGL/AppUIs/CourseIntro/JSBasics.vue')
      },
      {
        path: 'dom-basics',
        name: 'Document Object Model (DOM)',
        inProgress: true,

        component: () => import('./components/WebGL/AppUIs/CourseIntro/JSBasics.vue')
      },
      {
        path: 'canavs-basics',
        name: 'Canvas 2D Basics',
        inProgress: true,

        component: () => import('./components/WebGL/AppUIs/CourseIntro/JSBasics.vue')
      },
      {
        path: 'webgl-basics',
        name: 'WebGL Concept Basics',
        inProgress: true,

        component: () => import('./components/WebGL/AppUIs/CourseIntro/JSBasics.vue')
      },
      {
        path: 'threejs-basics',
        name: 'ThreeJS Basics',
        inProgress: true,

        component: () => import('./components/WebGL/AppUIs/CourseIntro/JSBasics.vue')
      },
      {
        path: 'threejs-intermediate',
        name: 'ThreeJS Intermediate',
        inProgress: true,

        component: () => import('./components/WebGL/AppUIs/CourseIntro/JSBasics.vue')
      },
      {
        path: 'threejs-advanced',
        name: 'ThreeJS Advanced',
        inProgress: true,

        component: () => import('./components/WebGL/AppUIs/CourseIntro/JSBasics.vue')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes
})
