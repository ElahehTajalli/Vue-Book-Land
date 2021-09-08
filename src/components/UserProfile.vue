<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="flexboc align-center justify-center main-user-profile"
  >
    <div class="user-profile" v-if="user && isFinished">
      <div class="profile">
        <el-card v-if="!loading">
          <div class="user-information">
            <img
              class="profile-picture"
              v-if="user.image"
              :src="'http://ketabland.pythonanywhere.com' + user.image"
            />
            <img
              v-else
              class="profile-picture"
              src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
            />
            <div class="flexbox column-direction">
              <div>
                <div class="name">
                  <span> {{ user.persian_username }} </span>
                </div>
              </div>
              <div class="following_followers">
                <div @click="showFollowingOrFollowers('following')">
                  <span> {{ $t('following') }} </span>
                  <span> {{ total_following }} </span>
                </div>
                <div @click="showFollowingOrFollowers('follower')">
                  <span> {{ $t('followers') }} </span>
                  <span> {{ total_followers }} </span>
                </div>
              </div>
            </div>
          </div>
          <div class="buttons flexbox align-center">
            <el-button
              @click="
                $router.push({
                  name: 'ChatID',
                  params: { id: $route.params.id }
                })
              "
            >
              {{ $t('send_message') }}
            </el-button>
            <el-button
              v-if="isFollowButton"
              :loading="buttonLoading"
              type="primary"
              @click="handleFollow()"
            >
              {{ $t('follow') }}
            </el-button>
            <el-button
              v-else
              :loading="buttonLoading"
              type="danger"
              @click="handleUnFollow()"
            >
              {{ $t('unfollow') }}
            </el-button>
          </div>
        </el-card>
      </div>
      <div class="my-plan-title" v-if="favorites.length">
        <span>{{ $t('favorites') }}</span>
      </div>
      <div class="favorite" v-if="favorites.length">
        <Swiper
          :books="favorites"
          :title="$t('favorites')"
          class="newest"
          :fromProfile="true"
        />
      </div>
      <div class="my-plan-title" v-if="wantsToRead.length">
        <span>{{ $t('want_to_read') }}</span>
      </div>
      <div class="wants-to-read-swiper" v-if="wantsToRead.length">
        <Swiper
          :books="wantsToRead"
          :title="$t('want_to_read')"
          class="newest"
          :fromProfile="true"
        />
      </div>
      <div class="my-plan-title" v-if="read.length">
        <span>{{ $t('read') }}</span>
      </div>
      <div class="read-swiper" v-if="read.length">
        <Swiper
          :books="read"
          :title="$t('read')"
          class="newest"
          :fromProfile="true"
        />
      </div>
      <div class="my-plan-title" v-if="reading.length">
        <span>{{ $t('currently_reading') }}</span>
      </div>
      <div class="reading-swiper" v-if="reading.length">
        <Swiper
          :books="reading"
          :title="$t('currently_reading')"
          class="newest"
          :fromProfile="true"
        />
      </div>
      <div class="view-book">
        <div
          class="post flexbox column-direction align-center"
          v-if="posts.length"
        >
          <div class="criticisms-title">
            <span>{{ $t('criticisms') }}</span>
          </div>
          <Criticism
            v-for="p in posts"
            :key="p.id"
            :post="p"
            :isMyPosts="true"
          />
        </div>
      </div>
      <FollowingFollowers
        :users="listName === 'following' ? following : followers"
        :listName="listName"
        :dialogVisible="dialogVisible"
        @close-dialog="dialogVisible = false"
      />
    </div>
    <div v-else-if="isFinished" class="not-found">
      <img src="../assets/images/notfound1.svg" />
      <span>
        {{ $t('not_found', { word: $t('error.user') }) }}
      </span>
      <router-link
        :to="{ name: `${isAuthenticated ? 'Home' : 'Dashboard'}` }"
        class="link"
      >
        {{ $t('go_to_dashboard') }}
      </router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Criticism from '@/components/post/Criticism'
  import FollowingFollowers from '@/components/FollowingFollowers'
  import Swiper from '@/components/Swiper'

  export default {
    data() {
      return {
        user: null,
        loading: false,
        buttonLoading: false,
        isFollowButton: true,
        following: [],
        followers: [],
        total_following: 0,
        total_followers: 0,
        posts: [],
        dialogVisible: false,
        listName: '',
        read: [],
        reading: [],
        wantsToRead: [],
        favorites: [],
        isFinished: false
      }
    },
    async created() {
      await this.getUser()
      await this.getRelationships('following', 'total_following', {
        follower_id: this.$route.params.id
      })
      await this.getRelationships('followers', 'total_followers', {
        following_id: this.$route.params.id
      })
      if (this.self) {
        await this.getPosts()
        await this.checkRelationship()
      }
      this.getPlan()
      this.getFavorite()
    },
    computed: {
      ...mapGetters(['self', 'isAuthenticated'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      getUser() {
        this.isFinished = false
        this.loading = true
        this.handleRequest({
          name: 'users',
          action: 'getOne',
          data: {
            id: this.$route.params.id
          }
        })
          .then((res) => {
            this.user = res.data.user
          })
          .finally(() => {
            this.isFinished = true
          })
      },
      getRelationships(param, total, query) {
        this.handleRequest({
          name: 'users/getRelationships',
          action: 'getAll',
          data: {
            query
          }
        }).then((res) => {
          this[param] = res.data.relationships
          this[total] = res.total
        })
      },
      getPlan(title) {
        this.handleRequest({
          name: 'books/getPlan',
          action: 'getAll',
          data: {
            query: {
              user: this.$route.params.id,
              title
            }
          }
        }).then((res) => {
          this.read = res.data.plan.read
          this.reading = res.data.plan.reading
          this.wantsToRead = res.data.plan.wants_to_read
        })
      },
      getFavorite() {
        this.handleRequest({
          name: 'books/getFavorite',
          action: 'getAll',
          data: {
            query: {
              user: this.$route.params.id
            }
          }
        }).then((res) => {
          this.favorites = res.data.favorite
        })
      },
      checkRelationship() {
        let formData = new FormData()
        formData.append('following', this.$route.params.id)
        formData.append('follower', this.self.id)

        this.handleRequest({
          name: 'users/checkRelationship',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.isFollowButton = false
          })
          .catch(() => (this.isFollowButton = true))
          .finally(() => (this.loading = false))
      },
      getPosts() {
        this.loading = true
        this.handleRequest({
          name: 'posts/',
          action: 'getAll',
          data: {
            query: {
              user_id: this.$route.params.id
            }
          }
        }).then((res) => {
          this.posts = res.data.posts
        })
      },
      handleFollow() {
        this.buttonLoading = true
        let formData = new FormData()
        formData.append('following', this.$route.params.id)
        formData.append('follower', this.self.id)

        this.handleRequest({
          name: 'users/follow',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.isFollowButton = false
            this.getRelationships('followers', 'total_followers', {
              following_id: this.$route.params.id
            })
          })
          .finally(() => (this.buttonLoading = false))
      },
      handleUnFollow() {
        this.buttonLoading = true
        let formData = new FormData()
        formData.append('following', this.$route.params.id)
        formData.append('follower', this.self.id)

        this.handleRequest({
          name: 'users/unfollow',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.isFollowButton = true
            this.getRelationships('followers', 'total_followers', {
              following_id: this.$route.params.id
            })
          })
          .finally(() => (this.buttonLoading = false))
      },
      showFollowingOrFollowers(name) {
        this.listName = name
        this.dialogVisible = true
      }
    },
    watch: {
      self() {
        this.getPosts()
        this.checkRelationship()
      }
    },
    components: {
      Criticism,
      FollowingFollowers,
      Swiper
    }
  }
</script>
