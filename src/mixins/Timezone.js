import moment from 'moment-timezone'
export default {
  methods: {
    momentGetTimezone (datetime) {
      return moment.utc(datetime).tz('Asia/Tehran')
    }
  }
}
