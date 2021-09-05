<template>
  <div class="view-post" v-loading.fullscreen.lock="loading">
    <el-card v-if="!loading" class="book-info">
      <div>
        <img
          v-if="book.image"
          :src="'http://ketabland.pythonanywhere.com' + book.image"
        />
        <img v-else src="../../assets/images/noBook.png" />
      </div>
      <div class="book-information">
        <div>
          <span class="name"> {{ book.name }} </span>
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
      </div>
    </el-card>
    <div
      class="full-width flexbox column-direction align-center"
      style="flex: 1 1 0%;"
    >
      <el-card class="post" v-if="!loading && post">
        <div slot="header" class="clearfix">
          <span>{{ $t('criticism') }}</span>
        </div>
        <div class="criticism">
          <div class="top">
            <div class="detail">
              <img
                v-if="post.critic.image"
                class="image"
                :src="'http://ketabland.pythonanywhere.com' + post.critic.image"
              />
              <img
                v-else
                class="image"
                src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
              />

              <span v-if="post.critic" @click="showUser(post.critic.id)">
                {{ post.critic.persian_username }}
              </span>
            </div>
          </div>
          <span class="text">{{ post.text }}</span>
          <div class="bottom">
            <div class="date">
              <img src="https://img.icons8.com/ios/100/184277/planner.png" />
              <span>{{ dateTime }}</span>
            </div>
            <div class="likes">
              <div @click="editPost('dislike')" v-if="post.dislikes">
                <span> {{ new_post.dislikes.length }} </span>
                <img
                  src="https://img.icons8.com/material-rounded/24/ff0000/thumbs-down.png"
                />
              </div>
              <div @click="editPost('like')" v-if="post.likes">
                <span> {{ new_post.likes.length }} </span>
                <img
                  src="https://img.icons8.com/material-rounded/24/00ff30/facebook-like--v1.png"
                />
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <div class="comments-div" v-if="!loading">
        <el-card v-if="comments.length">
          <div slot="header" class="clearfix">
            <span>{{ $t('comments') }}</span>
          </div>
          <Comment v-for="cm in comments" :key="cm.id" :comment="cm" />
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ $t('add_comment') }}</span>
          </div>
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item :label="$t('text')" prop="comment_text">
              <el-input
                type="textarea"
                class="rtl"
                resize="none"
                v-model="form.comment_text"
              ></el-input>
            </el-form-item>
            <el-button
              :loading="submitLoading"
              type="primary"
              @click="validateAndSubmitForm('form', addComment)"
            >
              {{ $t('submit') }}
            </el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import moment from 'moment-jalaali'
  import Comment from '@/components/comment/Comment'
  // import Criticism from '@/components/post/Criticism'
  export default {
    data() {
      return {
        book: {},
        post: {},
        comments: [],
        loading: false,
        submitLoading: false,
        jalaliFormat: 'jYYYY/jM/jD',
        new_post: '',
        form: {
          comment_text: ''
        },
        rules: {
          comment_text: [
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
      await this.getPost()
      await this.getComments()
    },
    computed: {
      ...mapGetters(['self']),
      dateTime() {
        return moment(this.post.created_at).format(this.jalaliFormat)
      }
    },
    methods: {
      ...mapActions(['handleRequest']),
      getPost() {
        this.loading = true
        this.handleRequest({
          name: 'posts',
          action: 'getOne',
          data: {
            id: this.$route.params.id
          }
        }).then((res) => {
          this.post = res.data.post
          this.new_post = this.post
          this.book = res.data.post.book
        })
      },
      getComments() {
        this.handleRequest({
          name: 'comments/',
          action: 'getAll',
          data: {
            query: {
              post_id: this.$route.params.id
            }
          }
        })
          .then((res) => {
            this.comments = res.data.comments
          })
          .finally(() => {
            this.loading = false
          })
      },
      editPost(action) {
        this.handleRequest({
          name: 'posts/edit',
          action: 'patch',
          data: {
            toPatch: {
              user: this.self.id,
              post: +this.$route.params.id,
              action
            }
          }
        }).then((res) => {
          this.new_post = res.data.post
        })
      },
      addComment() {
        this.submitLoading = true
        let formData = new FormData()
        formData.append('user_id', this.self.id)
        formData.append('post_id', this.$route.params.id)
        formData.append('text', this.form.comment_text)

        this.handleRequest({
          name: 'comments/',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: this.$i18n.t('the_comment_was_successfully_added')
            })
            this.getComments()
            this.form.comment_text = ''
            this.submitLoading = false
          })
          .catch(() => {
            this.submitLoading = false
            this.$message({
              type: 'error',
              message: this.$i18n.t(
                'your_request_has_encountered_a_problem_please_try_again'
              )
            })
          })
      },
      showUser(id) {
        this.$router.push({ name: 'ViewUser', params: { id } })
      }
    },
    components: {
      Comment
      // Criticism
    }
  }
</script>
