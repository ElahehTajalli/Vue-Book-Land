<template>
  <div class="view-book" v-loading.fullscreen.lock="loading">
    <div
      class="post flexbox column-direction align-center"
      v-if="posts.length && isFinished"
    >
      <div class="criticisms-title">
        <span>{{ $t('my_criticisms') }}</span>
      </div>
      <Criticism v-for="p in posts" :key="p.id" :post="p" :isMyPosts="true" />
    </div>
    <div v-else-if="isFinished" class="not-found">
      <img src="../../assets/images/notfound1.svg" />
      <span>
        {{ $t('not_found', { word: $t('error.post') }) }}
      </span>
      <router-link
        :to="{ name: `${isAuthenticated ? 'Home' : 'Dashboard'}` }"
        class="link"
      >
        {{ $t('go_to_dashboard') }}
      </router-link>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Criticism from '@/components/post/Criticism'
  export default {
    data() {
      return {
        posts: [],
        loading: false,
        isFinished: false
      }
    },
    created() {
      if (this.self) {
        this.getPosts()
      }
    },
    computed: {
      ...mapGetters(['self', 'isAuthenticated'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      getPosts() {
        this.loading = true
        this.isFinished = false
        this.handleRequest({
          name: 'posts/',
          action: 'getAll',
          data: {
            query: {
              user_id: this.self.id
            }
          }
        })
          .then((res) => {
            this.posts = res.data.posts
          })
          .finally(() => {
            this.loading = false
            this.isFinished = true
          })
      }
    },
    watch: {
      self() {
        this.getPosts()
      }
    },
    components: {
      Criticism
    }
  }
</script>
