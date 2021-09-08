<template>
  <div class="signup-page">
    <div class="logo text-center mb-10" @click="changeRoute('Dashboard')">
      {{ $t('book_land') }}
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('complete_profile') }}</span>
      </div>
      <div>
        <el-form
          :model="submitForm"
          :rules="rules"
          ref="submitForm"
          label-position="top"
          :disabled="loading"
        >
          <el-form-item prop="persian_username">
            <el-input
              v-model="submitForm.persian_username"
              :placeholder="$t('persian_username')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              autocomplete="new-password"
              type="password"
              class="ltr text-right"
              @focus="isShow = true"
              @blur="isShow = false"
              v-model="submitForm.password"
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
              class="ltr text-right"
              type="password"
              :placeholder="$t('confirm_password')"
              v-model="submitForm.confirm_password"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="flexbox align-center justify-center no_margin">
            <el-button
              type="primary"
              @click="handleSubmitForm"
              :loading="loading"
            >
              {{ $t('submit') }}
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
    correctPassword
  } from '@/utils/patterns'
  export default {
    data() {
      const getSubmitForm = () => {
        return {
          persian_username: '',
          password: '',
          confirm_password: ''
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
        } else if (value !== this.submitForm.password) {
          callback(new Error(this.$i18n.t('passwords_do_not_match')))
        } else {
          callback()
        }
      }

      return {
        loading: false,
        rules: {
          persian_username: [
            {
              required: true,
              message: this.$i18n.t('field_required')
            }
          ],
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
        submitForm: getSubmitForm(),
        isShow: false,
        passLength: false,
        latinPass: false,
        passNumber: false,
        persianPass: false,
        isEmailExists: false
      }
    },
    computed: {
      ...mapGetters(['user'])
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
      handleSubmitForm() {
        this.$refs.submitForm.validate((valid) => {
          if (valid) {
            this.loading = true
            this.handleSubmit()
          } else {
            return false
          }
        })
      },
      handleSubmit() {
        let formData = new FormData()
        formData.append('persian_username', this.submitForm.persian_username)
        formData.append('password', this.submitForm.password)
        formData.append('email', this.$route.query.email)
        this.handleRequest({
          name: 'users/edit_info',
          action: 'patch',
          data: { toPatch: formData }
        })
          .then((res) => {
            this.disableLoading()
            this.setTokens(res.token)
            this.$router.push({ path: `/home` })
          })
          .catch((error) => {
            this.disableLoading()
            this.$message({
              type: 'error',
              message: this.$i18n.t(
                error.response.data.errors.persian_username
              ),
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
