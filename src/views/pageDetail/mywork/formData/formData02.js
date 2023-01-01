export default {
	"config": {
		"labelPosition": "right",
		"labelWidth": 15,
		"autoLabelWidth": true,
		"minWidth": ""
	},
	"list": [
		{
			"type": "radio",
			"label": "审批结果",
			"options": {
				"disabled": false,
				"hidden": false,
				"clearable": false,
				"defaultValue": "1",
				"dynamicKey": "",
				"dynamic": false,
				"options": [
					{
						"value": "1",
						"label": "同意"
					},
					{
						"value": "2",
						"label": "不同意"
					}
				],
				"width": 100,
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
			"model": "agree",
			"key": "radio_1620626905291",
			"rules": [
				{
					"required": true,
					"message": "必填项",
					"trigger": "blur"
				}
			]
		},
		{
			"type": "text",
			"label": "审批意见",
			"options": {
				"minWidth": 10,
				"width": 100,
				"height": 3,
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
			"model": "text_1620626939608",
			"key": "text_1620626939608",
			"rules": [
				{
					"required": false,
					"message": "必填项",
					"trigger": "blur"
				}
			]
		},
		{
			"type": "select",
			"label": "审批人员",
			"options": {
				"width": 60,
				"minWidth": 20,
				"multiple": false,
				"defaultValue": "1",
				"multipleDefaultValue": [],
				"disabled": true,
				"clearable": false,
				"hidden": false,
				"placeholder": "请选择",
				"dynamicKey": "",
				"dynamic": false,
				"options": [
					{
						"value": "1",
						"label": "管理员"
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
			"model": "select_1620627106212",
			"key": "select_1620627106212",
			"rules": [
				{
					"required": false,
					"message": "必填项",
					"trigger": "blur"
				}
			]
		},
		{
			"type": "select",
			"label": "所属部门",
			"options": {
				"width": 60,
				"minWidth": 20,
				"multiple": false,
				"defaultValue": "1",
				"multipleDefaultValue": [],
				"disabled": true,
				"clearable": false,
				"hidden": false,
				"placeholder": "请选择",
				"dynamicKey": "",
				"dynamic": false,
				"options": [
					{
						"value": "1",
						"label": "产品研发部"
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
			"model": "select_1620627133311",
			"key": "select_1620627133311",
			"rules": [
				{
					"required": false,
					"message": "必填项",
					"trigger": "blur"
				}
			]
		},
		{
			"type": "date",
			"label": "审批时间",
			"options": {
				"width": 60,
				"defaultValue": 1620576000000,
				"rangeDefaultValue": [
					"",
					""
				],
				"disabled": true,
				"hidden": false,
				"clearable": false,
				"placeholder": "请选择日期点",
				"format": "yyyy 年 MM 月 dd 日",
				"isChooseTimes": "1",
				"valueFormat": "timestamp",
				"rangeSeparator": "至",
				"startPlaceholder": "开始日期",
				"endPlaceholder": "结束日期",
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
			"model": "date_1620627241125",
			"key": "date_1620627241125",
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
