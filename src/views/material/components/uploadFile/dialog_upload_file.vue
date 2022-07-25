<template>
  <!-- 带弹窗的上传组件 -->
  <div>
    <el-dialog :title="title" append-to-body :close-on-click-modal="false" :visible.sync="showDialog" width="800px" @close="showDialog = false">
      <xlc-upload-file v-model="sysAttachmentList" :limit="limit" :file-type="fileType" />
      <!-- file-type:文件类型限制用|分隔 如png|jpg|jpeg|gif -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitHandle()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import uploadFile from '../../components/uploadFile/index.vue'
  import LoginManager from '@/utils/LoginManager'
  export default {

    components: {
      'xlc-upload-file': uploadFile,
    },
    data() {
      return {
        sysAttachmentList: [],//文件列表
        showDialog: false,
      }
    },
    props: {
      limit: {
        type: Number,
        default: null
      },
      fileType: {
        type: Array,
        default: function () {
          return null
        }
      }, // 文件类型限制用|分隔 如png|jpg|jpeg|gif
    },
    created() {
    },
    watch: {
    },
    computed: {
      title() {

        return '上传'
      },
    },
    methods: {
      // 新增 / 修改
      addOrUpdateHandle: function (info, supplierId, isRegister = true) {
        this.sysAttachmentList = []
        this.showDialog = true

      },
      submitHandle() {
        if (this.sysAttachmentList.length < 1) {
          this.$message({
            message: '请选择文件',
            type: 'warning'
          });
          return
        }
        this.$emit('fileList', this.sysAttachmentList)
        this.showDialog = false
      },
    }
  }


</script>

<style lang="scss" scoped>

</style>
