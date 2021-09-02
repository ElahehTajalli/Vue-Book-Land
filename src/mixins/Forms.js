import {
  password as passwordPattern,
  url as urlPattern
} from '@/utils/patterns'

export default {
  methods: {
    checkNewPassword (rule, value, callback) {
      if (!passwordPattern.test(value)) {
        callback(new Error(this
          .$i18n.t('message.password_should_be_eight_characters_and_must_contain_at_least_one_number_and_one_letter')))
      } else {
        callback()
      }
    },
    checkUrl (rule, value, callback) {
      if (!urlPattern.test(value)) {
        callback(new Error(this
          .$i18n.t('message.url_validator')))
      } else {
        callback()
      }
    },
    validateAndSubmitForm (formName, callback) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          callback()
        } else {
          return false
        }
      })
    }
  }
}
