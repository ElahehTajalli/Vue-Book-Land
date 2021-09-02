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
            <div>
              <span @click="handleRouting('MyLibrary')">
                {{ $t('my_library') }}
              </span>
              <span @click="handleRouting('MyPostsList')">
                {{ $t('my_criticisms') }}
              </span>
              <span @click="handleRouting('Profile')">
                {{ $t('my_profile') }}
              </span>
              <span @click="handleRouting('Chat')"
                >{{ $t('my_messages') }}
              </span>
              <span @click="showDialog()">
                {{ $t('add_post') }}
              </span>
              <span @click="handleRouting('BookList')">
                {{ $t('books') }}
              </span>
            </div>
          </Drawer>
          <AddPost
            :dialogVisible="dialogVisible"
            @close-dialog="dialogVisible = false"
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

  export default {
    name: 'app',
    data() {
      return {
        windowWidth: window.innerWidth,
        showOffcanvas: false,
        pagesWithoutSidebar: ['ViewMention', 'Activate'],
        allowedPagesForUsersWithNoTeam: ['Settings'],
        dialogVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'userDialogVisible',
        'userDialogContent',
        'isCollapse',
        // 'isMobile',
        'teams',
        'user',
        'announcements',
        'showMenu'
      ])
    },
    methods: {
      ...mapActions([
        // 'setIsMobile',
        'toggleUserDialog',
        'setShowMenu'
      ]),
      toggle() {
        this.setShowMenu(!this.showMenu)
      },
      showDialog() {
        this.toggle()
        this.dialogVisible = true
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
    // created () {
    //   this.setIsMobile(isMobileOnly)
    // },
    watch: {
      // $route () {
      //   let { teams, allowedPagesForUsersWithNoTeam } = this
      //   if (teams !== null &&
      //      teams.length === 0 &&
      //      allowedPagesForUsersWithNoTeam.indexOf(this.$route.name) === -1) {
      //     this.$router.push({
      //       name: `Activate`
      //     })
      //   }
      // }
    },
    created() {
      window.addEventListener('resize', this.getWidthOnResize)
    },
    destroyed() {
      window.removeEventListener('resize', this.getWidthOnResize)
    },
    components: {
      TopNav,
      // MobileTopNav,
      FooterContent,
      Drawer,
      AddPost
      // AddToHomeScreen,
    }
  }
</script>
