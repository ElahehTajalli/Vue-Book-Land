<template>
  <div class="messages" v-loading.fullscreen.lock="loading">
    <el-card>
      <div slot="header" class="clearfix">
        <div>
          <img
            class="user-picture"
            v-if="user.image"
            :src="'http://ketabland.pythonanywhere.com' + user.image"
          />
          <img
            v-else
            class="user-picture"
            src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
          />
          <span class="bold-title">{{ user.persian_username }}</span>
        </div>
        <el-button type="primary" @click="routeTo()">
          {{ $t('show_profile') }}
        </el-button>
      </div>
      <div class="main">
        <div class="chats">
          <span
            v-for="c in chats"
            :key="c.id"
            :class="c.receiver.id === self.id ? 'receiver' : 'sender'"
          >
            {{ c.text }}
          </span>
        </div>
      </div>
    </el-card>
    <div class="bottom">
      <el-input v-model="message" />
      <el-button type="primary" @click="sendMessage()">
        {{ $t('send') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        chats: [],
        user: {},
        loading: false,
        message: '',
        timer: 0
      }
    },
    created() {
      this.loading = true
      this.timer = setInterval(this.getData, 1000)
    },
    computed: {
      ...mapGetters(['self'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      getData() {
        this.handleRequest({
          name: 'chats',
          action: 'getOne',
          data: {
            id: this.$route.params.id
          }
        })
          .then((res) => {
            this.chats = res.data.messages
            this.user = res.data.user
          })
          .finally(() => {
            this.loading = false
          })
      },
      sendMessage() {
        let formData = new FormData()
        formData.append('receiver', this.$route.params.id)
        formData.append('text', this.message)

        this.handleRequest({
          name: 'chats/',
          action: 'create',
          data: formData
        }).then((res) => {
          this.chats.push(res)
          this.message = ''
        })
      },
      routeTo() {
        this.$router.push({
          name: 'ViewUser',
          params: { id: this.$route.params.id }
        })
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  }
</script>
