<template>
  <div class="page">
    <el-container class="project">
      <el-header
        :style="`${windowWidth > 940 ? 'height: 60px' : 'height: 110px'}`"
        class="hidden-sm-and-down"
      >
        <top-nav />
      </el-header>
      <el-container>
        <el-main :class="$route.name !== null ? $route.name.toLowerCase() : ''">
          <Drawer
            @close="toggle"
            align="right"
            :closeable="true"
            v-if="showMenu"
          >
            <div class="items">
              <div class="item" @click="handleRouting('MyLibrary')">
                <img src="../assets/images/shelf.png" />
                <span>
                  {{ $t('my_library') }}
                </span>
              </div>
              <div class="item" @click="handleRouting('MyPostsList')">
                <img src="../assets/images/naghdha.png" />
                <span>
                  {{ $t('my_criticisms') }}
                </span>
              </div>
              <div class="item profile" @click="handleRouting('Profile')">
                <img src="../assets/images/profile.png" />
                <span>
                  {{ $t('my_profile') }}
                </span>
              </div>
              <div class="item" @click="handleRouting('Chat')">
                <img src="../assets/images/envelope.svg" />
                <span>{{ $t('my_messages') }} </span>
              </div>
              <div class="item" @click="showDialog()">
                <img src="../assets/images/add-naghd.png" />
                <span>
                  {{ $t('add_post') }}
                </span>
              </div>
              <div class="item" @click="showQuoteDialog()">
                <img src="../assets/images/add_quote.svg" />
                <span>
                  {{ $t('add_quote') }}
                </span>
              </div>
              <div class="item" @click="showQuoteListDialog()">
                <img
                  src="https://img.icons8.com/material-rounded/48/000000/quote-left.png"
                />
                <span>
                  {{ $t('quotes') }}
                </span>
              </div>
              <div class="item" @click="handleRouting('BookList')">
                <img src="../assets/images/ketabha.png" />
                <span>
                  {{ $t('books') }}
                </span>
              </div>
            </div>
          </Drawer>
          <AddPost
            :dialogVisible="dialogVisible"
            @close-dialog="dialogVisible = false"
          />
          <AddQuote
            :dialogVisible="quoteDialogVisible"
            @close-dialog="quoteDialogVisible = false"
          />
          <List
            :dialogVisible="quoteListDialogVisible"
            @close-dialog="quoteListDialogVisible = false"
          />
          <div class="main-page">
            <router-view :key="$route.fullPath" />
            <el-footer>
              <footer-content />
            </el-footer>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import TopNav from '@/components/TopNav'
  import FooterContent from '@/components/FooterContent'
  import Drawer from 'vue-simple-drawer'
  import AddPost from '@/components/post/Add'
  import AddQuote from '@/components/quote/Add'
  import List from '@/components/quote/List'

  export default {
    name: 'app',
    data() {
      return {
        windowWidth: window.innerWidth,
        showOffcanvas: false,
        pagesWithoutSidebar: ['ViewMention', 'Activate'],
        allowedPagesForUsersWithNoTeam: ['Settings'],
        dialogVisible: false,
        quoteDialogVisible: false,
        quoteListDialogVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'userDialogVisible',
        'userDialogContent',
        'isCollapse',
        'teams',
        'user',
        'announcements',
        'showMenu'
      ])
    },
    methods: {
      ...mapActions(['toggleUserDialog', 'setShowMenu']),
      toggle() {
        this.setShowMenu(!this.showMenu)
      },
      showDialog() {
        this.toggle()
        this.dialogVisible = true
      },
      showQuoteDialog() {
        this.toggle()
        this.quoteDialogVisible = true
      },
      showQuoteListDialog() {
        this.toggle()
        this.quoteListDialogVisible = true
      },
      handleRouting(name) {
        this.toggle()
        if (this.$router.history.current.name !== name) {
          this.$router.push({ name })
        }
      },
      getWidthOnResize() {
        this.windowWidth = window.innerWidth
      }
    },
    created() {
      window.addEventListener('resize', this.getWidthOnResize)
    },
    destroyed() {
      window.removeEventListener('resize', this.getWidthOnResize)
    },
    components: {
      TopNav,
      FooterContent,
      Drawer,
      AddPost,
      AddQuote,
      List
    }
  }
</script>
