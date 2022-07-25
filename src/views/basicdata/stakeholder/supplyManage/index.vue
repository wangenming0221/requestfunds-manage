<template>
  <div class="supplier-container">
    <div class="sc-top">
      <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="供方名称" prop="pName">
          <el-input v-model="queryForm.pName" placeholder="请输入供方名称" />
        </el-form-item>
        <el-form-item label="企业类型" prop="pType">
          <el-select v-model="queryForm.pType" placeholder="全部">
            <el-option label="总公司" value="0" />
            <el-option label="外部企业" value="1" />
            <el-option label="分/子公司" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="法定代表人/负责人" prop="pPeople">
          <el-input v-model="queryForm.pPeople" placeholder="请输入法定代表人/负责人" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
          <el-button icon="el-icon-plus" @click="onNewAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="sc-table">
      <el-table
        :height="700"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed="left"
          prop="pName"
          align="center"
          label="企业名称"
          width="300"
        />
        <el-table-column
          prop="pCode"
          align="center"
          label="企业代码"
          width="300"
        />
        <el-table-column
          prop="pPeople"
          align="center"
          label="法定代表人/负责人"
          width="300"
        />
        <el-table-column
          prop="business"
          align="center"
          label="业务范围"
          width="200"
        />
        <el-table-column
          prop="address"
          align="center"
          label="地址"
          width="500"
        />
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
          width="200"
        />
        <el-table-column
          prop="createPeople"
          align="center"
          label="创建人"
          width="150"
        />
        <el-table-column
          prop="modifyTime"
          align="center"
          label="修改时间"
          width="200"
        />
        <el-table-column
          prop="modifyPeople"
          align="center"
          label="修改人"
          width="200"
        />
        <el-table-column
          width="200"
          fixed="right"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="editSupplierInfo(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteSupplierInfo(scope.row.id)"
            >
              删除
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
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="newAddShow"
      width="60%"
      :before-close="handleClose"
    >
      <div class="new-add-contain">
        <div class="nac-left">
          <el-divider><div class="supply-info">供方基本信息</div></el-divider>
          <el-form ref="newForm" :rules="newFormRules" label-position="top" :model="newForm" label-width="200px">
            <el-form-item label="企业名称" prop="pName">
              <el-input v-model="newForm.pName" placeholder="请输入企业名称" maxlength="50" />
            </el-form-item>
            <el-form-item label="法定代表人/负责人" prop="pPeople">
              <el-input v-model="newForm.pPeople" placeholder="请输入法定代表人/负责人" maxlength="50" />
            </el-form-item>
            <el-form-item
              prop="pCode"
              label="企业代码"
            >
              <el-input v-model="newForm.pCode" placeholder="请输入企业代码" maxlength="50" @input="inputPrefix" />
            </el-form-item>
            <el-form-item
              label="法人/负责人手机号"
              prop="legalTelephone"
            >
              <el-input v-model="newForm.legalTelephone" placeholder="请输入法人/负责人手机号" maxlength="50" />
            </el-form-item>
            <el-form-item
              label="身份证号/负责人身份证号"
              prop="personCard"
            >
              <el-input v-model="newForm.personCard" placeholder="请输入身份证号/负责人身份证号" maxlength="50" />
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="newForm.address" placeholder="请输入地址" maxlength="50" />
            </el-form-item>
            <el-form-item label="经营范围">
              <el-input v-model="newForm.business" placeholder="请输入经营范围" type="textarea" maxlength="500" />
            </el-form-item>
            <el-form-item label="企业类型" prop="pType">
              <el-select v-model="newForm.pType" style="width: 100%" placeholder="请选择企业类型">
                <el-option label="企业" :value="1" />
                <el-option label="个体" :value="2" />
