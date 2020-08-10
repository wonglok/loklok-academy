import VueRouter from 'vue-router'

export let courses = []

var path = require('path')
function loadCourse (courseName, prefix, rCtx) {
  let lessonsRaw = []
  rCtx.keys().forEach(key => {
    let filename = path.basename(key).replace('.vue', '')
    let config = {
      name: filename,
      meta: {
        courseName,
        prefix,
      },
      path: `${prefix}/${filename}`,
      component: () => new Promise((resolve) => {
        rCtx(key).then((mod) => {
          resolve(mod.default)
        })
      })
    }
    lessonsRaw.push(config)
  })
  let lessons = lessonsRaw.filter(e => e.path.indexOf('LessonBar') === -1)
  let oneCourse = {
    meta: {
      courseName,
      prefix
    },
    path: prefix,
    name: courseName,
    component: () => import('./components/WebGL/AppUIs/Shared/LessonLayout.vue'),
    children: [
      {
        path: prefix,
        redirect: `${lessons[0] && lessons[0].path}`,
      },
      ...lessons
    ]
  }
  courses.push(oneCourse)
  return oneCourse
}

let cfgs = [
  {
    name: 'JavaScript Basics',
    path: '/lessons/js-basics',
    rCTX: require.context('./components/WebGL/AppUIs/CourseForJSBasics', true, /\.vue$/, 'lazy')
  },
  {
    name: 'JavaScript ES6',
    path: '/lessons/es6-basics',
    rCTX: require.context('./components/WebGL/AppUIs/CourseForES6', true, /\.vue$/, 'lazy')
  },
  {
    name: 'JavaScript DOM',
    path: '/lessons/dom-basics',
    rCTX: require.context('./components/WebGL/AppUIs/CourseForDOM', true, /\.vue$/, 'lazy')
  },
  {
    name: 'Canvas 2D Basics',
    path: '/lessons/canvas-2d-basics',
    rCTX: require.context('./components/WebGL/AppUIs/CourseForCanvas2D', true, /\.vue$/, 'lazy')
  },
  {
    name: 'WebGL Raw API Basics',
    path: '/lessons/webgl-basics',
    rCTX: require.context('./components/WebGL/AppUIs/CourseForWebGLConcept', true, /\.vue$/, 'lazy')
  },
  {
    name: 'ThreeJS Basics',
    path: '/lessons/threejs-basics',
    rCTX: require.context('./components/WebGL/AppUIs/CourseForTHREEJsBasics', true, /\.vue$/, 'lazy')
  },
  {
    name: 'ThreeJS Intermediate',
    path: '/lessons/threejs-intermediate',
    rCTX: require.context('./components/WebGL/AppUIs/CourseForTHREEJsIntermediate', true, /\.vue$/, 'lazy')
  },
  {
    name: 'ThreeJS Advanced',
    path: '/lessons/threejs-advanced',
    rCTX: require.context('./components/WebGL/AppUIs/CourseForTHREEJsAdvanced', true, /\.vue$/, 'lazy')
  }
]

cfgs.forEach(({ name, path, rCTX }) => {
  loadCourse(
    name,
    path,
    rCTX
  )
})

export const getLessons = () => {
  let oneCourse = courses.find(c => c.meta.prefix === router.currentRoute.meta.prefix)
  let lessons = []
  if (oneCourse) {
    lessons = oneCourse.children.filter(e => !e.redirect)
      .map(e => {
        let newItem = JSON.parse(JSON.stringify(e))
        newItem.name = newItem.name.slice(3, newItem.name.length)
        return newItem
      })
  }
  return lessons
}

export const routes = [
  {
    path: '/',
    component: () => import('./components/WebGL/AppUIs/Landing/LandingPage.vue')
  },
  ...courses,
  {
    path: '/course-catalogue',
    name: 'Course Catalogue',
    component: () => import('./components/WebGL/AppUIs/CourseCatalogue/CourseCatalogue.vue')
  },
  {
    path: '*',
    component: () => import('./components/WebGL/AppUIs/Shared/E404.vue')
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPos) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPos) {
          resolve(savedPos)
        } else {
          resolve({ x: 0, y: 0 })
        }
      }, 1)
    })
  }
})
