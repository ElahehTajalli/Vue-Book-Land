<template>
  <div class="user-profile my-library" v-loading.fullscreen.lock="loading">
    <div class="my-plan-title" v-if="favorites.length">
      <span>{{ $t('favorites') }}</span>
    </div>
    <div class="favorite" v-if="favorites.length">
      <Swiper :books="favorites" :fromProfile="true" title="favorites" />
    </div>
    <div class="my-plan-title" v-if="wantsToRead.length">
      <span>{{ $t('want_to_read') }}</span>
    </div>
    <div class="wants-to-read-swiper" v-if="wantsToRead.length">
      <Swiper :books="wantsToRead" :fromProfile="true" title="want_to_read" />
    </div>
    <div class="my-plan-title" v-if="read.length">
      <span>{{ $t('read') }}</span>
    </div>
    <div class="read-swiper" v-if="read.length">
      <Swiper :books="read" :fromProfile="true" title="read" />
    </div>
    <div class="my-plan-title" v-if="reading.length">
      <span>{{ $t('currently_reading') }}</span>
    </div>
    <div class="reading-swiper" v-if="reading.length">
      <Swiper :books="reading" :fromProfile="true" title="currently_reading" />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Swiper from '@/components/Swiper'

  export default {
    data() {
      return {
        read: [],
        reading: [],
        wantsToRead: [],
        favorites: [],
        loading: false
      }
    },
    async created() {
      if (this.self) {
        await this.getPlan()
        await this.getFavorite()
      }
    },
    computed: {
      ...mapGetters(['self'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      getPlan(title) {
        this.loading = true
        this.handleRequest({
          name: 'books/getPlan',
          action: 'getAll',
          data: {
            query: {
              user: this.self.id,
              title
            }
          }
        }).then((res) => {
          this.read = res.data.plan.read
          this.reading = res.data.plan.reading
          this.wantsToRead = res.data.plan.wants_to_read
        })
      },
      getFavorite() {
        this.handleRequest({
          name: 'books/getFavorite',
          action: 'getAll',
          data: {
            query: {
              user: this.self.id
            }
          }
        })
          .then((res) => {
            this.favorites = res.data.favorite
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    watch: {
      async self() {
        await this.getPlan()
        await this.getFavorite()
      }
    },
    components: {
      Swiper
    }
  }
</script>
