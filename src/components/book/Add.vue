<template>
  <div>
    <el-dialog
      :title="$t('add_book')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-escape="false"
      :show-close="false"
      width="40rem"
      top="5vh"
      class="small add-book"
    >
      <el-form :model="addBookForm" ref="addBook" :rules="rules">
        <div class="flexbox wrap item">
          <el-form-item :label="$t('book.name')" prop="name">
            <el-input v-model="addBookForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('book.author')" prop="author">
            <el-select
              v-model="addBookForm.author"
              filterable
              allow-create
              default-first-option
              :placeholder="$t('choose')"
            >
              <el-option
                v-for="item in authors"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="flexbox wrap item">
          <el-form-item :label="$t('book.publisher')" prop="publisher">
            <el-input v-model="addBookForm.publisher"></el-input>
          </el-form-item>
          <el-form-item :label="$t('book.genre')" prop="genre">
            <el-input v-model="addBookForm.genre"></el-input>
          </el-form-item>
        </div>
        <div class="flexbox wrap item">
          <el-form-item
            :label="$t('book.publication_year')"
            prop="publication_year"
          >
            <el-input
              type="number"
              v-model="addBookForm.publication_year"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('book.translator')" prop="translator">
            <el-select
              v-model="addBookForm.translator"
              filterable
              allow-create
              default-first-option
              :placeholder="$t('choose')"
            >
              <el-option
                v-for="item in translators"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="$t('book.summary')" prop="summary">
          <el-input
            type="textarea"
            class="rtl"
            resize="none"
            v-model="addBookForm.summary"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('book.image')" prop="image">
          <el-upload
            :class="showImage ? 'hide-with-add-photo' : ''"
            action="#"
            id="pick-avatar"
            :disabled="showImage"
            :show-file-list="showImage"
            :file-list="imageList"
            list-type="picture-card"
            :on-change="handleAvatarSuccess"
            :auto-upload="false"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="imageUrl"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogShow">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <div class="text-center">
          <el-button
            :loading="loading"
            class="ml-10"
            type="primary"
            @click="validateAndSubmitForm('addBook', addBook)"
          >
            {{ $t('add') }}
          </el-button>
          <el-button @click="handleClose"> {{ $t('close') }} </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="showCroppButton"
      :close-on-click-modal="false"
      :close-on-escape="false"
      width="40rem"
      top="7vh"
      class="show-image"
    >
      <cropper
        :style="`display:${showCropper}`"
        :src="imageUrl"
        ref="cropper"
        :stencil-props="{
          aspectRatio: 2 / 3
        }"
      ></cropper>
      <div class="flexbox align-center justify-center mt-2-rem">
        <el-button @click="saveImage">{{ $t('crop') }}</el-button>
        <el-button @click="$refs.cropper.zoom(1.5)"
          ><i class="el-icon-zoom-in"></i
        ></el-button>
        <el-button @click="$refs.cropper.zoom(0.5)"
          ><i class="el-icon-zoom-out"></i
        ></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Cropper } from 'vue-advanced-cropper'
  import 'vue-advanced-cropper/dist/style.css'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        authors: [],
        translators: [],
        loading: false,
        dialogImageUrl: '',
        disabled: false,
        showImage: false,
        imageFile: '',
        file: '',
        imageUrl: '',
        imageError: '',
        sizeError: '',
        imageList: [],
        showCropper: '',
        dialogShow: false,
        showCroppButton: false,
        addBookForm: {
          name: '',
          author: '',
          publisher: '',
          genre: '',
          publication_year: '',
          translator: '',
          image: '',
          summary: ''
        },
        rules: {
          name: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ],
          author: [
            {
              required: true,
              message: this.$i18n.t('field_required')
            }
          ],
          publisher: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ],
          publication_year: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ],
          genre: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ],
          image: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
      this.handleGetAuthors()
      this.handleGetTranslators()
    },
    methods: {
      ...mapActions(['handleRequest', 'setBooks']),
      addBook() {
        this.loading = true
        let formData = new FormData()
        for (let [key, value] of Object.entries(this.addBookForm)) {
          if (value) {
            formData.append(key, value)
          }
        }
        formData.append('image', this.imageFile)
        this.handleRequest({
          name: 'books/add',
          action: 'create',
          data: formData
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: this.$i18n.t('the_book_was_successfully_added')
            })

            this.handleClose()
            this.loading = false
          })
          .catch(() => {
            this.loading = false
            this.$message({
              type: 'error',
              message: this.$i18n.t(
                'your_request_has_encountered_a_problem_please_try_again'
              )
            })
          })
      },
      handleClose() {
        this.$emit('close-dialog')
        this.$refs['addBook'].resetFields()
        this.imageList = []
        this.file = ''
        this.imageFile = ''
        this.addBookForm.image = ''
        this.showImage = false
      },
      handleGetAuthors() {
        this.handleRequest({
          name: 'users/get_authors',
          action: 'getAll',
          data: {
            query: {
              sort: 'rate:desc'
            }
          }
        }).then((res) => {
          this.authors = res.data.authors
        })
      },
      handleGetTranslators() {
        this.handleRequest({
          name: 'users/get_translators',
          action: 'getAll',
          data: {
            query: {
              sort: 'rate:desc'
            }
          }
        }).then((res) => {
          this.translators = res.data.translators
        })
      },
      handleRemove() {
        this.imageList = []
        this.showImage = false
        this.showCropper = 'block'
        this.addBookForm.image = ''
      },
      handleAvatarSuccess(res, file) {
        let index = file.length - 1
        const isJPG =
          file[index].raw.type === 'image/png' ||
          file[index].raw.type === 'image/jpg' ||
          file[index].raw.type === 'image/jpeg'
        const isLt2M = file[index].size / 1024 / 1024 < 1
        if (!isJPG) {
          this.imageError = this.$i18n.t('unsupported_image_type')
        }
        if (!isLt2M) {
          this.sizeError = this.$i18n.t('extra_size')
        }
        if (isJPG && isLt2M) {
          this.sizeError = ''
          this.imageError = ''
          this.file = file[index]
          this.imageFile = file[index].raw
          this.imageList = [file[index]]
          this.imageUrl = URL.createObjectURL(file[index].raw)
          this.showImage = true
          this.showCroppButton = true
        } else {
          if (this.imageError) {
            this.$message.error(this.imageError)
          } else {
            this.$message.error(this.sizeError)
          }
          this.showImage = false
          this.imageList = []
        }
      },
      saveImage() {
        const { canvas } = this.$refs.cropper.getResult()
        this.showCropper = 'none'
        this.showCroppButton = false
        this.imageUrl = canvas.toDataURL()
        canvas.toBlob((blob) => {
          this.file = new File([blob], this.file.name)
          this.imageFile = new File([blob], this.file.name)
        }, this.file.raw.type)
        this.addBookForm.image = this.imageFile
      }
    },
    components: {
      Cropper
    }
  }
</script>
