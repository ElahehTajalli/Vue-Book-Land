<template>
  <div
    class="flexbox align-center justify-center text-center full-height not_found"
  >
    <el-row>
      <el-col :span="24" class="text-center">
        <img src="../assets/images/not-found.png" />
        <h2>{{ $t('page_not_found') }}</h2>
        <router-link
          :to="{ name: `${isAuthenticated ? 'Home' : 'Dashboard'}` }"
          class="link"
        >
          {{ $t('go_to_dashboard') }}
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['isAuthenticated'])
    }
  }
</script>
