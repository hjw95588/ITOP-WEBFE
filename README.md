# ITOP-WEBFE

科技运营管理平台Web端


## 安装步骤

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm build:prod

# build for production and view the bundle analyzer report
npm run build --report

# run e2e tests
npm run e2e

# run all tests
npm test

```

## 部分业务组件说明

> 业务组件仅限于业务系统应用，不适用于系统管理类。组件存储路径'src/components'文件夹中

#### 列表组件-TableList

说明：该组件统一了列表数据类页面样式的统一展示，表头以及表格数据均为数据渲染，可根据需要配置表头数据添加列头筛选功能、列表数据对齐方式、列表列宽。筛选功能包括：输入框筛选、下拉框筛选、日期筛选(日期范围不适用)。

##### 配置选项

| 选项       | 属性值类型    | 说明                           |
| ---------- | ------------- | ------------------------------ |
| headerData | Array[Object] | 表头数据(数组每一项为一个对象) |
| tableData  | Array         | 表格数据(即后端返回数据)       |
| pageNum    | Number        | 翻页页码                       |
| pageSize   | Number        | 每页条数                       |
| ClickRow   | Function      | 点击表格行处理函数             |

##### 表头数据headerData

| 选项        | 属性值类型 | 说明                                                         |
| ----------- | ---------- | ------------------------------------------------------------ |
| prop        | String     | 绑定表头prop(必传)                                           |
| label       | String     | 绑定表头label(必传)                                          |
| align       | String     | 表格数据对齐方式                                             |
| width       | String     | 设置列宽                                                     |
| attrs       | Object     | 设置列的格式化formatter                                      |
| filltype    | String     | 设置当前列的筛选类别(input、select、date)                    |
| tableType   | String     | 筛选条件键名对应当前页面中筛选条件对象对应的键名(filltype有值时，必传) |
| listeners   | Object     | 监听筛选框的搜索(onSearchFun: Function)与重置(onResetFun: Function)(filltype有值时，必传) |
| optionsname | String     | filltype值为select时必传。此属性值为下拉筛选选项数据的数组名，必须与当前页面请求对应字典数据数组的名称 |

##### 代码示例

```javascript
// 组件引用
<table-list
    :tableData="projListData"
    :headerData="ProjTableHeaderData"
    :pageNum="queryProjListData.pageNum"
    :pageSize="queryProjListData.pageSize"
    @ClickRow="currentProjRow"
/>
      
// 在data中相关数据
  data() {
        return {
            ProjTableHeaderData: [ // 左侧项目列表头部数据
                {
                    prop: 'projCode',
                    label: '项目编码',
                    align: 'center',
                    filltype: 'input',
                    tableType: 'projectId',
                    listeners: {
                        onSearchFun: this.queryData,
                        onResetFun: this.resetFields
                    }
                },
                {
                    prop: 'projName',
                    label: '项目名称',
                    align: 'center',
                    filltype: 'input',
                    tableType: 'projectName',
                    listeners: {
                        onSearchFun: this.queryData,
                        onResetFun: this.resetFields
                    }
                },
                {
                    prop: 'initType',
                    label: '立项类型',
                    align: 'center',
                    filltype: 'select',
                    tableType: 'initType',
                    optionsname: 'initTypeOptions', // 此处属性值与getPrjTypeDicts方法中的第二个参数一致
                    listeners: {
                        onSearchFun: this.queryData,
                        onResetFun: this.resetFields
                    },
                    attrs: {
                        formatter: this.initTypeFormat
                    }
                }
            ],
            projListData: [], // 项目数据
            initTypeOptions:[] //立项类型词典
        }
    }
// 下拉框选项数据字典请求
methods: {
    this.getPrjTypeDicts('PRJ_INIT_TYPE','initTypeOptions')
    getPrjTypeDicts (type, attrs) {
      return this.getDicts(type).then(res => {
        if (res.code === 200) {
          this[attrs] = res.data.map(item => ({
            dictLabel: item.dictLabel,
            dictValue: item.dictValue
          }))
          this.$store.dispatch('dict/changeDictData', {
            dictname: attrs,
            options: res.data
          })
        }
      })
    },
}
```

[^下拉框数据说明]: 列头下拉筛选数据来自vuex中，所以在足见当前引用页面中请求相关字典数据时，需调用vuex中的'dict/changeDictData'方法，将对应的字典数据存入vuex中。

