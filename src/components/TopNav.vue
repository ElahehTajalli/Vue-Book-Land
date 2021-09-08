<template>
  <div
    :class="`main-topnav flexbox ${windowWidth <= 940 ? 'mobile-topnav' : ''}`"
  >
    <div class="topnav">
      <div class="flexbox align-center justify-center">
        <img
          v-if="isAuthenticated"
          @click="toggle"
          class="menu"
          src="https://img.icons8.com/material-outlined/24/FFFFFF/menu--v1.png"
        />
        <img
          class="logo"
          @click="handleRouting('Dashboard')"
          src="../assets/images/logo1.jpg"
        />
        <b @click="handleRouting('Dashboard')">
          {{ $t('book_land') }}
        </b>
        <el-select
          v-if="windowWidth > 940"
          clearable
          v-model="search"
          filterable
          remote
          reserve-keyword
          :placeholder="$t('search_book')"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            @click="showBook(item.id)"
          >
            <div @click="showBook(item.id)">
              <span>{{ item.name }}</span>
              <span style="display:block">{{ item.author.name }}</span>
            </div>
          </el-option>
        </el-select>
      </div>
      <div class="flexbox align-center justify-center" v-if="!isAuthenticated">
        <el-button
          type="text"
          class="signup"
          @click="$router.push({ name: 'SignUp' })"
        >
          {{ $t('signup') }}
        </el-button>
        <el-button class="login mr-10" @click="$router.push({ name: 'Login' })">
          {{ $t('login') }}
        </el-button>
      </div>
      <div
        class="flexbox align-center justify-center"
        v-if="isAuthenticated && windowWidth > 940"
      >
        <span class="email ml-10" v-if="self">
          {{ self.persian_username }}
        </span>
        <el-button type="text" class="signup" @click="handleRouting('Home')">
          {{ $t('my_page') }}
        </el-button>
        <el-button class="login mr-10" @click="logout">
          {{ $t('logout') }}
        </el-button>
      </div>
      <el-dropdown v-if="isAuthenticated && windowWidth <= 940" trigger="click">
        <span class="email el-dropdown-link" v-if="self">
          {{ self.persian_username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" v-if="self">
          <el-dropdown-item>
            <span @click="handleRouting('Home')">
              {{ $t('my_page') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item class="text-center">
            <span @click="logout">
              {{ $t('logout') }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-select
      v-if="windowWidth <= 940"
      v-model="search"
      filterable
      clearable
      remote
      reserve-keyword
      :placeholder="$t('search_book')"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
        <div @click="showBook(item.id)">
          <span>{{ item.name }}</span>
          <span style="display:block">{{ item.author.name }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        windowWidth: window.innerWidth,
        options: [],
        search: [],
        loading: false,
        books: []
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'self', 'showMenu'])
    },
    methods: {
      ...mapActions([
        'handleRequest',
        'setFullscreen',
        'setSelf',
        'setBooks',
        'setShowMenu'
      ]),
      getData() {
        this.handleRequest({
          name: 'users/self',
          action: 'getAll'
        })
          .then((res) => {
            this.setSelf(res.data)
          })
          .finally(() => {
            this.setFullscreen(false)
          })
      },
      getWidthOnResize() {
        this.windowWidth = window.innerWidth
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options = this.books.filter((item) => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.options = []
        }
      },
      getBooks() {
        this.handleRequest({
          name: 'books/list',
          action: 'getAll',
          data: {
            query: {
              sort: 'created_at:desc'
            }
          }
        }).then((res) => {
          this.books = res.data.books
        })
      },
      handleRouting(name) {
        if (this.$router.history.current.name !== name) {
          this.$router.push({ name })
        }
      },
      toggle() {
        this.setShowMenu(!this.showMenu)
      },
      showBook(id) {
        this.$router.push({ name: 'ViewBook', params: { id } })
      }
    },
    created() {
      this.getData()
      this.getBooks()
      window.addEventListener('resize', this.getWidthOnResize)
    },
    destroyed() {
      window.removeEventListener('resize', this.getWidthOnResize)
    }
  }
</script>
