// 各页面过滤器
import dict from "@/utils/dict";
let filters = {
  // 流程图页面过滤器find
  processStatusFilter(val) {
    if(val === undefined) return '';
    let text = dict.processStatus.find(item => item.value === val).label || '';
    return text;
  },
  // 供应商类型过滤
  suppliTypeFilter: function (value) {
    if (!value) return ''
    let typeStr = ''
    switch (value) {
      case '10':
        typeStr = '外采软件'
        break
      case '20':
        typeStr = '外采硬件'
        break
      case '30':
        typeStr = '外采服务'
        break
      case '50':
        typeStr = '外采数据'
        break
      default:
        typeStr = '外采人员'
    }
    return typeStr
  },
  // 企业性质
  natureFilter: function (value) {
    if (!value) return ''
    let typeStr = ''
    switch (value) {
      case '0':
        typeStr = '国有企业'
        break
      case '1':
        typeStr = '集体企业'
        break
      case '2':
        typeStr = '联营企业'
        break
      case '3':
        typeStr = '股份合作制企业'
        break
      case '4':
        typeStr = '私营企业'
        break
      case '5':
        typeStr = '外资企业'
        break
      case '6':
        typeStr = '有限责任公司'
        break
      default:
        typeStr = '股份有限公司'
    }
    return typeStr
  },
  // 币种
  currencyFilter: function (value) {
    if (!value) return ''
    let typeStr = ''
    switch (value) {
      case '0':
        typeStr = '人民币'
        break
      case '1':
        typeStr = '欧元'
        break
      case '2':
        typeStr = '美元'
        break
      case '3':
        typeStr = '日元'
        break
      case '4':
        typeStr = '英镑'
        break
      default:
        typeStr = '其他'
    }
    return typeStr
  },
   // 主责部门过滤
   majorDeptFilter: function (value) {
    if (!value) return ''
    let typeStr = ''
    switch (value) {
      case '0':
        typeStr = '产品研发部'
        break
      case '1':
        typeStr = '智能云计算部'
        break
      case '2':
        typeStr = '大数据部'
        break
      case '3':
        typeStr = '银行事业部'
        break
      case '4':
        typeStr = '战略发展部'
        break
      default:
        typeStr = '其他'
    }
    return typeStr
  },
  // 项目类别
  projTypeFilter: function (value, catoryArr) {
    if (value === '') return
    const fileItem = catoryArr.filter(item => value === item.dictValue)
    const typeStr = fileItem.length !==0 ? fileItem[0].dictLabel : ''
    return typeStr
  }
};
export default filters;
