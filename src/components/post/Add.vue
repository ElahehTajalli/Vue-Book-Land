<template>
  <div>
    <el-dialog
      :title="$t('add_post')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-escape="false"
      :show-close="false"
      width="40rem"
      top="7vh"
      class="small add-post"
    >
      <el-form :model="addPostForm" ref="addPost" :rules="rules">
        <div class="flexbox wrap">
          <el-form-item :label="$t('post.book')" prop="book">
            <el-select
              v-model="addPostForm.book"
              filterable
              default-first-option
              :placeholder="$t('choose')"
            >
              <el-option
                v-for="item in books"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-button @click="bookDialog = true">
              {{ $t('add_book') }}
            </el-button>
          </el-form-item>
        </div>
        <el-form-item :label="$t('post.rate')" prop="rate">
          <el-input-number
            v-model="addPostForm.rate"
            :step="0.1"
            :min="0"
            :max="5"
          ></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('post.text')" prop="text">
          <el-input
            type="textarea"
            class="rtl"
            resize="none"
            v-model="addPostForm.text"
            :rows="10"
          ></el-input>
        </el-form-item>
        <div class="text-center">
          <el-button
            :loading="loading"
            class="ml-10"
            type="primary"
            @click="validateAndSubmitForm('addPost', addPost)"
          >
            {{ $t('add') }}
          </el-button>
          <el-button @click="handleClose"> {{ $t('close') }} </el-button>
        </div>
      </el-form>
    </el-dialog>
    <AddBook
      :dialogVisible="bookDialog"
      @close-dialog="handleCloseBookDialog()"
    />
  </div>
</template>

<script>
  import AddBook from '@/components/book/Add'
  import { mapGetters, mapActions } from 'vuex'

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
        bookDialog: false,
        books: [],
        addPostForm: {
          text: '',
          rate: 0,
          book: ''
        },
        rules: {
          rate: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ],
          book: [
            {
              required: true,
              message: this.$i18n.t('field_required')
            }
          ],
          text: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
      this.handleGetBooks()
    },
    computed: {
      ...mapGetters(['self'])
    },
    methods: {
      ...mapActions(['handleRequest', 'setBooks']),
      addPost() {
        this.loading = true
        let formData = new FormData()
        for (let [key, value] of Object.entries(this.addPostForm)) {
          formData.append(key, value)
        }
        formData.append('user', this.self.id)

        this.handleRequest({
          name: 'posts/',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: this.$i18n.t('the_post_was_successfully_added')
            })
            this.handleClose()
            this.loading = false
          })
          .catch(() => {
            this.loading = false
            this.$message({
              type: 'error',
              message: this.$i18n.t(
                'your_request_has_encountered_a_problem_please_try_again'
              )
            })
          })
      },
      handleClose() {
        this.$emit('close-dialog')
        this.$refs['addPost'].resetFields()
      },
      handleGetBooks() {
        this.handleRequest({
          name: 'books/list',
          action: 'getAll',
          data: {
            query: {
              sort: 'rate:desc'
            }
          }
        }).then((res) => {
          this.books = res.data.books
        })
      },
      handleCloseBookDialog() {
        this.bookDialog = false
        this.handleGetBooks()
      }
    },
    components: {
      AddBook
    }
  }
</script>
