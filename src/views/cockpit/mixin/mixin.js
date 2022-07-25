import api from '@/api/work/cockpit'

let mixin = {
  data() {
    return {
      showLoading: false,
      // 驾驶舱项目 下拉
      requestProjectOptions: [],
      requestProjectValue: null,
      // 项目形象进度 列表
      projectProgressTableData: [],
      projectCodeParams: {
        projectCode: ''
      },
      tabPrice: {
        generalContractMoney: null,
        partyActualOutputValueA: null,
        generalContractReturn: null,
        auditOutputValueA: null,
        totalLiabilityCost: null,
        targetProfit: null,
        outputCompletion: null,
        paymentCollection: null,
        targetProfitMargin: null
      },
      defaultProps: {
        label: 'deptName',
        children: 'children',
        value: 'projectCode'
      }
    }
  },
  methods: {
    // 支出合同类型
    getContractTotalAndClassifyName() {
      api.getContractTotalAndClassifyName(this.projectCodeParams).then(res => {
        if (res.code === 0) {

        }
      }).catch(err => {
        console.log(err)
      })
    },

  }
}

export default mixin
