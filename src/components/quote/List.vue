<template>
  <el-dialog
    :title="$t('quotes')"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-escape="false"
    :show-close="false"
    width="50rem"
    top="7vh"
    class="small"
  >
    <div v-if="quotes.length" class="quotes">
      <Quote v-for="q in quotes" :key="q.id" :quote="q" />
    </div>
    <el-button class="full-width" @click="handleClose">
      {{ $t('close') }}
    </el-button>
  </el-dialog>
</template>

<script>
  import Quote from '@/components/quote/Quote'
  import { mapActions } from 'vuex'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        quotes: []
      }
    },
    created() {
      this.getQuotes()
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
      handleClose() {
        this.$emit('close-dialog')
      }
    },
    components: {
      Quote
    }
  }
</script>
