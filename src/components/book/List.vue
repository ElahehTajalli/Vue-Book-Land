<template>
  <div
    class="book-list flexbox justify-center column-direction"
    v-loading.fullscreen.lock="loading"
  >
    <Filters @set-filter="setFilter($event)" />
    <div class="items">
      <Detail v-for="b in books" :key="b.id" :book="b" />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Detail from '@/components/book/Detail'
  import Filters from '@/components/book/Filters'
  export default {
    data() {
      return {
        loading: false
      }
    },
    created() {
      this.handleGetBooks()
    },
    computed: {
      ...mapGetters(['books'])
    },
    methods: {
      ...mapActions(['handleRequest', 'setBooks']),
      handleGetBooks() {
        this.loading = true
        this.handleRequest({
          name: 'books/list',
          action: 'getAll',
          data: {
            query: {
              count: 10,
              sort: 'created_at:desc'
            }
          }
        })
          .then((res) => {
            this.setBooks(res.data.books)
          })
          .finally(() => {
            this.loading = false
          })
      },
      setFilter(books) {
        this.books = books
      }
    },
    components: {
      Detail,
      Filters
    }
  }
</script>
