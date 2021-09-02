<template>
  <div class="self-profile">
    <div class="profile">
      <div class="profile-div informations">
        <div class="image">
          <el-card size="mini">
            <img
              class="profile-picture"
              v-if="self && self.image"
              :src="'http://ketabland.pythonanywhere.com' + self.image"
            />
            <img
              v-else
              class="profile-picture"
              src="https://img.icons8.com/cotton/64/000000/person-male--v2.png"
            />
          </el-card>
        </div>
        <div>
          <el-card size="mini" class="data">
            <span>{{ $t('fname') }}: {{ self ? self.first_name : '' }}</span>
            <span>{{ $t('lname') }}: {{ self ? self.last_name : '' }}</span>
            <span
              >{{ $t('persian_username') }}:
              {{ self ? self.persian_username : '' }}</span
            >
            <span>{{ $t('email') }}: {{ self ? self.email : '' }}</span>
          </el-card>
        </div>
      </div>
      <div class="profile-div">
        <div @click="dialogVisible = true">
          <el-card size="mini">
            <img src="../assets/images/profile_edit.png" />
            <span>{{ $t('edit_profile') }}</span>
          </el-card>
        </div>
        <div @click="passwordDialogVisible = true">
          <el-card size="mini">
            <img src="../assets/images/profile_pass.png" />
            <span>{{ $t('edit_password') }}</span>
          </el-card>
        </div>
      </div>
    </div>
    <Edit
      :dialogVisible="dialogVisible"
      @close-dialog="handleCloseDialog()"
      :self="self"
    />
    <EditPassword
      :dialogVisible="passwordDialogVisible"
      @close-dialog="handleCloseDialog()"
      :self="self"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Edit from '@/components/EditProfile.vue'
  import EditPassword from '@/components/EditPassword.vue'

  export default {
    data() {
      return {
        dialogVisible: false,
        passwordDialogVisible: false
      }
    },
    computed: {
      ...mapGetters(['self'])
    },
    methods: {
      handleCloseDialog() {
        this.dialogVisible = false
        this.passwordDialogVisible = false
      }
    },
    components: {
      Edit,
      EditPassword
    }
  }
</script>
