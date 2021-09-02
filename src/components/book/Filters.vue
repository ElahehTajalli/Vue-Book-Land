<template>
  <el-card v-loading.fullscreen.lock="loading" class="filters">
    <el-form ref="filters" :model="filters">
      <div class="filter-item">
        <el-form-item :label="$t('book.author')">
          <el-select
            v-model="filters.authors"
            multiple
            default-first-option
            filterable
          >
            <el-option
              v-for="item in authors"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('book.translator')">
          <el-select
            v-model="filters.translators"
            multiple
            default-first-option
            filterable
          >
            <el-option
              v-for="item in translators"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('book.genre')">
          <el-input v-model="filters.genre" />
        </el-form-item>
        <el-form-item :label="$t('book.publisher')">
          <el-input v-model="filters.publisher" />
        </el-form-item>
      </div>
      <div class="text-center">
        <el-button type="primary" @click="handleFilter">{{
          $t('filter')
        }}</el-button>
        <el-button class="mr-5" @click="resetFilter">{{
          $t('reset_filter')
        }}</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        filters: {
          authors: [],
          translators: [],
          genre: '',
          publisher: '',
          sort: 'created_at:desc'
        },
        loading: false,
        authors: [],
        translators: []
      }
    },
    async created() {
      await this.handleGetAuthors('rate:desc')
      await this.handleGetTranslators('rate:desc')
    },
    methods: {
      ...mapActions(['handleRequest']),
      handleFilter() {
        this.loading = true
        let filters = {
          ...(this.filters.authors.length && { authors: this.filters.authors }),
          ...(this.filters.translators.length && {
            translators: this.filters.translators
          }),
          ...(this.filters.genre && { genre: this.filters.genre }),
          ...(this.filters.publisher && { publisher: this.filters.publisher }),
          sort: this.filters.sort
        }

        this.handleRequest({
          name: 'books/list',
          action: 'getAll',
          data: {
            query: filters
          }
        })
          .then((res) => {
            this.$emit('set-filter', res.data.books)
          })
          .finally(() => {
            this.loading = false
          })
      },
      setFiltersEmpty() {
        this.filters = {
          authors: [],
          translators: [],
          genre: '',
          publisher: '',
          sort: 'created_at:desc'
        }
      },
      resetFilter() {
        this.setFiltersEmpty()
        this.handleFilter()
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
      }
    },
    destroyed() {
      this.resetFilter()
    }
  }
</script>
