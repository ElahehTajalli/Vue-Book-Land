import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import Login from './components/auth/Login.vue'
import SignUp from './components/auth/SignUp.vue'
import ForgotPassword from './components/auth/ForgotPassword.vue'
import EditInformation from './components/auth/EditInformation.vue'
import Home from './components/Home.vue'
import ViewBook from './components/book/View.vue'
import BookList from './components/book/List.vue'
import MyPosts from './components/post/List.vue'
import ViewPost from './components/post/View.vue'
import ViewUser from './components/UserProfile.vue'
import NotFound from './components/NotFound.vue'
import Profile from './components/Profile.vue'
import Chat from './components/Chat.vue'
import MyLibrary from './components/MyLibrary.vue'
import { store } from '@/store'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/home')
}

const ifAuthenticated = (to, from, next) => {
  const { getters } = store
  const { isAuthenticated } = getters
  if (isAuthenticated) {
    next()
    return
  }
  next('/')
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: NotFound,
      meta: {
        title: 'خطا'
      }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        layout: 'inner',
        title: 'داشبورد'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'داشبورد'
      }
    },
    {
      path: '/book/list',
      name: 'BookList',
      component: BookList,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'کتاب‌ها'
      }
    },
    {
      path: '/book/:id',
      name: 'ViewBook',
      component: ViewBook,
      meta: {
        layout: 'inner',
        title: 'مشاهده کتاب'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'پروفایل'
      }
    },
    {
      path: '/post/list',
      name: 'MyPostsList',
      component: MyPosts,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'پست‌های من'
      }
    },
    {
      path: '/post/:id',
      name: 'ViewPost',
      component: ViewPost,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'مشاهده نقد'
      }
    },
    {
      path: '/library',
      name: 'MyLibrary',
      component: MyLibrary,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'کتابخانه من'
      }
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'چت'
      }
    },
    {
      path: '/chat/:id',
      name: 'ChatID',
      component: Chat,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'چت'
      }
    },
    {
      path: '/user/:id',
      name: 'ViewUser',
      component: ViewUser,
      beforeEnter: ifAuthenticated,
      meta: {
        layout: 'inner',
        title: 'پروفایل کاربر'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifNotAuthenticated,
      meta: {
        title: 'ورود'
      }
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: ifNotAuthenticated,
      meta: {
        title: 'ثبت‌نام'
      }
    },
    {
      path: '/forgotPassword',
      name: 'ForgotPassword',
      component: ForgotPassword,
      beforeEnter: ifNotAuthenticated,
      meta: {
        title: 'فراموشی کلمه‌عبور'
      }
    },
    {
      path: '/users/edit_information',
      name: 'EditInformation',
      component: EditInformation,
      meta: {
        title: 'تکمیل اطلاعات'
      }
    }
  ]
})
