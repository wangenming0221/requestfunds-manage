<template>
  <div class="draft-container">
    <el-tabs type="card" v-model="tabActiveName" @tab-click="switchTab">
      <el-tab-pane label="合同起草" name="first">
        <div class="tab-type">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="全部类型:">
              <el-button style="margin: 0 12px 12px 0" @click="selectClassificationType({id: ''})">全部</el-button>
              <el-button style="margin: 0 10px 12px 0" v-for="item in allClassificationList" :key="item.id" @click="selectClassificationType(item)">{{ item.cname }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="tab-type" style="margin-top: 10px">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="类型查询">
              <div style="width: 450px">
                <el-input placeholder="请输入合同名称" clearable v-model="classificationParams.contractModelName" @clear="searchContractName" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search" @click="searchContractName"></el-button>
                </el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="type-list">
          <div class="tt-list">
            <ul>
              <li v-for="(item, index) in classificationList" :key="index">
                <div class="type-container">
                  <div class="type-tab">
<!--       :class="{ '': item.cname , 'type-tab-tag1': item.cname.includes('内部'), 'type-tab-tag2': item.cname.includes('专业'), 'type-tab-tag3': item.cname.includes('设备'), 'type-tab-tag4': item.cname.includes('劳务'), 'type-tab-tag5': item.cname.includes('补充'), 'type-tab-tag6': item.cname.includes('采购'), 'type-tab-tag7': item.cname.includes('其他') }"             -->
                    <span class="type-tab-tag5">
                      <img v-if="item.cname.includes('内部')" src="../../../../assets/contract/icon_v003.png" alt="">
                      <img v-else-if="item.cname.includes('专业')" src="../../../../assets/contract/icon_v005.png" alt="">
                      <img v-else-if="item.cname.includes('设备')" src="../../../../assets/contract/icon_v004.png" alt="">
                      <img v-else-if="item.cname.includes('劳务')" src="../../../../assets/contract/icon_v002.png" alt="">
                      <img v-else-if="item.cname.includes('补充')" src="../../../../assets/contract/icon_v001.png" alt="">
                      <img v-else-if="item.cname.includes('采购')" src="../../../../assets/contract/icon_v006.png" alt="">
                      <img v-else-if="item.cname.includes('其他')" src="../../../../assets/contract/icon_v007.png" alt="">
                      <img v-else src="../../../../assets/contract/icon_v007.png" alt="">
                    </span>
                    <span class="type-tab-title">{{ item.cname }}</span>
                  </div>
                  <div class="type-item">
                    <span class="tt-item" v-for="(items, index) in item.conContractModelList" :key="index">
                      <div :class="{ 'tt-bar1': item.cname.includes('内部'), 'tt-bar2': item.cname.includes('专业'), 'tt-bar3': item.cname.includes('设备'), 'tt-bar4': item.cname.includes('劳务'), 'tt-bar5': item.cname.includes('补充'), 'tt-bar6': item.cname.includes('采购'), 'tt-bar7': item.cname.includes('其他') }" />
                      <div class="tt-btn" @click="showContractDraftDialog(items)" style="cursor: pointer">{{ items.contractName }}</div>
                      <div :class="{ 'tt-bg1': item.cname.includes('内部'), 'tt-bg2': item.cname.includes('专业'), 'tt-bg3': item.cname.includes('设备'), 'tt-bg4': item.cname.includes('劳务'), 'tt-bg5': item.cname.includes('补充'), 'tt-bg6': item.cname.includes('采购'), 'tt-bg7': item.cname.includes('其他') }">
                        <img v-if="item.cname.includes('内部')" src="../../../../assets/contract/image_v002.png" alt="">
                        <img v-if="item.cname.includes('专业')" src="../../../../assets/contract/image_v001.png" alt="">
                        <img v-if="item.cname.includes('设备')" src="../../../../assets/contract/image_v003.png" alt="">
                        <img v-if="item.cname.includes('劳务')" src="../../../../assets/contract/image_v004.png" alt="">
                        <img v-if="item.cname.includes('补充')" src="../../../../assets/contract/image_v005.png" alt="">
                        <img v-if="item.cname.includes('采购')" src="../../../../assets/contract/image_v006.png" alt="">
                        <img v-if="item.cname.includes('其他')" src="../../../../assets/contract/image_v007.png" alt="">
                      </div>
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <el-dialog
          title="合同起草流程"
          :visible.sync="contractDraftDialogVisible"
          width="50%"
          top="100px"
          :before-close="handleClose">
          <div class="cdd-main">
            <el-steps :active="cdd_active" finish-status="success" align-center>
              <el-step title="合同申请信息"></el-step>
              <el-step title="合同内容"></el-step>
              <el-step title="合同补充协议"></el-step>
              <el-step title="合同附件上传"></el-step>
              <el-step title="签约方信息"></el-step>
            </el-steps>
            <el-form v-if="cdd_active === 0" :model="formInline" label-width="100px" label-position="left" class="demo-form-inline">
              <div class="inline-div">
                <el-form-item label="申请人">
                  <el-input v-model="formInline.user" placeholder="请输入申请人"></el-input>
                </el-form-item>
                <el-form-item label="申请人电话">
                  <el-input v-model="formInline.user" placeholder="请输入申请人电话"></el-input>
                </el-form-item>
                <el-form-item label="项目相关合同">
                  <el-select v-model="formInline.region" placeholder="选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="项目编码">
                  <el-input v-model="formInline.user" placeholder="请输入申请人电话"></el-input>
                </el-form-item>
                <el-form-item label="财务核算苑区">
                  <el-select v-model="formInline.region" placeholder="选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合同名称">
                  <el-input v-model="formInline.user" placeholder="请输入合同名称"></el-input>
                </el-form-item>
                <el-form-item label="项目承包人">
                  <el-input v-model="formInline.user" placeholder="请输入项目承包人"></el-input>
                </el-form-item>
                <el-form-item label="承包模式">
                  <el-select v-model="formInline.region" placeholder="选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="inline-div">
                <el-form-item label="申请时间">
                  <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="所属分公司">
                  <el-select v-model="formInline.region" placeholder="选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="相关项目">
                  <el-input v-model="formInline.user" placeholder="请输入申请人电话"></el-input>
                </el-form-item>
                <el-form-item label="总包合同">
                  <el-select v-model="formInline.region" placeholder="选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="会计审批人">
                  <el-input v-model="formInline.user" placeholder="请输入会计审批人"></el-input>
                </el-form-item>
                <el-form-item label="合同编码">
                  <el-input v-model="formInline.user" placeholder="请输入合同编码"></el-input>
                </el-form-item>
                <el-form-item label="承包人电话">
                  <el-input v-model="formInline.user" placeholder="请输入承包人电话"></el-input>
                </el-form-item>
                <el-form-item label="合同范本">
                  <el-input v-model="formInline.user" placeholder="请输入合同范本"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <el-form v-if="cdd_active === 1">
              <div class="custom-mount"></div>
            </el-form>
            <el-form v-if="cdd_active === 3">
              <div class="contrast-upload">
                <el-form-item label="上传附件">
                  <el-upload
                    class="upload-demo"
                    action=""
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="3"
                    auto-upload="false"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>
              </div>
            </el-form>
            <el-form v-if="cdd_active === 4" :model="formInline" label-width="120px" label-position="left" class="demo-form-inline">
              <div class="inline-div">
                <el-form-item label="甲方">
                  <el-input v-model="formInline.user" placeholder="请输入甲方"></el-input>
                </el-form-item>
                <el-form-item label="乙方">
                  <el-input v-model="formInline.user" placeholder="请输入乙方"></el-input>
                </el-form-item>
                <el-form-item label="丙方">
                  <el-input v-model="formInline.user" placeholder="请输入丙方"></el-input>
                </el-form-item>
                <el-form-item label="签约代表人">
                  <el-input v-model="formInline.user" placeholder="请输入签约代表人"></el-input>
                </el-form-item>
                <el-form-item label="代表人联系电话">
                  <el-input v-model="formInline.user" placeholder="请输入代表人联系电话"></el-input>
                </el-form-item>
                <el-form-item label="代表人身份证号">
                  <el-input v-model="formInline.user" placeholder="请输入代表人身份证号"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="cdd_active !== 0" @click="onPrev">上一步</el-button>
            <el-button type="primary" @click="onNext">下一步</el-button>
            <el-button type="primary" @click="onSubmit">存草稿</el-button>
            <el-button type="primary" @click="onCancel">取消</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="合同草稿" name="second">
        <!-- 查询筛选 -->
        <el-form class="demo-form-inline" :model="listContractParams" :inline="true">
          <el-form-item label="合同标题">
            <el-input v-model="listContractParams.contractName" placeholder="请输入合同标题" />
          </el-form-item>
          <el-form-item label="合同分类">
            <el-select v-model="listContractParams.classifyCode" @change="handleChangeClassification" placeholder="请选择分类">
              <el-option
                v-for="item in classificationDraftList"
                :key="item.classifyCode"
                :label="item.cname"
                :value="item.classifyCode"
              />
            </el-select>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-select v-model="listContractParams.classifySecondName" @change="handleChangeLastClassification" placeholder="请选择分类">-->
<!--              <el-option-->
<!--                v-for="item in classificationLastDraftList"-->
<!--                :key="item.cname"-->
<!--                :label="item.cname"-->
<!--                :value="item.cname"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="listContractParams.searchTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择创建时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="合同编号">
            <el-input v-model="listContractParams.contractCode" placeholder="请输入合同编号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 合同草稿列表 -->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            align="center"
            label="序号"
            width="50"
          >
            <template slot-scope="scope">
              <span>{{(listContractParams.pageNum - 1) * listContractParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="contractName"
            align="center"
            label="合同标题"
            width="1000"
          />
          <el-table-column
            prop="contractCode"
            align="center"
            label="合同编号"
            width="200"
          />
          <el-table-column
            prop="classifyName"
            align="center"
            label="合同分类"
            width="200"
          >
<!--            <template slot-scope="scope">-->
<!--              <span v-if="scope.row.classify !== null">{{ scope.row.classify.cname }}</span>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            prop="updateTime"
            align="center"
            label="创建时间"
            width="200"
          />
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="editContractDraftInfo(scope.row)"
              >
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            :current-page="queryForm.pageNum"
            :page-size="queryForm.pageSize"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="currentPageChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from '@/api/work/contract'
// import WebOfficeSDK from '../../utils/web-office-sdk-v1.1.14.es'
export default {
  name: 'ContractDraft',
  data() {
    return {
      tabActiveName: 'first',
      form: {

      },
      insideContractType: '1',
      queryForm: {
        classifyName: '',
        classifySecondName: '',
        contractTitle: ''
      },
      tableData: [],
      contractDraftDialogVisible: false,
      cdd_active: 0,
      formInline: {

      },
      allClassificationList: [],
      classificationList: [],
      total: null,
      fileList: [],
      classificationParams: {
        classifyId: '',
        contractModelName: ''
      },
      // 一级分类
      classificationDraftList: [],
      // 联动子分类
      classificationLastDraftList: [],
      listContractParams: {
        contractName: '',
        contractCode: '',
        classifyCode: null,
        searchTime: null,
        pageSize: 10,
        pageNum: 1,
      }
    }
  },
  created() {
    this.listContractStateOne()
    this.getAllClassification()
    this.getFirstClassification()
  },
  methods: {
    // 查询
    searchContractName() {
      this.getAllClassification()
    },
    // 筛选分类
    selectClassificationType(item) {
      console.log(item)
      this.classificationParams.classifyId = item.id
      api.getContractDraftList(this.classificationParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.classificationList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取合同草稿
    listContractStateOne() {
      if (this.listContractParams.searchTime === null) {
        delete this.listContractParams.searchTime
      }
      api.contractName(this.listContractParams).then(res => {
        // debugger
        if (res.code === 0) {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取合同一级分类
    getFirstClassification() {
      api.getContractCategory().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.classificationDraftList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取联动子分类
    getSecondClassification(classifyId) {
      const params = {
        classifyId: null
      }
      params.classifyId = classifyId
      api.getLastChildrenCategory(params).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.classificationLastDraftList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 一级分类
    handleChangeClassification(val) {
      console.log(val)
      this.classificationDraftList.forEach((item, index) => {
        if (item.cname === val) {
          this.getSecondClassification(item.id)
        }
      })
    },
    // 二级分类
    handleChangeLastClassification(val) {
      console.log(val)
    },
    // 获取起草分类
    getAllClassification() {
      if (!this.classificationParams.contractModelName) {
        delete this.classificationParams.contractModelName
      }
      api.getContractDraftList(this.classificationParams).then(res => {
        if (res.code === 0) {
          this.classificationList = res.data
          this.allClassificationList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
      // this.$http.getContractClassification(this.classificationParams).then(res => {
      //   console.log(res)
      //   if (res.code === 1) {
      //     this.classificationList = res.data
      //     this.allClassificationList = res.data
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    switchTab() {

    },
    onQuery() {
      this.listContractStateOne()
    },
    onReset() {
      this.listContractParams = {
        contractName: '',
        contractCode: '',
        classifyCode: null,
        searchTime: null,
        pageSize: 10,
        pageNum: 1,
      }
    },
    onNewAdd() {

    },
    editContractDraftInfo(item) {
      console.log(item)
      const params = {
        id: ''
      }
      params.id = item.id
      api.toupdatebpm(params).then(res => {
        console.log(res)
        if (res.code === 0) {
          console.log(res)
          window.open(item.url + '&T=' + res.data.token)
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    currentPageChange(v) {
      this.listContractParams.pageNum = v;
      this.listContractStateOne()
    },
    showContractDraftDialog(item) {
      const params = {
        classifyId: '',
        contractModelId: ''
      }
      params.classifyId = item.classifyId
      params.contractModelId = item.id
      api.draftClassificationToBPM(params).then(res => {
        if (res.code === 0) {
          window.open(res.data)
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleClose() {
      this.contractDraftDialogVisible = false
    },
    onSubmit() {

    },
    // 上一步
    onPrev() {
      if (this.cdd_active-- < 0) {
        this.cdd_active = 0
      }
    },
    // 下一步
    onNext() {
      if (this.cdd_active++ > 3) {
        this.cdd_active = 4
      }
    },
    onCancel() {
      this.contractDraftDialogVisible = false
    },
    // initWebOffice() {
    //   const js_sdk = WebOfficeSDK.config({
    //     mount: document.querySelector('.custom-mount')
    //   })
    // },

    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleExceed() {}
  }
}
</script>

<style scoped>
/deep/.el-tabs__nav-wrap::after{
  width: 10% !important;
}
.draft-container{
  /* width: 95%;
  margin-left: 2.5%; */
  padding: 20px;
  background-color: #fff;
}
.tab-type {
  width: 100%;
  /*height: 70px;*/
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
  margin-top: 5px;
  padding: 20px;
}
.type-list{
  width: 100%;
  /*height: 800px;*/
  display: flex;
  flex-direction: column;
}
.type-list::-webkit-scrollbar{
  display: none;
}
.type-container{
  width: 100%;
  /*height: 150px;*/
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
  margin-top: 20px;
}
.type-tab{
  width: 100%;
  height: 78px;
  display: flex;
  flex-direction: row;
}
.type-tab-tag1{
  width: 16px;
  height: 20px;
  margin-top: 32px;
  margin-left: 30px;
}
.type-tab-tag2{
  width: 20px;
  height: 16px;
  margin-top: 32px;
  margin-left: 30px;
}
.type-tab-tag3{
  width: 20px;
  height: 18px;
  margin-top: 32px;
  margin-left: 30px;
}
.type-tab-tag4{
  width: 18px;
  height: 20px;
  margin-top: 32px;
  margin-left: 30px;
}
.type-tab-tag5{
  width: 18px;
  height: 20px;
  margin-top: 32px;
  margin-left: 30px;
}
.type-tab-tag6{
  width: 18px;
  height: 20px;
  margin-top: 32px;
  margin-left: 30px;
}
.type-tab-tag7{
  width: 18px;
  height: 20px;
  margin-top: 32px;
  margin-left: 30px;
}
.type-tab-tag1 img{
  width: 100%;
  height: 100%;
}
.type-tab-tag2 img{
  width: 100%;
  height: 100%;
}
.type-tab-tag3 img{
  width: 100%;
  height: 100%;
}
.type-tab-tag4 img{
  width: 100%;
  height: 100%;
}
.type-tab-tag5 img{
  width: 100%;
  height: 100%;
}
.type-tab-tag6 img{
  width: 100%;
  height: 100%;
}
.type-tab-tag7 img{
  width: 100%;
  height: 100%;
}
.type-tab-title{
  font-size: 16px;
  color: #000000;
  font-family: Microsoft YaHei;
  font-weight: 400;
  margin-left: 8px;
  margin-top: 32px;
}
.tt-list{
  width: 100%;
}
.tt-list ul{
  margin: 0;
  padding: 0;
  width: 100%;
}
.tt-list ul li{
  width: 100%;
  display: flex;
}
.type-item{
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-bottom: 20px;
}
.tt-item{
  width: 240px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  margin-top: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 50px;
  background-color: #ffffff;
  border: 1px solid #BBBBBB;
  border-radius: 8px;
  padding-top: 20px;
  padding-bottom: 5px;
  position: relative;
}
.tt-item .tt-bar1{
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 5px;
  background-color: #3c7af2;
}
.tt-item .tt-bar2{
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 5px;
  background-color: #fe6562;
}
.tt-item .tt-bar3{
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 5px;
  background-color: #f4c43a;
}
.tt-item .tt-bar4{
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 5px;
  background-color: #da5cff;
}
.tt-item .tt-bar5{
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 5px;
  background-color: #3a9df1;
}
.tt-item .tt-bar6{
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 5px;
  background-color: #FE6562;
}
.tt-item .tt-bar7{
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 5px;
  background-color: #F4C43A;
}
.tt-item .tt-btn{
  width: 90%;
  text-align: center;
  font-size: 18px;
  margin-left: 5%;
  color: #333333;
  word-break: break-all;
  white-space: normal;
  word-wrap: break-word;
}
.tt-item .tt-bg1{
  width: 66px;
  height: 76px;
  position: absolute;
  right: 15px;
  top: 60px;
}
.tt-item .tt-bg2{
  width: 88px;
  height: 76px;
  position: absolute;
  right: 15px;
  top: 60px;
}
.tt-item .tt-bg3{
  width: 97px;
  height: 76px;
  position: absolute;
  right: 15px;
  top: 60px;
}
.tt-item .tt-bg4{
  width: 78px;
  height: 76px;
  position: absolute;
  right: 15px;
  top: 60px;
}
.tt-item .tt-bg5{
  width: 78px;
  height: 80px;
  position: absolute;
  right: 15px;
  top: 60px;
}
.tt-item .tt-bg6{
  width: 78px;
  height: 80px;
  position: absolute;
  right: 15px;
  top: 60px;
}
.tt-item .tt-bg7{
  width: 78px;
  height: 80px;
  position: absolute;
  right: 15px;
  top: 60px;
}
.tt-item .tt-bg1 img{
  width: 100%;
  height: 100%;
}
.tt-item .tt-bg2 img{
  width: 100%;
  height: 100%;
}
.tt-item .tt-bg3 img{
  width: 100%;
  height: 100%;
}
.tt-item .tt-bg4 img{
  width: 100%;
  height: 100%;
}
.tt-item .tt-bg5 img{
  width: 100%;
  height: 100%;
}
.classifyDescription{
  margin-top: 10px;
}
.pagination{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
}
.cdd-main{
  width: 100%;
  height: 550px;
}
.demo-form-inline{
  display: flex;
  flex-direction: row;
}
.demo-form-inline .inline-div{
  width: 45%;
  margin-left: 2%;
  margin-top: 20px;
}
.el-select{
  width: 100% !important;
}
.custom-mount{
  width: 100%;
}
.contrast-upload{
  width: 100%;
}
</style>
