<template>
  <el-card class="detail">
    <div @click="showBook(book.id)">
      <img
        v-if="book.image"
        :src="'http://ketabland.pythonanywhere.com' + book.image"
      />
      <img v-else src="../../assets/images/noBook.png" />
      <span class="book-title">{{ book.name }}</span>
      <span class="book-author">{{ book.author.name }}</span>
      <span class="book-publisher">{{ book.publisher }}</span>
      <span class="book-genre">{{ book.genre }}</span>
    </div>
  </el-card>
</template>

<script>
  export default {
    props: {
      book: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {}
    },
    methods: {
      showBook(id) {
        this.$router.push({ name: 'ViewBook', params: { id } })
      }
    }
  }
</script>
