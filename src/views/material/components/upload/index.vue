<template>
  <div class="index">
    <el-upload multiple list-type="picture-card" :disabled="!showButton" ref="upload" class="upload-demo"
               :on-change="handlePreview" :file-list="value"
               :auto-upload="false" :limit="limit" action="#" :class="{hide:hideUpload}"
               :on-exceed="onExceed" :on-preview="onPreview">
      <!--        <el-button :disabled="!showButton" slot="trigger" size="small" type="primary" plain><i class="fa fa-folder" /> 选取文件</el-button>-->

      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.path" alt=""
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="showButton"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import alioss from '@/utils/alioss'
  import { downLoadBlob } from "@/utils/downLoad.js";
  export default {
    name: 'index',
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        hideUpload: false
      }
    },

    props: {
      isCorp: {
        type: Boolean,
        default: false
      },
      showButton: {
        type: Boolean,
        default: true
      },
      limit: {
        type: Number,
        default: 3
      },
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      fileType: {
        type: Array,
        default: function () {
          return []
        }
      }, // 文件类型限制用|分隔 如png|jpg|jpeg|gif
      fileSize: {
        type: Number,
        default: null
      }, // 文件大小限制，单位为K
      downloadPreviewFile: {
        type: Boolean,
        default: false
      }, // 文件列表中的文件是否可以下载
      previewImg: {
        type: Boolean,
        default: false
      }, // 文件列表中的图片是否开启下载
    },

    //监听属性 类似于data概念",
    computed: {},

    //监控data中的数据变化",
    watch: {
      // value(v) {
      //   console.log("v",v)
      //   for (let element of v) {
      //     console.log("element",element)
      //     if(element){
      //       console.log("element",element)
      //       switch (element.ext.toLowerCase()) {
      //         case '.xls':
      //         case '.xlsx':
      //           element.url = 'https://shouliaoxitong.oss-cn-zhangjiakou.aliyuncs.com/imagefile/wordicon.png';
      //           break
      //         case '.doc':
      //         case '.docx':
      //           element.url = 'http://shouliaoxitong.oss-cn-zhangjiakou.aliyuncs.com/2022-5-5/716436d5ad2643c98e5e7a85ed2e3d39.png';
      //           break
      //         case '.ppt':
      //         case '.pptx':
      //           element.url = 'https://shouliaoxitong.oss-cn-zhangjiakou.aliyuncs.com/imagefile/ppticon.png';
      //           break
      //         case '.pdf':
      //           element.url = 'https://shouliaoxitong.oss-cn-zhangjiakou.aliyuncs.com/imagefile/pdficon.png';
      //           break
      //         default:
      //           element.url = element.ossFile;
      //       }
      //     }
      //   }
      //   this.hideUpload = v.length >= this.limit
      // },
    },

    methods: {
      handlePictureCardPreview(file) {
        console.log("file",file)
        this.dialogImageUrl = file.path;
        this.dialogVisible = true;
      },
      handleBeforeUpload (file) {
        const fileName = file.name
        const ext = fileName
          .substring(fileName.lastIndexOf('.') + 1)
          .toLowerCase()
        if (this.fileType) {
          // 限制文件格式
          if (this.fileType.indexOf(ext) < 0) {
            this.$message.error('文件类型不合法，请上传' + this.fileType + '类型的文件')
            this.$refs.upload.uploadFiles.splice(this.$refs.upload.uploadFiles.length - 1, 1)
            return false
          }
        }
        if (this.fileSize) {
          // 限制文件大小，单位为k
          if (file.size / 1024 > this.fileSize) {
            this.$message.error('文件大小限制为' + this.fileSize + 'k')
            this.$refs.upload.uploadFiles.splice(this.$refs.upload.uploadFiles.length - 1, 1)
            return false
          }
        }
      },
      // 移除选择附件
      handleRemove (file, fileList) {
        for (let i = 0; i < this.value.length; i++) {
          if (this.value[i].name === file.name) {
            this.value.splice(i, 1)
            break
          }
        }
      },
      // 添加附件
      handlePreview (file, fileList) {
        if (this.handleBeforeUpload(file) !== false) {
          let oss = new alioss();
          const that = this
          const reader = new FileReader()
          reader.readAsDataURL(file.raw)
          const temp = file.name.split('.')
          reader.onload = async function () {
            const base64 = reader.result.split(',')[1]
            // const progress = (p, _checkpoint) => {
            //   that.percentage = parseInt(p * 100)
            //   that.isProgressVis = true
            // };
            // let fileUrl = await oss.uploadAudio(file.raw,progress);
            let fileUrl = await oss.uploadAudio(file.raw);
            console.log(fileUrl)
            that.isProgressVis = false
            that.value.push({
              name: file.name, // 显示值
              mark: file.name, // 显示值
              // base64: base64,
              path: fileUrl, // 路径
              file: file.raw,
              ossFile: fileUrl,
              ext: '.' + temp[temp.length - 1] // 扩展名
            })
          }
          this.$emit('input', this.value)
          console.log("this.value",this.value)
          console.log("fileList",fileList)
          this.hideUpload = fileList.length >= this.limit
        }

      },
      onExceed () {
        this.$notify({ title: '错误', message: '只允许上传' + this.limit + '个文件' })
      },
      onPreview (file) {
        this.downLoadPreviewFileFun(file)
      },
      downLoadPreviewFileFun (file) {//下载文件或者预览图片

        //文件列表中的图片可以下载
        if (this.previewImg) {
          if (file.ext == '.png' ||
            file.ext == '.jpg' ||
            file.ext == '.jpeg') {
            let imgPath = ''
            //存在base64属性，一般是刚上传的新文件,还没往服务器上传
            if (file.base64) {
              imgPath = this.base64Data[file.ext] + file.base64
            } else if (file.fullPath) {//存在fullPath属性，一般是从服务器得到的文件
              imgPath = file.fullPath
            }
            if(file.ossFile){
              imgPath = file.ossFile
            }
            //打开预览弹窗
            this.$refs.PreviewImage.addOrUpdateHandle(imgPath)
            return
          }
        }
        //文件列表中的文件可以下载
        if (this.downloadPreviewFile) {

          //存在base64属性，一般是刚上传的新文件,还没往服务器上传
          if (file.base64) {
            let base64=''
            //存在 Data URL scheme
            if (file.base64.indexOf('base64')!=-1) {
              base64=file.base64
            }else{//不存在，则拼接出来
              let type = this.base64Data[file.ext] === undefined ? 'data:text/plain;base64,' : this.base64Data[file.ext]
              base64=type + file.base64
            }

            //转成blob对象
            let blob = tools.dataURLtoBlob(base64)
            //下载blob对象
            callDownLoadByBlob(blob, file.name)
            return
          }
          //存在fullPath属性，一般是从服务器得到的文件
          if (file.fullPath) {
            //下载文件
            downLoadBlob(file.fullPath, file.name, '')
            return
          }
          if(file.ossFile){
            downLoadBlob(file.ossFile, file.name, '')
            return
          }
          this.$message({
            message: '找不到base64或fullpath，无法下载',
            type: 'warning'
          });
        }

      },

    },

    //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
    created() {
    },

    //生命周期 - 挂载之前",html模板未渲染
    beforeMount() {
    },

    //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
    mounted() {
    },

    //生命周期 - 更新之前",数据模型已更新,html模板未更新
    beforeUpdate() {
    },

    // 生命周期 - 销毁之前调用
    beforeDestroy() {
    },

    //生命周期 - 更新之后",数据模型已更新,html模板已更新
    updated() {
    },

    //生命周期 - 销毁完成"
    destroyed() {
    },

    //如果页面有keep-alive缓存功能，这个函数会触发",
    activated() {
    }
  }
</script>

<style scoped>
</style>
