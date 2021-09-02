import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions(['setToken']),
    setTokens(token) {
      window.localStorage.setItem('token', token)
      this.setToken(token)
    },
    logout() {
      window.localStorage.removeItem('token')
      this.setToken('')
      this.$router.push({ name: 'Dashboard' })
    }
  }
}
