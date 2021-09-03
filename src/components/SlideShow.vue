<template>
  <div class="slide-show swiper-custom" v-if="quotes.length">
    <swiper class="swiper" :options="swiperOption" v-if="quotes.length">
      <swiper-slide v-for="(b, i) in quotes" :key="b.id" v-show="i < count">
        <div class="main">
          <img
            v-if="b.image"
            :src="'http://ketabland.pythonanywhere.com' + b.image"
          />
          <div class="data">
            <span class="author">{{ b.author }}</span>
            <span class="text">{{ b.text }}</span>
            <span v-if="b.book" class="book">{{ b.book }}</span>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
    <div class="flexbox column-direction align-center justify-center logo">
      <img src="../assets/images/quote.png" />
      <span class="title">{{ $t('quotes') }}</span>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  export default {
    props: {
      quotes: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        showDialog: false,
        count: 5,
        swiperOption: {
          centeredSlides: true,
          autoplay: {
            delay: 6000,
            disableOnInteraction: false
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
      }
    },
    components: {
      Swiper,
      SwiperSlide
    }
  }
</script>
