<template>
  <div class="signup-page">
    <div class="logo text-center mb-10" @click="changeRoute('Dashboard')">
      {{ $t('book_land') }}
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('forgot_password') }}</span>
      </div>
      <div>
        <el-steps
          :active="activeStep"
          align-center
          finish-status="success"
          class="mb-15 text-right"
          style="margin-bottom:30px;"
        >
          <el-step :title="$t('insert_email')"></el-step>
          <el-step :title="$t('verification_code')"></el-step>
          <el-step :title="$t('change_password')"></el-step>
          <el-step :title="$t('login')"></el-step>
        </el-steps>

        <el-form
          v-show="activeStep === 0"
          :rules="rules"
          :model="emailForm"
          ref="emailForm"
          label-position="top"
          :disabled="loading"
        >
          <el-form-item prop="email">
            <el-input
              autocomplete="new-email"
              class="ltr text-right"
              :placeholder="$t('email')"
              v-model="emailForm.email"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="flexbox align-center justify-center no_margin">
            <el-button
              type="primary"
              @click="handleChangePasswordFormSubmit"
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
          v-show="activeStep === 1"
          :model="verificationCodeForm"
          ref="verificationCodeForm"
          label-position="top"
          :disabled="loading"
        >
          <el-form-item
            prop="code"
            :rules="[{ message: $t('insert_your_code'), trigger: 'blur' }]"
          >
            <small>
              {{
                $t('please_enter_verification_code_that_is_sent_to_email', {
                  email: emailForm.email
                })
              }}
            </small>
            <el-input
              class="ltr text-right mt-10"
              :placeholder="$t('verification_code')"
              v-model="verificationCodeForm.code"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="flexbox align-center justify-center no_margin">
            <el-button
              type="primary"
              @click="handleCheckVerificationCode"
              :loading="loading"
            >
              {{ $t('next_step') }}
            </el-button>
            <el-button @click="goToStepOne" :loading="loading" class="mt-15">
              {{ $t('reset') }}
            </el-button>
          </el-form-item>
        </el-form>

        <el-form
          v-show="activeStep === 2"
          :model="passwordForm"
          :rules="passwordRules"
          ref="passwordForm"
          label-position="top"
          :disabled="loading"
        >
          <el-form-item prop="password">
            <el-input
              autocomplete="new-password"
              type="password"
              class="ltr text-right"
              @focus="isShow = true"
              @blur="isShow = false"
              v-model="passwordForm.password"
              :placeholder="$t('password')"
            ></el-input>
            <div v-if="isShow" class="password-validation">
              <el-checkbox v-model="passLength" disabled>{{
                $t('eight_characters_or_longer')
              }}</el-checkbox>
              <el-checkbox v-model="latinPass" disabled>{{
                $t('contain_at_least_one_alphabetical_character')
              }}</el-checkbox>
              <el-checkbox v-model="passNumber" disabled>{{
                $t('contain_at_least_one_numeric_character')
              }}</el-checkbox>
              <el-checkbox v-model="persianPass" disabled>{{
                $t('use_english_character_and_numbers')
              }}</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item prop="confirm_password">
            <el-input
              type="password"
              class="ltr text-right"
              :placeholder="$t('confirm_password')"
              v-model="passwordForm.confirm_password"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="flexbox align-center justify-center no_margin">
            <el-button
              type="primary"
              @click="handleChangePasswordFormSubmit"
              :loading="loading"
            >
              {{ $t('change_password') }}
            </el-button>
            <el-button @click="goToStepOne" :loading="loading" class="mt-15">
              {{ $t('reset') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import {
    passwordLength,
    latinPassword,
    passwordNumber,
    persianPassword,
    correctPassword,
    email
  } from '@/utils/patterns'
  export default {
    data() {
      const getVerificationCodeForm = () => {
        return {
          code: ''
        }
      }
      const getPasswordForm = () => {
        return {
          password: '',
          confirm_password: ''
        }
      }
      const getEmailForm = () => {
        return {
          email: ''
        }
      }
      const checkPassword = (rule, value, callback) => {
        this.resetPasswordValidation()
        if (value === '') {
          callback(new Error(this.$i18n.t('insert_your_password')))
        } else if (
          !correctPassword.test(value) ||
          persianPassword.test(value)
        ) {
          if (passwordLength.test(value)) {
            this.passLength = true
            callback(new Error(this.$i18n.t('wrong_password')))
          }
          if (latinPassword.test(value)) {
            this.latinPass = true
            callback(new Error(this.$i18n.t('wrong_password')))
          }
          if (passwordNumber.test(value)) {
            this.passNumber = true
            callback(new Error(this.$i18n.t('wrong_password')))
          }
          if (!persianPassword.test(value) && value.length) {
            this.persianPass = true
            callback(new Error(this.$i18n.t('wrong_password')))
          }
        } else {
          this.setPasswordValidation()
          callback()
        }
      }
      const checkConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(
            new Error(this.$i18n.t('please_insert_password_confirmation'))
          )
        } else if (value !== this.passwordForm.password) {
          callback(new Error(this.$i18n.t('passwords_do_not_match')))
        } else {
          callback()
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
          email: [
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ]
        },
        passwordRules: {
          password: [
            {
              validator: checkPassword,
              required: true
            }
          ],
          confirm_password: [
            {
              validator: checkConfirmPassword,
              required: true,
              trigger: 'blur'
            }
          ]
        },
        activeStep: 0,
        forms: ['emailForm', 'verificationCodeForm', 'passwordForm'],
        callbacks: [
          this.handleEmail,
          this.handleCheckVerificationCode,
          this.handlePassword
        ],
        passwordForm: getPasswordForm(),
        emailForm: getEmailForm(),
        verificationCodeForm: getVerificationCodeForm(),
        isShow: false,
        passLength: false,
        latinPass: false,
        passNumber: false,
        persianPass: false,
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
      resetPasswordValidation() {
        this.passLength = false
        this.latinPass = false
        this.passNumber = false
        this.persianPass = false
      },
      setPasswordValidation() {
        this.passLength = true
        this.latinPass = true
        this.passNumber = true
        this.persianPass = true
      },
      handleChangePasswordFormSubmit() {
        let { currentForm, currentCallback } = this
        this.$refs[currentForm].validate((valid) => {
          if (valid) {
            if (this.activeStep === 1) {
              this.resetPasswordValidation()
            }
            this.loading = true
            currentCallback()
          } else {
            return false
          }
        })
      },
      handleEmail() {
        let formData = new FormData()
        formData.append('email', this.emailForm.email)
        this.handleRequest({
          name: 'users/found_user',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.disableLoading()
            this.activeStep = 1
          })
          .catch((error) => {
            this.disableLoading()
            this.showError(error)
          })
      },
      handlePassword() {
        this.handleRequest({
          name: 'users/forgot_password',
          action: 'patchUser',
          data: {
            toPatch: {
              email: this.emailForm.email,
              password: this.passwordForm.password
            }
          }
        })
          .then((res) => {
            this.disableLoading()
            this.setTokens(res.token)
            this.$router.push({ path: `/home` })
          })
          .catch((error) => {
            this.disableLoading()
            this.showError(error)
          })
      },
      changeRoute(name) {
        this.$router.push({ name })
      },
      handleCheckVerificationCode() {
        let formData = new FormData()
        formData.append('email', this.emailForm.email)
        formData.append('code', this.verificationCodeForm.code)
        this.handleRequest({
          name: 'users/check_verification',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.disableLoading()
            this.activeStep = 2
          })
          .catch((error) => {
            this.disableLoading()
            this.showError(error)
          })
      },
      goToStepOne() {
        this.activeStep = 0
        this.$refs['passwordForm'].resetFields()
        this.$refs['emailForm'].resetFields()
        this.$refs['verificationCodeForm'].resetFields()
      },
      showError(error) {
        this.$message({
          type: 'error',
          message: this.$i18n.t(error.response.data.errors),
          customClass: 'bg-error-dark'
        })
      }
    }
  }
</script>
