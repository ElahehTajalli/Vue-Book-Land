<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <div class="home-buttons" v-if="!loading">
      <div
        @click="$router.push({ name: 'MyLibrary' })"
        class="flexbox column-direction top-buttons library"
      >
        <img src="../assets/images/library.jpg" />
        <span>{{ $t('my_library') }}</span>
      </div>
      <div
        @click="$router.push({ name: 'MyPostsList' })"
        class="flexbox column-direction top-buttons criticisms"
      >
        <img src="../assets/images/naghdha.png" />
        <span>{{ $t('my_criticisms') }}</span>
      </div>
      <div
        @click="$router.push({ name: 'Profile' })"
        class="flexbox column-direction top-buttons profile"
      >
        <img src="../assets/images/profile.png" />
        <span>{{ $t('my_profile') }}</span>
      </div>
      <div
        @click="$router.push({ name: 'Chat' })"
        class="flexbox column-direction top-buttons messages"
      >
        <img src="../assets/images/envelope.svg" />
        <span>{{ $t('my_messages') }}</span>
      </div>
      <div
        @click="dialogVisible = true"
        class="flexbox column-direction top-buttons post"
      >
        <img src="../assets/images/add-naghd.png" />
        <span>
          {{ $t('add_post') }}
        </span>
      </div>
      <div
        class="flexbox column-direction top-buttons add-quote"
        @click="quoteDialogVisible = true"
      >
        <img src="../assets/images/add_quote.svg" />
        <span>
          {{ $t('add_quote') }}
        </span>
      </div>
      <div
        class="flexbox column-direction top-buttons quote"
        @click="quoteListDialogVisible = true"
      >
        <img
          src="https://img.icons8.com/material-rounded/128/000000/quote-left.png"
        />
        <span>
          {{ $t('quotes') }}
        </span>
      </div>
      <div
        @click="$router.push({ name: 'BookList' })"
        class="flexbox column-direction top-buttons books"
      >
        <img src="../assets/images/ketabha.png" />
        <span>{{ $t('books') }}</span>
      </div>
    </div>
    <AddPost
      :dialogVisible="dialogVisible"
      @close-dialog="dialogVisible = false"
    />
    <AddQuote
      :dialogVisible="quoteDialogVisible"
      @close-dialog="quoteDialogVisible = false"
    />
    <List
      :dialogVisible="quoteListDialogVisible"
      @close-dialog="quoteListDialogVisible = false"
    />
    <div class="view-post">
      <div
        class="post flexbox column-direction align-center"
        v-if="posts.length"
      >
        <div class="criticisms-title important-full-width">
          <span>{{ $t('last_criticisms') }}</span>
        </div>
        <Criticism v-for="p in posts" :key="p.id" :post="p" :fromHome="true" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import AddPost from '@/components/post/Add'
  import Criticism from '@/components/post/Criticism'
  import AddQuote from '@/components/quote/Add'
  import List from '@/components/quote/List'

  export default {
    data() {
      return {
        dialogVisible: false,
        posts: [],
        loading: false,
        quoteDialogVisible: false,
        quoteListDialogVisible: false
      }
    },
    created() {
      this.getFollowingPosts()
    },
    methods: {
      ...mapActions(['handleRequest']),
      getFollowingPosts() {
        this.loading = true
        this.handleRequest({
          name: 'posts/getPosts',
          action: 'getAll'
        })
          .then((res) => {
            this.posts = res.data.posts
          })
          .finally(() => (this.loading = false))
      }
    },
    components: {
      AddPost,
      Criticism,
      AddQuote,
      List
    }
  }
</script>
