/** 防抖 */
export function _debounce(fn, delay) {
    var delay = delay || 200;
    var timer;
    return function () {
        var th = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = null;
            fn.apply(th, args);
        }, delay);
    };
}

/** 节流 */
export function _throttle(fn, interval) {
    var last;
    var timer;
    var interval = interval || 200;
    return function () {
        var th = this;
        var args = arguments;
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                fn.apply(th, args);
            }, interval);
        } else {
            last = now;
            fn.apply(th, args);
        }
    }
}

/** 格式化文件数据(添加/删除) */
export function formatFiles(oldfiles, newfiles) {
    let addFile = []; // 增加的文件
    let delFile = []; // 删除的文件
    for (let j = 0; j < newfiles.length; j++) {
        let index1 = oldfiles.findIndex(
            (file) => file.piisDocId === newfiles[j].piisDocId
        );
        if (index1 === -1) {
            newfiles[j].operationType = 1; //新增的
            addFile.push(newfiles[j]);
        }
    }
    for (let k = 0; k < oldfiles.length; k++) {
        let index2 = newfiles.findIndex(
            (file) => file.piisDocId === oldfiles[k].piisDocId
        );
        if (index2 === -1) {
            oldfiles[k].operationType = 3; // 删除的
            delFile.push(oldfiles[k]);
        }
    }
    return addFile.concat(delFile);
}

/** 格式化详情列表数据(新增/修改+不变/删除) */ //有问题？？
export function formatInfoList(oldlist, newlist) {
    let addlist = []; // 增加的
    let dellist = []; // 删除的
    let editlist = []; // 编辑的
    for (let j = 0; j < newlist.length; j++) {
        if (!newlist[j].consultInfoDetailId) {
            newlist[j].operationType = 1; //新增的
            addlist.push(newlist[j]);
        } else {
            newlist[j].operationType = 2; //编辑的/不变的
            editlist.push(newlist[j]);
        }
    }
    for (let k = 0; k < oldlist.length; k++) {
        let index2 = newlist.findIndex(
            (file) =>
                file.consultInfoDetailId === oldlist[k].consultInfoDetailId
        );
        if (index2 === -1) {
            oldlist[k].operationType = 3; // 删除的
            dellist.push(oldlist[k]);
        }
    }

    return addlist
    .concat(dellist)
    .concat(editlist)
}
/**
 * 格式化带有时区的日期时间
 */
 export function formateDateTime (dateTime) {
	var json_date = new Date(dateTime).toJSON();
	return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
}