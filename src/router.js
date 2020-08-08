import VueRouter from 'vue-router'
var path = require('path')
function importAll (r) {
  let array = []
  r.keys().forEach(key => {
    let filename = path.basename(key).replace('.vue', '')
    let config = {
      name: filename,
      path: filename,
      component: () => new Promise((resolve) => {
        r(key).then((mod) => {
          resolve(mod.default)
        })
      })
    }
    array.push(config)
  })
  return array.filter(e => e.path.indexOf('LessonBar') === -1)
}
let jsbasics = importAll(require.context('./components/WebGL/AppUIs/CourseForJSBasics', true, /\.vue$/, 'lazy'), 'lazy')

console.log(jsbasics)
export const routes = [
  {
    path: '/',
    component: () => import('./components/WebGL/AppUIs/Landing/LandingPage.vue')
  },
  {
    path: '/lessons/js-basics',
    component: () => import('./components/WebGL/AppUIs/Shared/LessonLayout.vue'),
    children: [
      {
        path: '',
        redirect: `./${jsbasics[0].path}`,
      },
      ...jsbasics
      // {
      //   path: 'varaibles',
      //   name: 'Variables',
      //   component: () => import('./components/WebGL/AppUIs/CourseDetailForJSBasics/L01Variables.vue')
      // },
      // {
      //   path: 'types',
      //   name: 'Types',
      //   component: () => import('./components/WebGL/AppUIs/CourseDetailForJSBasics/L02Types.vue')
      // }
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
        to: '/lessons/js-basics',
        inProgress: false,
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
