<template>
    <div>
        <el-upload multiple :accept="acceptType" :disabled="!showButton"
            ref="upload" class="upload-demo" :class="{hide:hideUpload}" action="#"
            :file-list="value" :limit="limit"
            :before-remove="beforeRemove" :on-remove="handleRemove"
            :on-change="handleChange" :auto-upload="false"
            :on-exceed="onExceed" :on-preview="onPreview">
            <el-button :disabled="!showButton" slot="trigger" size="small" type="primary" plain>
                <i class="fa fa-folder" /> 选取文件
            </el-button>
        </el-upload>
        <preview-image ref="PreviewImage" />
    </div>
</template>
<script>
import { downLoadBlob, callDownLoadByBlob } from "@/utils/downLoad.js";
import tools from "@/utils/tools.js";
import LoginManager from '@/utils/LoginManager'

export default {
    components: {
        PreviewImage: () => import('../../components/PreviewImage/index.vue'),
    },
    name: 'uploadFile',
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
            type: String,
            default: ''
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
        }, // 文件列表中的图片临时list
        pidList:{
            type: Array,
            default: function () {
                return []
            }
        }, //删除前调用的方法
        beforeRemoveFun: {
            type: Function,
            default: () => {
                return new Promise((resolve, reject) => {
                    resolve();
                })
            },
        }, //附件所属表
        attachPtable: {
            type: String,
            default: ''
        }, //附件模块名
        attachMoudle: {
            type: String,
            default: ''
        }, //附件pid
        attachPid: {
            type: String,
            default: ''
        },
    },
    data () {
        return {
            hideUpload: this.value.length >= this.limit,
            acceptType: ".jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt,.pdf,.ppt,.pptx,.rar,.zip,.pdf,.7z,.mp4,.mp3,.mpeg4,.rmvb,.avi,.dwg",
            base64Data: {
                '.txt': 'data:text/plain;base64,',
                '.doc': 'data:application/msword;base64,',
                '.docx': 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,',
                '.xls': 'data:application/vnd.ms-excel;base64,',
                '.xlsx': 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
                '.pdf': 'data:application/pdf;base64,',
                '.pptx': 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,',
                '.ppt': 'data:application/vnd.ms-powerpoint;base64,',
                '.png': 'data:image/png;base64,',
                '.jpg': 'data:image/jpeg;base64,',
                '.gif': 'data:image/gif;base64,',
                '.svg': 'data:image/svg+xml;base64,',
                '.ico': 'data:image/x-icon;base64,',
                '.bmp': 'data:image/bmp;base64,',
            }
        }
    },
    watch: {
        value: function (v) {
            this.hideUpload = v.length >= this.limit
        },
    },
    beforeUpdate () {
        for (const file of this.value) {
            file.name = file.mark
            this.$set(file, 'name', file.mark)
        }
    },
    methods: {
        //删除前调用
        beforeRemove(file, fileList) {
            return new Promise((resolve, reject) => {
                this.beforeRemoveFun(file, fileList).then(result => {
                    resolve(result);
                }).catch(err => {
                    console.log('err', err);
                    reject(err)
                })
            });
        },
        // 删除选择附件
        async handleRemove(file, fileList) {
            let delRes = await this.$http.delete(`/api/sys_attachment/${file.uuid}`)
            if (delRes.data.success) {
                for (let i = 0; i < this.value.length; i++) {
                    if (this.value[i].name === file.name) {
                        this.value.splice(i, 1)
                        break
                    }
                }
                this.hideUpload = fileList.length >= this.limit
                this.$emit('input', this.value)
            }
        },
        //上传前调用 判断文件格式和大小
        handleBeforeUpload(file) {
            const fileName = file.name
            const ext = fileName
                .substring(fileName.lastIndexOf('.') + 1)
                .toLowerCase()
            // 限制文件格式
            if (this.fileType) {
                if (this.fileType.indexOf(ext) < 0) {
                    this.$message.error('文件类型不合法，请上传' + this.fileType.replace(/\|/g,',') + '类型的文件')
                    this.$refs.upload.uploadFiles.splice(this.$refs.upload.uploadFiles.length - 1, 1)
                    return false
                }
            }
            // 限制文件大小，单位为k
            if (this.fileSize) {
                if (file.size / 1024 > this.fileSize) {
                    this.$message.error('文件大小限制为' + this.fileSize + 'k')
                    this.$refs.upload.uploadFiles.splice(this.$refs.upload.uploadFiles.length - 1, 1)
                    return false
                }
            }
            return true
        },
        // 添加附件：base64
        handlePreview (file, fileList) {
            if (this.handleBeforeUpload(file)) {
                const that = this
                const reader = new FileReader()
                reader.readAsDataURL(file.raw)
                const temp = file.name.split('.')
                reader.onload = function () {
                    const base64 = reader.result.split(',')[1]
                    that.value.push({
                        name: file.name, // 显示值
                        mark: file.name, // 显示值
                        base64: base64,
                        path: '', // 路径
                        file: file.raw,
                        ext: '.' + temp[temp.length - 1] // 扩展名
                    })
                }
                this.$emit('input', this.value)
                this.hideUpload = fileList.length >= this.limit
            }
        },
        // 上传附件：文件流
        async handleChange(file, fileList) {
            if (this.handleBeforeUpload(file)) {
                const formData = new FormData()
                formData.append('userId', LoginManager.getUserInfo().uuid)
                // formData.append('userId', 'supplier_user_uuid')

                formData.append('ptable', this.attachPtable)
                formData.append('moudle', this.attachMoudle)
                formData.append('pid', this.attachPid)

                console.log('附件ptable', this.attachPtable)
                console.log('附件moudle', this.attachMoudle)
                console.log('附件pid', this.attachPid)

                const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
                formData.append('ext', '.' + ext)
                formData.append('files', file.raw)

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
            }
        },
        onExceed () {
            this.$notify({ title: 'error', message: '只允许上传' + this.limit + '个文件' })
        },
        onPreview (file) {
            this.downLoadPreviewFileFun(file)
        },
        //下载文件或者预览图片
        downLoadPreviewFileFun (file) {
            //图片
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
                    //打开预览弹窗
                    this.$refs.PreviewImage.addOrUpdateHandle(imgPath)
                    return
                }
            }
            //文件
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
                this.$message({
                    message: '找不到base64或fullpath，无法下载',
                    type: 'warning'
                });
            }
        },

    }
}
</script>

<style>
.el-upload-list .el-upload-list__item {
    transition: none !important;
    color: brown !important;
}
</style>
