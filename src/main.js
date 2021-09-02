import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import Inner from './layouts/Inner'
import Outer from './layouts/Outer'
import VueI18n from 'vue-i18n'
import Loading from './mixins/Loading'
import Sessions from './mixins/Sessions'
import Numbers from './mixins/Numbers'
import Timezone from './mixins/Timezone'
import Forms from './mixins/Forms'
import router from './router'
import { store } from './store'
import locale from './locale/element/lang/fa.js'
import { messages } from './locale/index.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import SwiperCore, { Navigation, Pagination } from 'swiper/core'
import '@/assets/icons/style.css'
import 'swiper/swiper.scss'
import 'swiper/swiper-bundle.css'
import 'swiper/components/pagination/pagination.min.css'
import 'swiper/components/navigation/navigation.min.css'

Vue.config.productionTip = false
SwiperCore.use([Navigation, Pagination])

Vue.component('inner-layout', Inner)
Vue.component('outer-layout', Outer)
Vue.use(VueI18n)
Vue.use(ElementUI, { locale })
Vue.use(VueAwesomeSwiper)
Vue.mixin(Loading)
Vue.mixin(Sessions)
Vue.mixin(Numbers)
Vue.mixin(Timezone)
Vue.mixin(Forms)

const i18n = new VueI18n({
  locale: 'fa',
  messages
})

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
