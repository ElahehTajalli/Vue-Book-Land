<template>
  <div class="contacts" v-loading.fullscreen.lock="loading">
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('messages')">
        <div class="items">
          <div
            v-for="(c, index) in contacts"
            :key="c.id"
            :class="
              `item ${c.id == Number($route.params.id) ? 'active-tab' : ''}`
            "
            @click="setRoute(index)"
          >
            <img
              class="user-picture"
              v-if="c.image"
              :src="'http://ketabland.pythonanywhere.com' + c.image"
            />
            <img
              v-else
              class="user-picture"
              src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
            />
            <div>
              <span class="detail">{{ c.persian_username }}</span>
              <div class="flexbox row-direction div-detail">
                <span class="detail">
                  {{
                    c.persian_username !== lastMessages[index]['user_name']
                      ? $t('you')
                      : lastMessages[index]['user_name']
                  }}:
                </span>
                <span class="detail">
                  {{ lastMessages[index][c.persian_username] }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('following')">
        <div class="items">
          <div
            v-for="c in following"
            :key="c.follower.id"
            class="item"
            @click="setRoute(c.follower.id, false)"
          >
            <img
              class="user-picture"
              v-if="c.follower.image"
              :src="'http://ketabland.pythonanywhere.com' + c.follower.image"
            />
            <img
              v-else
              class="user-picture"
              src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
            />
            <div>
              <span class="detail user-detail">{{
                c.follower.persian_username
              }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('contacts') }}</span>
      </div>
      
    </el-card> -->
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        contacts: [],
        lastMessages: [],
        chats: [],
        ids: [],
        timer: 0,
        loading: false,
        following: []
      }
    },
    async created() {
      this.loading = true
      this.timer = setInterval(this.getData, 1000)
      this.self ? await this.getContacts() : ''
    },
    computed: {
      ...mapGetters(['self'])
    },
    methods: {
      ...mapActions(['handleRequest']),
      getData() {
        this.handleRequest({
          name: 'chats/',
          action: 'getAll'
        }).then((res) => {
          this.chats = res.data.messages
          this.setContacts()
        })
      },
      setContacts() {
        this.contacts = []
        this.lastMessages = []
        for (let i = 0; i < this.chats.length; i++) {
          if (
            this.chats[i].sender.id !== this.self.id &&
            this.contacts
              .map((e) => {
                return e.persian_username
              })
              .indexOf(this.chats[i].sender.persian_username) < 0
          ) {
            this.contacts.push(this.chats[i].sender)
            this.lastMessages.push({
              [this.chats[i].sender.persian_username]: this.chats[i].text,
              user_id: this.chats[i].sender.id,
              user_name: this.chats[i].sender.persian_username
            })
          } else if (
            this.chats[i].receiver.id !== this.self.id &&
            this.contacts
              .map((e) => {
                return e.persian_username
              })
              .indexOf(this.chats[i].receiver.persian_username) < 0
          ) {
            this.contacts.push(this.chats[i].receiver)
            this.lastMessages.push({
              [this.chats[i].receiver.persian_username]: this.chats[i].text,
              user_id: this.chats[i].receiver.id,
              user_name: this.chats[i].sender.persian_username
            })
          }
        }
        this.loading = false
      },
      setRoute(index, isChat = true) {
        if (isChat) {
          console.log(this.lastMessages[index])
          if (this.lastMessages[index]['user_id'] != this.$route.params.id) {
            this.$router.push({
              name: 'ChatID',
              params: { id: this.lastMessages[index]['user_id'] }
            })
          }
        } else {
          this.$router.push({
            name: 'ChatID',
            params: { id: index }
          })
        }
      },
      getContacts() {
        this.handleRequest({
          name: 'users/getRelationships',
          action: 'getAll',
          data: {
            query: {
              following_id: this.self.id
            }
          }
        }).then((res) => {
          this.following = res.data.relationships
        })
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    watch: {
      self() {
        this.getContacts()
      }
    }
  }
</script>