<!--                <el-option label="全部" :value="10" />-->
<!--                <el-option label="总公司" :value="0" />-->
<!--                <el-option label="外部企业" :value="1" />-->
<!--                <el-option label="分/子公司" :value="2" />-->
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="nac-right">
          <ul class="payee">
            <li v-for="(item, index) in newFormPayee" :key="index">
              <el-card shadow="hover">
                <el-divider>
                  <div class="supply-info">
                    <div class="supply-info-title">收款人信息<span v-if="index !== 0">{{ index }}</span></div>
                    <div>
                      <i v-show="index === 0" class="el-icon-circle-plus-outline" @click="newAddPayee" />
                      <i v-show="index !== 0" class="el-icon-remove-outline" @click="deletePayee" />
                    </div>
                  </div>
                </el-divider>
                <el-form ref="newFormPayee" :rules="newFormPayeeRules" label-position="top" :model="item" label-width="200px">
                  <el-form-item label="收款人姓名/收款单位名称" prop="collectionName">
                    <el-input v-model="item.collectionName" placeholder="收款人姓名/收款单位名称" maxlength="50" />
                  </el-form-item>
                  <el-form-item label="银行卡号" prop="cardNumber">
                    <el-input v-model="item.cardNumber" placeholder="银行卡号" maxlength="50" />
                  </el-form-item>
                  <el-form-item label="开户行" prop="bankName">
                    <el-input v-model="item.bankName" placeholder="开户行" maxlength="50" />
                  </el-form-item>
                </el-form>
              </el-card>
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSupplierInformation('newForm')">保 存</el-button>
        <el-button @click="reset('newForm')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'SupplierManagement',
  data() {
    let checkPersonCard = (rule, code, callback) => {
      let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
      let tip = ""
      let pass = true

      if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误"
        pass = false;
      } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误"
        pass = false
      } else {
        // 18位身份证需要验证最后一位校验位
        if (code.length === 18) {
          code = code.split('')
          // ∑(ai×Wi)(mod 11)
          // 加权因子
          let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
          // 校验位
          let parity = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]
          let sum = 0
          let ai = 0
          let wi = 0
          for (let i = 0; i < 17; i++) {
            ai = code[i]
            wi = factor[i]
            sum += ai * wi
          }
          let last = parity[sum % 11]
          if (last !== Number(code[17]) && code[17] !== 'X') {
            console.log(last)
            console.log(Number(code[17]))
            console.log(code[17])
            tip = "校验位错误"
            pass = false
          }
        }
      }
      if (!pass) {
        callback(new Error(tip))
      } else {
        callback()
      }
      // if (!pass) alert(tip)
      // return pass
    }
    let validateBankCardPass = (rule, code, callback) => {

    }
    return {
      dialogTitle: '',
      newAddShow: false,
      // 供方信息
      newForm: {
        pName: '',
        pPeople: '',
        pCode: '',
        address: '',
        business: '',
        pType: null,
        payeeInformationList: [],
        legalTelephone: '',
        personCard: null
      },
      // 收款人信息
      newFormPayee: [
        {
          collectionName: '',
          cardNumber: '',
          bankName: '',
          id: null,
          provideCompanyId: null
        }
      ],
      newFormPayeeRules: {
        cardNumber: [
          // { pattern: /^\d{16}|\d{19}$/, message: '请输入正确的银行卡号' },
          // { validator: validateBankCardPass, trigger: 'blur' }
          { required: true, message: '请输入正确的银行卡号', trigger: 'blur' }
        ]
      },
      recordId: {
        id: ''
      },
      queryForm: {
        pName: '',
        pType: '',
        pPeople: '',
        pageSize: 10,
        pageNum: 1
      },
      newFormRules: {
        pName: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        pPeople: [
          { required: true, message: '请输入法定代表人/负责人', trigger: 'blur' }
        ],
        personCard: [
          {
            required: true,
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号/负责人身份证号'
          },
          { validator: checkPersonCard, trigger: 'blur' }
        ],
        pCode: [
          { required: true, message: '请输入企业代码', trigger: 'blur' }
        ],
        legalTelephone: [
          { required: true, message: '请输入法人手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        // business: [
        //   { required: true, message: '请输入经营范围', trigger: 'blur' }
        // ],
        pType: [
          { required: true, message: '请选择企业类型', trigger: 'change' }
        ]
      },
      total: null,
      tableData: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    inputPrefix(val) {
      console.log(val)
      const codeReg = new RegExp('[A-Za-z0-9]+')
      for (let i = 0; i < val.length; i++) {
        if (!codeReg.test(val[i])) {
          this.newForm.pCode = ''
          return this.$message({
            type: 'warning',
            message: '企业代码只能为字母或数字及组合'
          })
        }
      }
    },
    // 新增收款人
    newAddPayee() {
      this.newFormPayee.push({
        collectionName: '',
        cardNumber: '',
        bankName: ''
      })
      setTimeout(() => {
        const dom = document.getElementsByClassName('payee')[0]
        dom.scrollTop = dom.scrollHeight
      }, 500)
    },
    // 删除收款人
    deletePayee() {
      this.newFormPayee.pop()
    },
    init() {
      api.getSupplierManagementList(this.queryForm).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.tableData = res.data.records
          // 总页数
          this.total = res.data.total
          this.queryForm.pageNum = res.data.current
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 换页
    currentPageChange(page) {
      console.log(page)
      this.queryForm.pageNum = page
      this.init()
    },
    // 条件查询
    onQuery() {
      this.queryForm.pageNum = 1
      this.init()
    },
    // 重置
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.init()
    },
    // 重置表单
    resetForm(formObject) {
      for (const formObjectKey in formObject) {
        formObject[formObjectKey] = ''
      }
    },
    // 重置 取消
    reset() {
      this.newForm.pName = ''
      this.newForm.pPeople = ''
      this.newForm.pCode = ''
      this.newForm.address = ''
      this.newForm.business = ''
      this.newForm.pType = 10
      this.newForm.legalTelephone = ''
      this.newForm.personCard = null
      this.newFormPayee = [
        {
          collectionName: '',
          cardNumber: '',
          bankName: '',
          id: null,
          provideCompanyId: null
        }
      ]
      this.newAddShow = false
      this.$refs.newForm.resetFields()
    },
    // 显示新增弹窗
    onNewAdd() {
      console.log(this.newForm)
      this.newAddShow = true
      this.dialogTitle = '新增'
    },
    handleClose() {
      this.newForm.pName = ''
      this.newForm.pPeople = ''
      this.newForm.pCode = ''
      this.newForm.address = ''
      this.newForm.business = ''
      this.newForm.pType = 10
      this.newForm.personCard = null
      this.newFormPayee = [
        {
          collectionName: '',
          cardNumber: '',
          bankName: '',
          id: null,
          provideCompanyId: null
        }
      ]
      this.newAddShow = false
    },
    saveSupplierInformation(formName) {
      if (this.dialogTitle === '新增') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newForm.payeeInformationList = this.newFormPayee
            api.supplierManagementNewAdd(this.newForm).then(res => {
              console.log(res)
              if (res.code === 0) {
                this.init()
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg
                })
              }
            }).catch(err => {
              console.log(err)
            })
            this.newAddShow = false
            this.resetForm(this.newForm)
            this.newFormPayee = [
              {
                collectionName: '',
                cardNumber: '',
                bankName: '',
                id: null,
                provideCompanyId: null
              }
            ]
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {
            this.newForm.payeeInformationList = this.newFormPayee
            const target = Object.assign(this.newForm, this.recordId)
            if (target.payeeInformationList.length === 0) {
              target.payeeInformationList = []
            }
            api.updateSupplierManagementInfo(target).then(res => {
              console.log(res)
              if (res.code === 0) {
                this.init()
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg
                })
              }
            }).catch(err => {
              console.log(err)
            })
            this.newAddShow = false
            this.reset()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    // 修改供方信息 dialog
    editSupplierInfo(id) {
      this.dialogTitle = '修改'
      this.recordId.id = id

      api.getSupplierManagementDetailInfo(this.recordId).then(res => {
        if (res.code === 0) {
          console.log(res.data, 11111)
          this.newForm.pName = res.data.pName
          this.newForm.pPeople = res.data.pPeople
          this.newForm.pCode = res.data.pCode
          this.newForm.address = res.data.address
          this.newForm.business = res.data.business
          this.newForm.pType = res.data.pType === null ? 10 : res.data.pType
          this.newForm.representative = res.data.representative
          this.newForm.repPhone = res.data.repPhone
          this.newForm.repIdcard = res.data.repIdcard
          this.newForm.legalTelephone = res.data.legalTelephone
          this.newForm.personCard = res.data.personCard
          if (res.data.payeeInformationList.length !== 0) {
            this.newFormPayee = res.data.payeeInformationList.map(item => {
              return {
                collectionName: item.collectionName,
                cardNumber: item.cardNumber,
                bankName: item.bankName,
                id: item.id,
                provideCompanyId: item.provideCompanyId
              }
            })
          } else {
            this.newFormPayee = [
              {
                collectionName: '',
                cardNumber: '',
                bankName: '',
                id: null,
                provideCompanyId: null
              }
            ]
          }
        }
      }).catch(err => {
        console.log(err)
      })

      this.newAddShow = true
    },
    // 删除供方信息
    deleteSupplierInfo(id) {
      this.recordId.id = id
      this.$confirm('确定删除本条数据吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteSupplierManagementInfo(this.recordId).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.init()
          }
        }).catch(err => {
          console.log(err)
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-container{
  width: 100%;
  height: 100%;
  padding: 20px;
  .sc-top{
    width: 100%;
    height: 65px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px -5px #eeeeee;
    border: 1px solid #eeeeee;
    padding-top: 15px;
    padding-left: 20px;
  }
  .sc-table{
    width: 100%;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px -5px #eeeeee;
    border: 1px solid #eeeeee;
    padding: 20px 20px;
  }
}
.new-add-contain{
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: row;
  .nac-left{
    width: 50%;
    height: 500px;
    display: flex;
    flex-direction: column;
    padding: 0 50px;
    overflow-y: scroll;
    .supply-info{
      width: 100%;
      font-size: 20px;
      font-weight: bolder;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
    }
  }
  .nac-left::-webkit-scrollbar{
    display: none;
  }
  .nac-right{
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 0 50px;
    .payee{
      height: 500px;
      margin: 0;
      padding: 0;
      list-style-type: none;
      overflow-y: scroll;
      .supply-info{
        width: 100%;
        font-size: 20px;
        font-weight: bolder;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        .supply-info-title{

        }
        .el-icon-circle-plus-outline, .el-icon-remove-outline{
          cursor: pointer;
        }
      }
      li{
        margin-bottom: 15px;
      }
    }
    .payee::-webkit-scrollbar{
      display: none;
    }
  }
}
.new-add-contain::-webkit-scrollbar{
  display: none;
}
.pagination{
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 20px;
}
</style>
