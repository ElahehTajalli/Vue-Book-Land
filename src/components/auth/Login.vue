<template>
  <div class="login-page">
    <div class="logo text-center mb-10" @click="changeRoute('Dashboard')">
      {{ $t('book_land') }}
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('login') }}</span>
      </div>
      <div>
        <el-form
          :model="loginForm"
          ref="loginForm"
          label-position="top"
          :rules="rules"
          :disabled="loading"
        >
          <el-form-item prop="email">
            <el-input
              autocomplete="new-email"
              class="ltr text-right"
              :placeholder="$t('email')"
              v-model="loginForm.email"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              autocomplete="new-password"
              type="password"
              class="ltr text-right"
              :placeholder="$t('password')"
              v-model="loginForm.password"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="flexbox align-center justify-center no_margin">
            <el-button
              type="primary"
              @click="handleLoginFormSubmit"
              :loading="loading"
            >
              {{ $t('login') }}
            </el-button>
          </el-form-item>
          <div class="text-center buttons_div">
            <el-button type="text" @click="changeRoute('Dashboard')">
              {{ $t('main_page') }}
            </el-button>
            |
            <el-button
              type="text"
              @click="changeRoute('SignUp')"
              class="no_margin"
            >
              {{ $t('signup') }}
            </el-button>
            |
            <el-button
              type="text"
              class="no_margin"
              @click="changeRoute('ForgotPassword')"
            >
              {{ $t('forgot_password') }}
            </el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        loading: false,
        loginForm: {
          email: '',
          password: ''
        },
        forms: ['loginForm'],
        callbacks: [this.handleLoginForm],
        rules: {
          email: [
            {
              message: this.$i18n.t('insert_your_email'),
              required: true,
              trigger: 'blur'
            }
          ],
          password: [
            {
              message: this.$i18n.t('insert_your_password'),
              required: true,
              trigger: 'blur'
            }
          ]
        }
      }
    },
    // computed: {
    //   ...mapGetters(['lastRequestedPath'])
    // },
    methods: {
      ...mapActions(['handleRequest']),
      disableLoading() {
        this.loading = false
      },
      handleLoginFormSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true
            this.handleLoginForm()
          } else {
            return false
          }
        })
      },
      handleLoginForm() {
        let formData = new FormData()
        formData.append('email', this.loginForm.email)
        formData.append('password', this.loginForm.password)
        this.handleRequest({
          name: 'users/login',
          action: 'create',
          data: formData
        })
          .then((res) => {
            this.disableLoading()
            this.setTokens(res.token)
            this.$router.push({
              path: `/home`
            })
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: this.$i18n.t(error.response.data.errors),
              customClass: 'bg-error-dark'
            })
            this.disableLoading()
          })
      },
      handleKeyPress(e) {
        let { key } = e
        if (key === 'Enter') {
          e.preventDefault()
          this.handleLoginFormSubmit()
        }
      },
      changeRoute(name) {
        this.$router.push({ name })
      }
    },
    created() {
      document.addEventListener('keypress', this.handleKeyPress)
    },
    beforeDestroy() {
      document.removeEventListener('keypress', this.handleKeyPress)
    }
  }
</script>
