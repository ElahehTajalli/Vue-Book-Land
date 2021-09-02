<template>
  <el-dialog
    :title="$t(listName)"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-escape="false"
    :show-close="false"
    width="30rem"
    top="7vh"
    class="small"
  >
    <div v-if="users.length && listName" class="user">
      <div
        v-for="u in users"
        :key="u.id"
        :class="`user-item ${u[listName].id === self.id ? 'you' : ''}`"
        @click="showUser(u[listName].id)"
      >
        <img
          v-if="u[listName].image"
          :src="'http://ketabland.pythonanywhere.com' + u[listName].image"
        />
        <img
          v-else
          src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
        />
        <div class="detail-item">
          <span v-if="u[listName].id !== self.id">{{
            u[listName].persian_username
          }}</span>
          <span v-else>{{ $t('you') }}</span>
        </div>
      </div>
    </div>
    <el-button @click="handleClose"> {{ $t('close') }} </el-button>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      users: {
        typeof: Array,
        default: () => []
      },
      listName: {
        typeof: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters(['self'])
    },
    methods: {
      handleClose() {
        this.$emit('close-dialog')
      },
      showUser(id) {
        if (id === this.self.id) {
          this.$router.push({ name: 'Profile' })
        } else {
          this.$router.push({ name: 'ViewUser', params: { id } })
        }
      }
    }
  }
</script>
