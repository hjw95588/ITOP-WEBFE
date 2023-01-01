export default{
	"config": {
		"labelPosition": "right",
		"labelWidth": 15,
		"autoLabelWidth": false
	},
	"list": [
    {
      type: "customize",
      options:{
        customizeName:'customizeTable1',
      }
    },
		{
			"type": "input",
			"label": "姓名",
			"options": {
				"label": "输入框",
				"minWidth": 10,
        "labelWidth": '',
				"width": 100,
				"defaultValue": "",
				"placeholder": "请输入",
				"clearable": false,
				"hidden": false,
				"disabled": false,
				"customStyle": "",
        // "customStyle": "background:red;\nheight:100px;\nwidth:200px;",
				"dynamicFun": "",
				"eventName": "change",
				"eventNameOptions": [
					{
						"label": "change",
						"value": "change"
					},
					{
						"label": "click",
						"value": "click"
					},
					{
						"label": "blur",
						"value": "blur"
					},
					{
						"label": "dblclick",
						"value": "dblclick"
					},
					{
						"label": "focus",
						"value": "focus"
					},
					{
						"label": "mouseout",
						"value": "mouseout"
					},
					{
						"label": "mouseover",
						"value": "mouseover"
					},
					{
						"label": "submit",
						"value": "submit"
					},
					{
						"label": "reset",
						"value": "reset"
					}
				]
			},
			"model": "name",
			"key": "input_1620812596816",
			"rules": [
				{
					"required": true,
					"message": "必填项",
					"trigger": "blur"
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
			"type": "input",
			"label": "年龄",
			"options": {
				"label": "输入框",
				"minWidth": 10,
				"width": 100,
				"defaultValue": "",
				"placeholder": "请输入",
				"clearable": false,
				"hidden": false,
				"disabled": false,
				"customStyle": "",
				"dynamicFun": "",
				"eventName": "change",
				"eventNameOptions": [
					{
						"label": "change",
						"value": "change"
					},
					{
						"label": "click",
						"value": "click"
					},
					{
						"label": "blur",
						"value": "blur"
					},
					{
						"label": "dblclick",
						"value": "dblclick"
					},
					{
						"label": "focus",
						"value": "focus"
					},
					{
						"label": "mouseout",
						"value": "mouseout"
					},
					{
						"label": "mouseover",
						"value": "mouseover"
					},
					{
						"label": "submit",
						"value": "submit"
					},
					{
						"label": "reset",
						"value": "reset"
					}
				]
			},
			"model": "age",
			"key": "input_1620812608840",
			"rules": [
				{
					"required": true,
					"message": "必填项",
					"trigger": "blur"
				}
			]
		},
    {
			"type": "select",
			"label": "下拉选择框",
			"options": {
				"width": 100,
				"minWidth": 20,
				"multiple": false,
				"defaultValue": "1",
				"multipleDefaultValue": [],
				"disabled": false,
				"clearable": false,
				"hidden": false,
				"placeholder": "请选择",
				"dynamicKey": "sys_normal_disable",
				"dynamic": true,
				"options": [
					{
						"value": "1",
						"label": "选项1"
					},
					{
						"value": "2",
						"label": "选项2"
					}
				],
				"showSearch": false,
				"customStyle": "",
				"dynamicFun": "",
				"eventName": "change",
				"eventNameOptions": [
					{
						"label": "change",
						"value": "change"
					},
					{
						"label": "click",
						"value": "click"
					},
					{
						"label": "blur",
						"value": "blur"
					},
					{
						"label": "dblclick",
						"value": "dblclick"
					},
					{
						"label": "focus",
						"value": "focus"
					},
					{
						"label": "mouseout",
						"value": "mouseout"
					},
					{
						"label": "mouseover",
						"value": "mouseover"
					},
					{
						"label": "submit",
						"value": "submit"
					},
					{
						"label": "reset",
						"value": "reset"
					}
				]
			},
			"model": "select_1620893375686",
			"key": "select_1620893375686",
			"rules": [
				{
					"required": false,
					"message": "必填项",
					"trigger": "blur"
				}
			]
		}
	]
}
