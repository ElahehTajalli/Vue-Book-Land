
export default {
  methods: {
    flexCurrency (value) {
      if (value > 999) {
        const val = parseInt(value)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return value
    }
  }
}
