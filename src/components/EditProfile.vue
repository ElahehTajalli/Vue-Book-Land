<template>
  <div>
    <el-dialog
      :title="$t('edit_information')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-escape="false"
      :show-close="false"
      width="40rem"
      top="7vh"
      class="small add-book"
    >
      <el-form :model="editForm" ref="editUser" :rules="rules">
        <div class="flexbox wrap item">
          <el-form-item :label="$t('first_name')" prop="first_name">
            <el-input v-model="editForm.first_name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('last_name')" prop="last_name">
            <el-input v-model="editForm.last_name"></el-input>
          </el-form-item>
        </div>
        <div class="flexbox wrap item">
          <el-form-item :label="$t('persian_username')" prop="persian_username">
            <el-input v-model="editForm.persian_username"></el-input>
          </el-form-item>
        </div>
        <el-form-item :label="$t('image')" prop="image">
          <div v-if="oldImage" class="old-image">
            <img :src="'http://ketabland.pythonanywhere.com' + oldImage" />
            <span class="el-upload-list__item-actions" slot="default">
              <span
                class="el-upload-list__item-delete"
                @click="handleDeletePhoto()"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
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
            <i v-if="!oldImage" slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="imageUrl"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
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
            @click="validateAndSubmitForm('editUser', editUser)"
          >
            {{ $t('edit') }}
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
          aspectRatio: 1
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
      },
      self: {
        typeof: Object,
        default: () => {}
      }
    },
    data() {
      return {
        loading: false,
        dialogImageUrl: '',
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
        passLength: false,
        latinPass: false,
        passNumber: false,
        persianPass: false,
        isEmailExists: false,
        isShow: false,
        oldImage: this.self?.image,
        editForm: {
          first_name: this.self?.first_name,
          last_name: this.self?.last_name,
          persian_username: this.self?.persian_username,
          image: ''
        },
        rules: {
          first_name: [
            {
              required: true,
              message: this.$i18n.t('field_required'),
              trigger: 'blur'
            }
          ],
          last_name: [
            {
              required: true,
              message: this.$i18n.t('field_required')
            }
          ],
          persian_username: [
            {
              required: true,
              message: this.$i18n.t('field_required')
            }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['handleRequest', 'setSelf']),
      editUser() {
        this.loading = true
        let formData = new FormData()
        for (let [key, value] of Object.entries(this.editForm)) {
          if (value) {
            formData.append(key, value)
          }
        }
        if (this.imageFile) {
          formData.append('image', this.imageFile)
        }
        formData.append('email', this.self.email)
        this.handleRequest({
          name: 'users/edit',
          action: 'patch',
          data: { toPatch: formData }
        })
          .then((res) => {
            this.$message({
              type: 'success',
              message: this.$i18n.t('your_profile_was_successfully_edited')
            })
            this.setSelf(res.data)
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
        this.imageList = []
        this.file = ''
        this.imageFile = ''
        this.showImage = false
        this.oldImage = this.self.image
      },
      handleRemove() {
        this.imageList = []
        this.imageFile = ''
        this.showImage = false
        this.showCropper = 'block'
      },
      handleDeletePhoto() {
        this.oldImage = ''
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
      }
    },
    watch: {
      self() {
        this.editForm.first_name = this.self.first_name
        this.editForm.last_name = this.self.last_name
        this.editForm.persian_username = this.self.persian_username
        this.oldImage = this.self.image
      }
    },
    components: {
      Cropper
    }
  }
</script>
