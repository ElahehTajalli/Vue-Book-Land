<template>
  <div class="full-width flexbox justify-center posts">
    <el-card class="full-width">
      <div :class="`criticism ${isMyPosts ? 'my-posts' : ''}`">
        <div>
          <div class="top">
            <div class="detail">
              <img
                class="image"
                v-if="post.critic.image && !isMyPosts"
                :src="'http://ketabland.pythonanywhere.com' + post.critic.image"
              />
              <img
                v-else-if="!post.critic.image && !isMyPosts"
                class="image"
                src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
              />
              <span v-if="isMyPosts" @click="showBook(post.book.id)">
                {{ post.book.name }}
              </span>
              <span v-else @click="showUser(post.critic.id)">
                {{ post.critic.persian_username }}</span
              >
            </div>
            <el-button @click="showPost(post.id)" type="primary">
              {{ $t('view') }}
            </el-button>
          </div>
          <span class="text">{{ post.text }}</span>
        </div>
        <div class="bottom">
          <div class="date">
            <img src="https://img.icons8.com/ios/100/184277/planner.png" />
            <span>{{ dateTime }}</span>
          </div>
          <div class="likes">
            <div @click="editPost('dislike')" v-if="new_post.dislikes">
              <span> {{ new_post.dislikes.length }} </span>
              <img
                src="https://img.icons8.com/material-rounded/24/ff0000/thumbs-down.png"
              />
            </div>
            <div @click="editPost('like')" v-if="new_post.likes">
              <span> {{ new_post.likes.length }} </span>
              <img
                src="https://img.icons8.com/material-rounded/24/00ff30/facebook-like--v1.png"
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="information-book" v-if="fromHome">
      <div @click="showBook(post.book.id)" class="info">
        <div class="flexbox column-direction detail">
          <span class="name bold-title"> {{ post.book.name }} </span>
          <span v-if="post.book.author">
            {{ $t('book.author') }}: {{ post.book.author.name }}
          </span>
          <span v-if="post.book.translator">
            {{ $t('book.translator') }}: {{ post.book.translator.name }}
          </span>
          <span> {{ $t('book.publisher') }}: {{ post.book.publisher }} </span>
        </div>
        <img
          v-if="post.book.image"
          :src="'http://ketabland.pythonanywhere.com' + post.book.image"
        />
        <img v-else src="../../assets/images/noBook.png" />
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import moment from 'moment-jalaali'
  export default {
    data() {
      return {
        jalaliFormat: 'jYYYY/jM/jD',
        new_post: this.post
      }
    },
    props: {
      post: {
        type: Object,
        default: () => {}
      },
      isMyPosts: {
        type: Boolean,
        default: false
      },
      fromHome: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters(['self']),
      dateTime() {
        return moment(this.post.created_at).format(this.jalaliFormat)
      }
    },
    methods: {
      ...mapActions(['handleRequest']),
      showPost(id) {
        this.$router.push({ name: 'ViewPost', params: { id } })
      },
      editPost(action) {
        this.handleRequest({
          name: 'posts/edit',
          action: 'patch',
          data: {
            toPatch: {
              user: this.self.id,
              post: this.post.id,
              action
            }
          }
        }).then((res) => {
          this.new_post = res.data.post
        })
      },
      showUser(id) {
        this.$router.push({ name: 'ViewUser', params: { id } })
      },
      showBook(id) {
        this.$router.push({ name: 'ViewBook', params: { id } })
      }
    }
  }
</script>
