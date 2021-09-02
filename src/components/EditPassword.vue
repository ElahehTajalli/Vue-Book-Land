<template>
  <div>
    <el-dialog
      :title="$t('edit_password')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-escape="false"
      :show-close="false"
      width="40rem"
      top="7vh"
      class="small add-book"
    >
      <el-form :model="editForm" ref="editUser" :rules="rules">
        <el-form-item :label="$t('password')" prop="password">
          <el-input
            autocomplete="new-password"
            @focus="isShow = true"
            @blur="isShow = false"
            type="password"
            v-model="editForm.password"
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
        <div class="text-center" style="paddingTop:1rem">
          <el-button
            :loading="loading"
            class="ml-10"
            type="primary"
            @click="validateAndSubmitForm('editUser', editUser)"
          >
            {{ $t('edit') }}
          </el-button>
          <el-button @click="handleClose"> {{ $t('close') }} </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import {
    passwordLength,
    latinPassword,
    passwordNumber,
    persianPassword,
    correctPassword
  } from '@/utils/patterns'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      self: {
        typeof: Object,
        default: () => {}
      }
    },
    data() {
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
          console.log('else')
          this.setPasswordValidation()
          callback()
        }
      }
      return {
        loading: false,
        dialogImageUrl: '',
        passLength: false,
        latinPass: false,
        passNumber: false,
        persianPass: false,
        isShow: false,
        editForm: {
          password: ''
        },
        rules: {
          password: [
            {
              required: true,
              validator: checkPassword
            }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['handleRequest', 'setSelf']),
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
      editUser() {
        this.loading = true

        this.handleRequest({
          name: 'users/forgot_password',
          action: 'patchUser',
          data: {
            toPatch: {
              email: this.self.email,
              password: this.editForm.password
            }
          }
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: this.$i18n.t('your_password_was_successfully_edited')
            })
            this.handleClose()
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
            if (error.response.status === 400) {
              this.$message({
                type: 'error',
                message: this.$i18n.t(
                  'user_with_this_persian_username_already_exists'
                )
              })
            } else {
              this.$message({
                type: 'error',
                message: this.$i18n.t(
                  'your_request_has_encountered_a_problem_please_try_again'
                )
              })
            }
          })
      },
      handleClose() {
        this.$emit('close-dialog')
        this.$refs['editUser'].resetFields()
      }
    }
  }
</script>
