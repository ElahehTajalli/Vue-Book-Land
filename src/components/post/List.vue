<template>
  <div class="view-book" v-loading.fullscreen.lock="loading">
    <div class="post flexbox column-direction align-center" v-if="posts.length">
      <div class="criticisms-title">
        <span>{{ $t('my_criticisms') }}</span>
      </div>
      <Criticism v-for="p in posts" :key="p.id" :post="p" :isMyPosts="true" />
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
        loading: false
      }
    },
    created() {
      if (this.self) {
        this.getPosts()
      }
    },
    computed: {
      ...mapGetters(['self'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      getPosts() {
        this.loading = true
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
          .finally(() => (this.loading = false))
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
