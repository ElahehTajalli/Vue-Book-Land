<template>
  <div class="quote full-width">
    <img
      class="image"
      :src="'http://ketabland.pythonanywhere.com' + quote.image"
    />
    <div class="top">
      <div class="item">
        <span class="name" v-if="quote.author"> {{ quote.author }}</span>
        <span class="text">{{ quote.text }}</span>
        <span class="bold-title" v-if="quote.book">( {{ quote.book }} )</span>
      </div>
      <div class="bottom">
        <div class="likes">
          <div @click="editQuote()">
            <span class="bold-title">
              {{ new_quote.likes.length }}
            </span>
            <img src="../../assets/images/like.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    data() {
      return {
        new_quote: this.quote
      }
    },
    props: {
      quote: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      ...mapGetters(['self'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      editQuote() {
        this.handleRequest({
          name: 'quotes/edit',
          action: 'patch',
          data: {
            toPatch: {
              user: this.self.id,
              quote: this.quote.id
            }
          }
        }).then((res) => {
          this.new_quote = res.data.quote
        })
      }
    }
  }
</script>
