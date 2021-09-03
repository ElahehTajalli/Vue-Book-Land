<template>
  <div class="dashboard" v-loading.fullscreen.lock="loading">
    <div class="flexbox justify-around align-center wrap">
      <div class="logo-detail">
        <span>{{ $t('book_land') }}</span>
        <span style="marginTop: 1rem" class="site-detail">{{
          $t('site_detail1')
        }}</span>
        <span class="site-detail">{{ $t('site_detail2') }}</span>
        <span class="site-detail jami">{{ $t('jami') }}</span>
        <div v-if="!isAuthenticated" class="buttons">
          <el-button type="primary" @click="$router.push({ name: 'Login' })">
            {{ $t('login') }}
          </el-button>
          <el-button type="primary" @click="$router.push({ name: 'SignUp' })">
            {{ $t('signup') }}
          </el-button>
        </div>
      </div>
      <img class="main-logo" src="../assets/images/dashboard.svg" />
      <!-- <img class="main-logo" src="../assets/images/reading-book.jpg" /> -->
    </div>
    <SlideShow :quotes="quotes" />
    <Swiper :books="newest" title="newest" class="newest" />
    <Swiper :books="mostPopular" title="most_popular" class="most_popular" />
    <div
      class="full-width flexbox align-center justify-center"
      v-if="mostPopular[0]"
    >
      <el-card class="popular_month">
        <div class="title-div">
          <span class="title">{{ $t('most_popular_in_month') }}</span>
        </div>
        <div @click="showBook(mostPopular[0].id)" class="main pointer">
          <img
            v-if="mostPopular[0].image"
            :src="'http://ketabland.pythonanywhere.com' + mostPopular[0].image"
          />
          <img v-else src="../assets/images/noBook.png" />
          <div class="flexbox align-center justify-center">
            <span
              class="book-title bold-title"
              @click="showBook(mostPopular[0].id)"
              >{{ mostPopular[0].name }}</span
            >
            <span class="book-author">{{ mostPopular[0].author.name }}</span>
            <span class="book-publisher">{{ mostPopular[0].publisher }}</span>
            <span class="book-genre">{{ mostPopular[0].genre }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <Swiper
      :users="authors"
      title="most_popular_authors"
      class="popular_author"
    />
    <Swiper
      :users="translators"
      title="most_popular_translators"
      class="popular_translator"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Swiper from '@/components/Swiper'
  import SlideShow from '@/components/SlideShow'
  export default {
    data() {
      return {
        newest: [],
        mostPopular: [],
        authors: [],
        translators: [],
        loading: false,
        quotes: []
      }
    },
    async created() {
      await this.getQuotes()
      await this.handleGetBooks('created_at:desc', 'newest')
      await this.handleGetBooks('rate:desc', 'mostPopular')
      await this.handleGetAuthors('rate:desc')
      await this.handleGetTranslators('rate:desc')
    },
    computed: {
      ...mapGetters(['isAuthenticated'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      getQuotes() {
        this.loading = true
        this.handleRequest({
          name: 'quotes/',
          action: 'getAll'
        })
          .then((res) => {
            this.quotes = res.data.quotes
          })
          .finally(() => {
            this.loading = false
          })
      },
      handleGetBooks(sort, list) {
        this.handleRequest({
          name: 'books/list',
          action: 'getAll',
          data: {
            query: {
              count: 10,
              sort
            }
          }
        }).then((res) => {
          this[list] = res.data.books
        })
      },
      handleGetAuthors(sort) {
        this.handleRequest({
          name: 'users/get_authors',
          action: 'getAll',
          data: {
            query: {
              count: 10,
              sort
            }
          }
        }).then((res) => {
          this.authors = res.data.authors
        })
      },
      handleGetTranslators(sort) {
        this.handleRequest({
          name: 'users/get_translators',
          action: 'getAll',
          data: {
            query: {
              count: 10,
              sort
            }
          }
        })
          .then((res) => {
            this.translators = res.data.translators
          })
          .finally(() => (this.loading = false))
      },
      showBook(id) {
        this.$router.push({ name: 'ViewBook', params: { id } })
      }
    },
    components: {
      Swiper,
      SlideShow
    }
  }
</script>
