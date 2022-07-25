
<template>
    <div>
        <div v-for="(item,i) in sysAttachmentList" :key="i">
            <el-link type="primary" @click="getOneFile(item)"><i class="el-icon-paperclip"></i> {{item.mark}}</el-link>
        </div>
        <preview-image ref="PreviewImage" />
    </div>
</template>

<script>
import { downLoadBlob, callDownLoadByBlob } from "@/utils/downLoad.js";
import tools from "@/utils/tools.js";
import previewImage from "../../components/PreviewImage/index.vue";
export default {
    components: {
        'preview-image': previewImage
    },
    data () {
        return {
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
                '.bmp': 'data:image/bmp;base64,'
            }
        }
    },
    props: {
        sysAttachmentList: { type: Array, default () { return [] } },
    },
    methods: {
        getOneFile (file) {
            if (file.ext == '.png' ||
                file.ext == '.jpg' ||
                file.ext == '.jpeg') {
                let imgPath = ''
                //存在base64属性，一般是刚上传的新文件,还没往服务器上传
                if (file.base64) {
                    imgPath = 'data:text/plain;base64,' + file.base64
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
            if (file.base64) {
                //转成blob对象
                let blob = tools.dataURLtoBlob('data:text/plain;base64,' + file.base64)
                //下载blob对象
                callDownLoadByBlob(blob, file.name)
                return
            }
            //存在fullPath属性，一般是从服务器得到的文件
            if (file.fullPath) {
                if(file.fullPath.indexOf("aliyuncs.com") != -1){
                    //下载文件
                    downLoadBlob(file.fullPath, file.mark, '')
                    return
                }
                window.open(process.env.VUE_APP_BASE_API+'/public/sys_attachment/downloadFile/'+file.uuid);
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
        },
    }
}

</script>

