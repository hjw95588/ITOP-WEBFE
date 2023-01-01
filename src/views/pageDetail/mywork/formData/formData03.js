export default {
  config: {
    labelPosition: "left",
    labelWidth: 15,
    autoLabelWidth: false
  },
  list: [
    {
      type: "customize",
      options:{
        customizeName:'customizeTable1',
      }
    },
    {
      type: "inputSearch",
      label: "输入框",
      options: {
        label: "输入框",
        minWidth: 10,
        width: 100,
        defaultValue: "",
        placeholder: "请输入",
        clearable: false,
        hidden: false,
        disabled: false,
        customStyle: "",
        dynamicFun: "",
        eventName: "change",
        eventNameOptions: [
          {
            label: "change",
            value: "change"
          },
          {
            label: "click",
            value: "click"
          },
          {
            label: "blur",
            value: "blur"
          },
          {
            label: "dblclick",
            value: "dblclick"
          },
          {
            label: "focus",
            value: "focus"
          },
          {
            label: "mouseout",
            value: "mouseout"
          },
          {
            label: "mouseover",
            value: "mouseover"
          },
          {
            label: "submit",
            value: "submit"
          },
          {
            label: "reset",
            value: "reset"
          }
        ],
        dTableDialog: {
          // 搜索表格弹窗
          request: {
            url: "/kylin/formData/list",
            method: "get"
          },
          title: "表格弹窗",
          visible: false,
          width: "",
          propName: "controlName",
          tableHeaders: [
            {
              prop: "createTime",
              label: "日期",
              width: ""
            },
            {
              prop: "controlName",
              label: "表单名称",
              width: ""
            },
            {
              prop: "businessKey",
              label: "表单key",
              width: ""
            }
          ]
        }
      },
      model: "dname",
      key: "input_1621477618133",
      rules: [
        {
          required: false,
          message: "必填项",
          trigger: "blur"
        }
      ]
    },
    {
      type: "customize",
      options:{
        customizeName:'customizeTable2',
      }
    },
    {
      type: "input",
      label: "输入框",
      options: {
        label: "输入框",
        minWidth: 10,
        width: 100,
        defaultValue: "",
        placeholder: "请输入",
        clearable: false,
        hidden: false,
        disabled: false,
        customStyle: "",
        dynamicFun: "",
        eventName: "change",
        eventNameOptions: [
          {
            label: "change",
            value: "change"
          },
          {
            label: "click",
            value: "click"
          },
          {
            label: "blur",
            value: "blur"
          },
          {
            label: "dblclick",
            value: "dblclick"
          },
          {
            label: "focus",
            value: "focus"
          },
          {
            label: "mouseout",
            value: "mouseout"
          },
          {
            label: "mouseover",
            value: "mouseover"
          },
          {
            label: "submit",
            value: "submit"
          },
          {
            label: "reset",
            value: "reset"
          }
        ]
      },
      model: "name",
      key: "input_1621477618134",
      rules: [
        {
          required: false,
          message: "必填项",
          trigger: "blur"
        }
      ]
    },
    {
      type: "uploadFile",
      label: "上传文件",
      options: {
        fileList: [],
        multiple: true,
        disabled: false,
        hidden: false,
        clearable: false,
        width: 100,
        limit: 10,
        buttonText: "上传",
        warnText:
          "只能上传doc、docx、xls、xlsx、ppt、pptx、pdf文件，且不超过50MB",
        action: "/common/uploads",
        customStyle: "",
        dynamicFun: "",
        eventName: "change",
        eventNameOptions: [
          {
            label: "change",
            value: "change"
          },
          {
            label: "click",
            value: "click"
          },
          {
            label: "blur",
            value: "blur"
          },
          {
            label: "dblclick",
            value: "dblclick"
          },
          {
            label: "focus",
            value: "focus"
          },
          {
            label: "mouseout",
            value: "mouseout"
          },
          {
            label: "mouseover",
            value: "mouseover"
          },
          {
            label: "submit",
            value: "submit"
          },
          {
            label: "reset",
            value: "reset"
          }
        ]
      },
      model: "uploadFile_1621474376686",
      key: "uploadFile_1621474376686",
      rules: [
        {
          required: false,
          message: "必填项",
          trigger: "blur"
        }
      ]
    },
    {
      type: "childTable",
      label: "子表",
      list: [
        {
          type: "select",
          label: "下拉选择框",
          options: {
            width: 100,
            minWidth: 20,
            multiple: false,
            defaultValue: "",
            multipleDefaultValue: [],
            disabled: false,
            clearable: false,
            hidden: false,
            placeholder: "请选择",
            dynamicKey: "sys_user_sex",
            dynamic: true,
            options: [
              {
                value: "1",
                label: "选项1"
              },
              {
                value: "2",
                label: "选项2"
              }
            ],
            showSearch: false,
            customStyle: "",
            dynamicFun: "",
            eventName: "change",
            eventNameOptions: [
              {
                label: "change",
                value: "change"
              },
              {
                label: "click",
                value: "click"
              },
              {
                label: "blur",
                value: "blur"
              },
              {
                label: "dblclick",
                value: "dblclick"
              },
              {
                label: "focus",
                value: "focus"
              },
              {
                label: "mouseout",
                value: "mouseout"
              },
              {
                label: "mouseover",
                value: "mouseover"
              },
              {
                label: "submit",
                value: "submit"
              },
              {
                label: "reset",
                value: "reset"
              }
            ]
          },
          model: "select_1620973900120",
          key: "select_1620973900120",
          rules: [
            {
              required: false,
              message: "必填项",
              trigger: "blur"
            }
          ]
        },
        {
          type: "inputSearch",
          label: "输入框",
          options: {
            label: "输入框",
            minWidth: 10,
            width: 100,
            defaultValue: "",
            placeholder: "请输入",
            clearable: false,
            hidden: false,
            disabled: false,
            customStyle: "",
            dynamicFun: "",
            eventName: "change",
            eventNameOptions: [
              {
                label: "change",
                value: "change"
              },
              {
                label: "click",
                value: "click"
              },
              {
                label: "blur",
                value: "blur"
              },
              {
                label: "dblclick",
                value: "dblclick"
              },
              {
                label: "focus",
                value: "focus"
              },
              {
                label: "mouseout",
                value: "mouseout"
              },
              {
                label: "mouseover",
                value: "mouseover"
              },
              {
                label: "submit",
                value: "submit"
              },
              {
                label: "reset",
                value: "reset"
              }
            ],
            dTableDialog: {
              // 搜索表格弹窗
              request: {
                url: "/kylin/formData/list",
                method: "get"
              },
              title: "表格弹窗",
              visible: false,
              width: "",
              propName: "controlName",
              tableHeaders: [
                {
                  prop: "createTime",
                  label: "日期",
                  width: ""
                },
                {
                  prop: "controlName",
                  label: "表单名称",
                  width: ""
                },
                {
                  prop: "businessKey",
                  label: "表单key",
                  width: ""
                }
              ]
            }
          },
          model: "input_0521",
          key: "input_0521",
          rules: [
            {
              required: false,
              message: "必填项",
              trigger: "blur"
            }
          ]
        },
      ],
      options: {
        pageIndex: 1,
        pageSize: 1000000,
        pageTotal: 0,
        pageSizes: [5, 10, 20, 50, 100],
        width: 100,
        hidden: false,
        disabled: false,
        customStyle: "",
        dynamicFun: "",
        eventName: "change",
        eventNameOptions: [
          {
            label: "change",
            value: "change"
          },
          {
            label: "click",
            value: "click"
          },
          {
            label: "blur",
            value: "blur"
          },
          {
            label: "dblclick",
            value: "dblclick"
          },
          {
            label: "focus",
            value: "focus"
          },
          {
            label: "mouseout",
            value: "mouseout"
          },
          {
            label: "mouseover",
            value: "mouseover"
          },
          {
            label: "submit",
            value: "submit"
          },
          {
            label: "reset",
            value: "reset"
          }
        ]
      },
      model: "childTable_1620973896872",
      key: "childTable_1620973896872"
    }
  ]
};
