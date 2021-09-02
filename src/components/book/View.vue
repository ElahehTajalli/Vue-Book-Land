<template>
  <div class="view-book" v-loading.fullscreen.lock="loading">
    <el-card v-if="!loading">
      <div class="main">
        <div>
          <img
            v-if="book.image"
            :src="'http://ketabland.pythonanywhere.com' + book.image"
          />
          <img v-else src="../../assets/images/noBook.png" />
        </div>
        <div class="book-information">
          <div class="information">
            <span class="name"> {{ book.name }} </span>
            <el-rate
              :value="parseFloat((+book.rate).toFixed(2))"
              disabled
              show-score
              text-color="#ff9900"
            >
            </el-rate>
            <span v-if="book.author">
              {{ $t('book.author') }}: {{ book.author.name }}
            </span>
            <span v-if="book.translator">
              {{ $t('book.translator') }}: {{ book.translator.name }}
            </span>
            <span> {{ $t('book.publisher') }}: {{ book.publisher }} </span>
            <span> {{ $t('book.genre') }}: {{ book.genre }} </span>
            <span>
              {{ $t('book.publication_year') }}: {{ book.publication_year }}
            </span>
          </div>
          <div class="buttons" v-if="isAuthenticated">
            <el-button
              :type="list.isWantsToRead ? 'primary' : 'light'"
              size="mini"
              @click="addToPlan('wants_to_read')"
            >
              {{ $t('want_to_read') }}</el-button
            >
            <el-button
              :type="list.isReading ? 'primary' : 'light'"
              size="mini"
              @click="addToPlan('reading')"
            >
              {{ $t('currently_reading') }}</el-button
            >
            <el-button
              :type="list.isRead ? 'primary' : 'light'"
              size="mini"
              @click="addToPlan('read')"
            >
              {{ $t('read') }}</el-button
            >
          </div>
        </div>
      </div>
      <div class="favorite" v-if="isAuthenticated">
        <el-button type="primary" @click="showRateDialog = true">
          {{ $t('rate_to_book') }}
        </el-button>
        <img
          v-if="isFavorite"
          @click="setFavorite()"
          class="favorite"
          src="../../assets/images/favorite_red.svg"
        />
        <img
          v-else
          @click="setFavorite()"
          class="favorite"
          src="../../assets/images/favorite_border_black.svg"
        />
      </div>
    </el-card>
    <div class="post-summary" v-if="!loading">
      <el-card v-if="book.summary">
        <div slot="header" class="clearfix">
          <span>{{ $t('book.summary') }}</span>
        </div>
        <span class="summary"> {{ book.summary }} </span>
      </el-card>
      <div
        class="post flexbox column-direction align-center"
        v-if="isAuthenticated && posts.length"
      >
        <div class="criticisms-title">
          <span>{{ $t('criticisms') }}</span>
        </div>
        <Criticism v-for="p in posts" :key="p.id" :post="p" />
      </div>
    </div>
    <el-dialog
      :title="$t('rating')"
      :visible.sync="showRateDialog"
      :close-on-click-modal="false"
      :close-on-escape="false"
      :show-close="false"
      width="40rem"
      top="7vh"
      class="small"
    >
      <el-form :model="editBook" ref="addRate" :rules="rules">
        <el-form-item :label="$t('post.rate')" prop="rate">
          <el-input-number
            v-model="editBook.rate"
            :step="0.1"
            :min="0"
            :max="5"
          ></el-input-number>
        </el-form-item>
        <div class="text-center">
          <el-button
            :loading="buttonLoading"
            class="ml-10"
            type="primary"
            @click="validateAndSubmitForm('addRate', setRate)"
          >
            {{ $t('submit') }}
          </el-button>
          <el-button @click="showRateDialog = false">
            {{ $t('close') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Criticism from '@/components/post/Criticism'
  export default {
    data() {
      return {
        id: 0,
        book: {},
        posts: [],
        loading: false,
        buttonLoading: false,
        rate: 0,
        list: {
          isRead: false,
          isReading: false,
          isWantsToRead: false
        },
        isFavorite: false,
        showRateDialog: false,
        editBook: {
          rate: 0
        },
        rules: {
          rate: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ]
        }
      }
    },
    async created() {
      await this.getBook()
      this.self ? await this.getPlan() : ''
      this.self ? await this.getFavorite() : ''
      this.isAuthenticated ? await this.getPosts() : ''
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'self'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      getBook() {
        this.loading = true
        this.handleRequest({
          name: 'books',
          action: 'getOne',
          data: {
            id: this.$route.params.id
          }
        })
          .then((res) => {
            this.book = res.data
          })
          .finally(() => {
            !this.isAuthenticated ? (this.loading = false) : ''
          })
      },
      getPosts() {
        this.handleRequest({
          name: 'posts/',
          action: 'getAll',
          data: {
            query: {
              book_id: this.$route.params.id
            }
          }
        })
          .then((res) => {
            this.posts = res.data.posts
          })
          .finally(() => {
            this.loading = false
          })
      },
      getPlan() {
        this.handleRequest({
          name: 'books/plan',
          action: 'getAll',
          data: {
            query: {
              user: this.self.id,
              book: this.$route.params.id
            }
          }
        })
          .then((res) => {
            this.list = res
          })
          .catch((res) => {
            this.list = res.response.data
          })
          .finally(() => {
            !this.isAuthenticated ? (this.loading = false) : ''
          })
      },
      getFavorite() {
        this.handleRequest({
          name: 'books/favorite',
          action: 'getAll',
          data: {
            query: {
              book: this.$route.params.id
            }
          }
        })
          .then(() => {
            this.isFavorite = true
          })
          .catch(() => {
            this.isFavorite = false
          })
          .finally(() => {
            !this.isAuthenticated ? (this.loading = false) : ''
          })
      },
      setRate() {
        this.buttonLoading = true
        let formData = new FormData()
        formData.append('book', this.$route.params.id)
        formData.append('user', this.self.id)
        formData.append('rate', this.editBook.rate)

        this.handleRequest({
          name: 'books/rate',
          action: 'create',
          data: formData
        })
          .then((res) => {
            this.book.rate = res.rate
            this.$message({
              type: 'success',
              message: this.$i18n.t('your_rate_was_successfully_added'),
              customClass: 'bg-success-dark'
            })
            this.showRateDialog = false
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: this.$i18n.t(error.response.data.errors),
              customClass: 'bg-error-dark'
            })
          })
          .finally(() => {
            this.buttonLoading = false
          })
      },
      addToPlan(list) {
        let formData = new FormData()
        formData.append('book', this.$route.params.id)
        formData.append('user', this.self.id)
        formData.append('list', list)

        this.handleRequest({
          name: 'books/plan',
          action: 'create',
          data: formData
        }).then(() => {
          this.getPlan()
        })
      },
      setFavorite() {
        let formData = new FormData()
        formData.append('book', this.$route.params.id)

        this.handleRequest({
          name: 'books/favorite',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.isFavorite = !this.isFavorite
            // this.$message({
            //   type: 'success',
            //   message: this.$i18n.t('your_rate_was_successfully_added'),
            //   customClass: 'bg-success-dark'
            // })
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: this.$i18n.t(error.response.data.errors),
              customClass: 'bg-error-dark'
            })
          })
      }
    },
    watch: {
      self() {
        this.getPlan()
        this.getFavorite()
      }
    },
    components: {
      Criticism
    }
  }
</script>
