<template>
  <div class="chats" v-loading.fullscreen.lock="loading">
    <Contacts />
    <Messages v-if="$route.params.id" />
    <div v-else class="no-selected">
      <img src="../assets/images/no-selected.svg" />
      <span>{{ $t('no_contact_selected') }}</span>
    </div>
  </div>
</template>

<script>
  import Contacts from '@/components/chat/Contacts'
  import Messages from '@/components/chat/Messages'

  export default {
    data() {
      return {
        loading: false
      }
    },
    components: {
      Contacts,
      Messages
    }
  }
</script>
