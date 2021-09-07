<template>
  <div class="swiper-custom" v-if="books.length || users.length">
    <div
      class="flexbox column-direction align-center justify-center logo"
      v-if="
        title !== 'most_popular' &&
          title !== 'most_popular_translators' &&
          title !== 'want_to_read' &&
          title !== 'currently_reading' &&
          title !== $t('want_to_read') &&
          title !== $t('currently_reading')
      "
    >
      <img v-if="title === 'newest'" src="../assets/images/jadidtarinha.png" />
      <img
        v-if="title === 'most_popular_authors'"
        src="../assets/images/nevisande.png"
      />
      <img v-if="title === 'favorites'" src="../assets/images/favorite.svg" />
      <img v-if="title === 'read'" src="../assets/images/favorite3.svg" />
      <img v-if="title === $t('favorites')" src="../assets/images/plan.svg" />
      <img v-if="title === $t('read')" src="../assets/images/plan3.svg" />

      <span class="title" v-if="title.length">{{ $t(title) }}</span>
    </div>
    <swiper class="swiper" :options="swiperOption" v-if="books.length">
      <swiper-slide
        v-for="(b, i) in books"
        :key="b.id"
        v-show="(fromProfile && i < count) || !fromProfile"
      >
        <div @click="showBook(b.id)" class="main">
          <img
            v-if="b.image"
            :src="'http://ketabland.pythonanywhere.com' + b.image"
          />
          <img v-else src="../assets/images/noBook.png" />
          <span class="book-title" @click="showBook(b.id)">{{ b.name }}</span>
          <span class="book-author">{{ b.author.name }}</span>
          <span class="book-publisher">{{ b.publisher }}</span>
          <span class="book-genre">{{ b.genre }}</span>
        </div>
      </swiper-slide>
      <swiper-slide v-if="fromProfile && books.length > count">
        <div class="main" @click="showDialog = true">
          <span>{{ $t('see_all') }}</span>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
    <swiper class="swiper" :options="swiperOption" v-else>
      <swiper-slide v-for="u in users" :key="u.id">
        <div class="main" style="cursor: default">
          <span class="book-title">{{ u.name }}</span>
          <el-rate
            :value="parseFloat((+u.rate).toFixed(2))"
            disabled
            show-score
            text-color="#ff9900"
          >
          </el-rate>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
    <div
      class="flexbox column-direction align-center justify-center logo"
      v-if="
        title === 'most_popular' ||
          title === 'most_popular_translators' ||
          title === 'want_to_read' ||
          title === 'currently_reading' ||
          title === $t('want_to_read') ||
          title === $t('currently_reading')
      "
    >
      <img
        src="../assets/images/mahbobtarinha.png"
        v-if="title === 'most_popular'"
      />
      <img
        src="../assets/images/motarjem.png"
        v-if="title === 'most_popular_translators'"
      />
      <img
        src="../assets/images/favorite2.svg"
        v-if="title === 'want_to_read'"
      />
      <img
        src="../assets/images/favorite4.svg"
        v-if="title === 'currently_reading'"
      />
      <img
        src="../assets/images/plan2.svg"
        v-if="title === $t('want_to_read')"
      />
      <img
        src="../assets/images/plan4.svg"
        v-if="title === $t('currently_reading')"
      />
      <span class="title" v-if="title.length">{{ $t(title) }}</span>
    </div>
    <el-dialog
      :title="$t(title)"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-escape="false"
      :show-close="false"
      width="30rem"
      top="7vh"
      class="small"
    >
      <div class="user">
        <div
          v-for="b in books"
          :key="b.id"
          :class="`user-item`"
          @click="showBook(b.id)"
        >
          <img
            v-if="b.image"
            :src="'http://ketabland.pythonanywhere.com' + b.image"
          />
          <img v-else src="../assets/images/noBook.png" />
          <div class="detail flexbox column-direction">
            <span class="book-title" @click="showBook(b.id)">{{ b.name }}</span>
            <span class="book-author">{{ b.author.name }}</span>
            <span class="book-publisher">{{ b.publisher }}</span>
            <span class="book-genre">{{ b.genre }}</span>
          </div>
        </div>
      </div>
      <el-button @click="showDialog = false"> {{ $t('close') }} </el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  export default {
    props: {
      books: {
        type: Array,
        default: () => []
      },
      users: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: ''
      },
      fromProfile: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showDialog: false,
        count: 4,
        swiperOption: {
          slidesPerView: 5,
          spaceBetween: 50,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          breakpoints: {
            1750: {
              slidesPerView: 4,
              spaceBetween: 20
            },
            1500: {
              slidesPerView: 4,
              spaceBetween: 20
            },
            1250: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1070: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            800: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            520: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            320: {
              slidesPerView: 1,
              spaceBetween: 20
            }
          }
        }
      }
    },
    methods: {
      showBook(id) {
        this.$router.push({ name: 'ViewBook', params: { id } })
      },
      closeDialog() {
        this.showDialog = false
      }
    },
    components: {
      Swiper,
      SwiperSlide
    }
  }
</script>
