<template>
  <div class="criticism">
    <div class="top">
      <div class="detail">
        <img
          class="image"
          src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
        />
        <span v-if="comment.user"> {{ comment.user.persian_username }}</span>
      </div>
    </div>
    <span class="text">{{ comment.text }}</span>
    <div class="bottom">
      <div class="date">
        <img src="https://img.icons8.com/ios/100/184277/planner.png" />
        <span>{{ dateTime }}</span>
      </div>
      <div class="likes">
        <div @click="editComment('dislike')">
          <span>
            {{ new_comment.dislikes.length }}
          </span>
          <img
            src="https://img.icons8.com/material-rounded/24/ff0000/thumbs-down.png"
          />
        </div>
        <div @click="editComment('like')">
          <span>
            {{ new_comment.likes.length }}
          </span>
          <img
            src="https://img.icons8.com/material-rounded/24/00ff30/facebook-like--v1.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import moment from 'moment-jalaali'
  export default {
    data() {
      return {
        jalaliFormat: 'jYYYY/jM/jD',
        new_comment: this.comment
      }
    },
    props: {
      comment: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      ...mapGetters(['self']),
      dateTime() {
        return moment(this.comment.created_at).format(this.jalaliFormat)
      }
    },
    methods: {
      ...mapActions(['handleRequest']),
      editComment(action) {
        this.handleRequest({
          name: 'comments/edit',
          action: 'patch',
          data: {
            toPatch: {
              user: this.self.id,
              comment: this.comment.id,
              action
            }
          }
        }).then((res) => {
          this.new_comment = res.data.comment
        })
      }
    }
  }
</script>
