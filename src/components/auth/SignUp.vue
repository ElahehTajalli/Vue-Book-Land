<template>
  <div class="signup-page">
    <div class="logo text-center mb-10" @click="changeRoute('Dashboard')">
      {{ $t('book_land') }}
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('signup') }}</span>
      </div>
      <div>
        <el-steps
          :active="activeStep"
          align-center
          finish-status="success"
          class="mb-15 text-right"
          style="margin-bottom:30px;"
        >
          <el-step :title="$t('insert_info')"></el-step>
          <el-step :title="$t('complete_profile')"></el-step>
        </el-steps>

        <el-form
          v-show="activeStep === 0"
          :model="signUpForm"
          :rules="rules"
          ref="signUpForm"
          label-position="top"
          :disabled="loading"
        >
          <el-form-item prop="fname">
            <el-input
              class="ltr text-right"
              :placeholder="$t('fname')"
              v-model="signUpForm.fname"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="lname">
            <el-input
              class="ltr text-right"
              :placeholder="$t('lname')"
              v-model="signUpForm.lname"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              autocomplete="new-email"
              class="ltr text-right"
              :placeholder="$t('email')"
              v-model="signUpForm.email"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="flexbox align-center justify-center no_margin">
            <el-button
              type="primary"
              @click="handleRegisterFormSubmit"
              :loading="loading"
            >
              {{ $t('next_step') }}
            </el-button>
          </el-form-item>
          <div class="text-center buttons_div">
            <el-button type="text" @click="changeRoute('Dashboard')">
              {{ $t('main_page') }}
            </el-button>
            |
            <el-button
              type="text"
              @click="changeRoute('Login')"
              class="no_margin"
            >
              {{ $t('login') }}
            </el-button>
          </div>
        </el-form>

        <el-form
          class="signup-text"
          v-show="activeStep === 1"
          label-position="top"
          :disabled="loading"
        >
          <span>
            {{
              $t('please_enter_form_that_is_sent_to_email', {
                email: signUpForm.email
              })
            }}
          </span>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { email } from '@/utils/patterns'
  export default {
    data() {
      const getSignUpForm = () => {
        return {
          fname: '',
          lname: '',
          email: ''
        }
      }
      const checkEmail = (rule, value, callback) => {
        if (!value.length) {
          callback(new Error(this.$i18n.t('insert_your_email')))
        } else if (!email.test(value)) {
          callback(new Error(this.$i18n.t('insert_valid_email')))
        } else {
          callback()
        }
      }

      return {
        loading: false,
        rules: {
          fname: [
            {
              message: this.$i18n.t('insert_your_fname'),
              required: true,
              trigger: 'blur'
            }
          ],
          lname: [
            {
              message: this.$i18n.t('insert_your_lname'),
              required: true,
              trigger: 'blur'
            }
          ],
          email: [
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ]
        },
        activeStep: 0,
        forms: ['signUpForm'],
        callbacks: [this.handleSignUp],
        signUpForm: getSignUpForm(),
        isShow: false,
        isEmailExists: false
      }
    },
    computed: {
      ...mapGetters(['user']),
      currentForm() {
        return this.forms[this.activeStep]
      },
      currentCallback() {
        return this.callbacks[this.activeStep]
      }
    },
    methods: {
      ...mapActions(['handleRequest']),
      disableLoading() {
        this.loading = false
      },
      handleRegisterFormSubmit() {
        let { currentForm, currentCallback } = this
        this.$refs[currentForm].validate((valid) => {
          if (valid) {
            this.loading = true
            currentCallback()
          } else {
            return false
          }
        })
      },
      handleSignUp() {
        let formData = new FormData()
        formData.append('first_name', this.signUpForm.fname)
        formData.append('last_name', this.signUpForm.lname)
        formData.append('email', this.signUpForm.email)
        this.handleRequest({
          name: 'users/register',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.disableLoading()
            this.activeStep = 1
          })
          .catch((error) => {
            this.disableLoading()
            this.$message({
              type: 'error',
              message: this.$i18n.t(error.response.data.errors.email),
              customClass: 'bg-error-dark'
            })
          })
      },
      handleKeyPress(e) {
        let { key } = e
        if (key === 'Enter') {
          e.preventDefault()
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
