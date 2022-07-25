<template>
  <div>
    <!-- <el-upload ref="upload" action="#" multiple list-type="picture-card" :auto-upload="false" :before-upload="beforeUpload" :on-change="handleChange" :on-success="handleSuccess"
      :on-remove="handleRemove" :limit="4" accept="image/jpg, image/jpeg,image/png" :file-list="fileList"> -->
    <el-upload ref="upload" action="#" multiple list-type="picture-card" :auto-upload="false" :before-upload="beforeUpload" :on-change="handleChange" :on-success="handleSuccess"
      :on-remove="handleRemove" :limit="4" :file-list="fileList" accept=".jpg,.png,.tiff,.bmp,.doc,.docx">
      <!-- <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div>{{pid}}</div>
    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>

          <el-popconfirm confirm-button-text='删除' cancel-button-text='取消' icon="el-icon-info" icon-color="red" :title="'确定删除？'" @confirm="handleRemove(file)">
            <span v-if="!disabled" slot="reference" class="el-upload-list__item-delete">
              <i class="el-icon-delete"></i>
            </span>
          </el-popconfirm>

          <!-- <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span> -->
        </span>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png/tiff/bmp文件，且不超过500kb</div> -->
      </div>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import LoginManager from '@/utils/LoginManager'
// import { compressAccurately } from 'image-conversion'
export default {
  props: {
    pid: {
      type: Number,
      default: -1
    },
    moudle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [], // 附件列表
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  watch: {
    pid: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        this.fileList = [] // 重置文件显示列表
        newValue > 0 && this.getFileList()
      }
    }
  },
  // created() {
  //   this.onload && this.getFileList()
  // },
  methods: {
    getFileList() {
      this.$http
        .post('/api/sys_attachment/findByEntity', {
          ptable: 'FinanceContractInfo',
          pid: this.pid,
          moudle: this.moudle
        })
        .then((response) => {
          if (response.data.success) {
            // 读取图片base64
            response.data.data.records.forEach((item) => {
              this.getFileBase64(this.moudle, item.uuid, item.ext, item.path)
            })
          } else {
            console.log('获取附件列表失败！')
          }
        })
    },
    getFileBase64(moudle, uuid, ext, path) {
      this.$http
        .get(`/public/sys_attachment/getDetail/${uuid}`, {
          responseType: 'blob'
        })
        .then((res) => {
          this.fileList.push({
            name: moudle,
            uuid: uuid,
            ext: ext,
            path: path,
            // url: window.URL.createObjectURL(res.data)
            url: this.noImgExtBack(ext, res.data) // 生成文件的路径
          })
        })
    },
    // 判断扩展名是否是图片型，不是的话则下载
    noImgExtBack(ext, res) {
      let path
      switch (ext) {
        case 'xls':
          path = require('@/assets/images/material/xls.png')
          break
        case 'xlsx':
          path = require('@/assets/images/material/xlsx.png')
          break
        case 'doc':
          path = require('@/assets/images/material/doc.png')
          break
        case 'docx':
          path = require('@/assets/images/material/docx.png')
          break
        case 'pdf':
          path = require('@/assets/images/material/pdf.png')
          break
        case 'txt':
          path = require('@/assets/images/material/txt.png')
          break
        case 'rar':
          path = require('@/assets/images/material/rar.png')
          break
        case 'zip':
          path = require('@/assets/images/material/zip.png')
          break
        default:
          path = window.URL.createObjectURL(res)
          break
      }
      return path
    },
    // 上传附件之前，判断文件类型和大小
    beforeUpload(file) {
      alert(file)
    },
    // 上传附件
    async handleChange(file, fileList) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extJpg = fileSuffix === 'jpg'
      const extPng = fileSuffix === 'png'
      const extBmp = fileSuffix === 'bmp'
      const extTiff = fileSuffix === 'tiff'
      const extDoc = fileSuffix === 'doc'
      const extDocx = fileSuffix === 'docx'
      const extXls = fileSuffix === 'xls'
      const extXlsx = fileSuffix === 'xlsx'
      const extPdf = fileSuffix === 'pdf'
      if (!extJpg && !extPng && !extBmp && !extTiff && !extDoc && !extDocx && !extXls && !extXlsx && !extPdf) {
        alert('上传文件只能是 jpg、png、bmp、tiff、pdf、doc、docx、xls、xlsx格式', 'error')
      }
      if (extJpg || extPng || extBmp || extTiff || extDoc || extDocx || extXls || extXlsx || extPdf) {
        // ---------------------------------------------------------
        const formData = new FormData()
        // formData.append('uuid', '')
        formData.append('userId', LoginManager.getUserInfo().uuid)
        formData.append('ptable', 'FinanceContractInfo')
        formData.append('moudle', this.moudle)
        // formData.append('mark', '')
        formData.append('pid', this.pid)
        // formData.append('path', '')
        // formData.append('fullPath', '')
        // formData.append('ext', '.jpg')
        const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
        formData.append('ext', '.' + ext)

        // const fileCompress = await compressAccurately(file.raw, {
        //   size: 150, // 需要压缩的大小
        //   accuracy: 0.9, // 精度 0.8-0.99之间 默认值0.95
        //   type: 'image/jpeg',
        //   width: 105,
        //   height: 105,
        //   orientation: 2,
        //   scale: 0.5
        // })

        formData.append('files', file.raw)
        // formData.append('base64', file.raw)

        console.log('上传：formDataPid', formData.getAll('pid'))

        this.$http.post('/api/uploadfiles', formData).then((res) => {
          if (res.data.success) {
            this.$notify({
              title: 'ok',
              message: res.data.msg,
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg,
              type: 'error'
            })
          }
        })

        // ---------------------------------------------------------
      }
    },

    // 删除附件列表
    handleRemove(file) {
      console.log(file)
      this.$http.delete(`/api/sys_attachment/${file.uuid}`).then((res) => {
        this.fileList.splice(
          this.fileList.findIndex((item) => item.uuid === file.uuid),
          1
        )
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 下载文件
    handleDownload(file) {
      console.log(file)
      const a = document.createElement('a')
      const url = file.url
      var filename = file.uuid + '.' + file.ext
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    },
    // 未使用到
    handleSuccess(file, fileList) {
      console.log('handleSuccess', fileList)
      // console.log('TCL: handleUpload -> file', file)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
