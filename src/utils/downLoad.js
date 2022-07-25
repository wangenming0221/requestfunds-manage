/**
 * 下载方法
 */
import request from '@/utils/request'
import alioss from '@/utils/alioss'
/**
 * 弃用！！！！！！！！！！,改用downLoadBlobByParam 日期2021-04-17
 * 下载blob
 * @param {*} url 地址
 * @param {*} fileName  下载文件名
 * @param {*} type  它代表了将会被放入到blob中的数组内容的MIME类型
 *
 */
export async function downLoadBlob(url, fileName, type = 'application/vnd.ms-excel') {
  console.log("1212")
    if(url.indexOf("jiuzhangdigit.com") != -1 || url.indexOf("zhangjiakou.aliyuncs.com") != -1){
        if(url!==null || url !==''){//使用split 进行分割，一定要进行字符串判空
            const str = url.split("http://");
            const index = str[1].indexOf("/")+1;
            // let oss = new alioss();
            // let downUrl = await oss.getSignatureUrl('/' + str[1].substring(index),fileName)
            let eLink = document.createElement('a');
            eLink.download = fileName;
            eLink.style.display = 'none';
            eLink.target = '_blank';
            // eLink.href = downUrl;
            eLink.href = url;
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href); // 释放URL 对象
            document.body.removeChild(eLink);
            return
        }

    }
    let response = await request.get(url, {
        responseType: 'blob'
    })
    console.log(response);
    if (response.data) {
        /*
        //后端需要设置才能取到Content-Disposition response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        const disposition = response.headers['content-disposition'];*/

        let blob = new Blob([response.data], { type, });

        callDownLoadByBlob(blob, fileName)

    } else {
        this.$notify.error({ title: '错误', message: response.data.msg })
    }

    return response

}


/**
 * 下载blob
 * @param {*} url 地址
 * @param {*} fileName  下载文件名
 * @param {*} type  它代表了将会被放入到blob中的数组内容的MIME类型
 *
 */
export async function downLoadBlobByParam(url, param, fileName, type = 'application/vnd.ms-excel') {
    if(url.indexOf("aliyuncs.com") != -1){
        if(url!==null || url !==''){//使用split 进行分割，一定要进行字符串判空
            const str = url.split("http://");
            const index = str[1].indexOf("/")+1;
            let oss = new alioss();
            let downUrl = await oss.getSignatureUrl('/' + str[1].substring(index),fileName)
            let eLink = document.createElement('a');
            // eLink.download = fileName;
            eLink.style.display = 'none';
            eLink.target = '_blank';
            eLink.href = downUrl;
            document.body.appendChild(eLink);
            eLink.click();
            URL.revokeObjectURL(eLink.href); // 释放URL 对象
            document.body.removeChild(eLink);
            return
        }
    }
    let requestParam = { params: param, 'responseType': 'blob' }
    let response = await request.get(url, requestParam)
    console.log(response);
    if (response.data) {
        /*
        //后端需要设置才能取到Content-Disposition response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        const disposition = response.headers['content-disposition'];*/

        let blob = new Blob([response.data], { type, });

        callDownLoadByBlob(blob, fileName)

    } else {
        this.$notify.error({ title: '错误', message: response.data.msg })
    }

    return response

}

/**
 * 下载blob对象
 * @param {*} blob blob对象
 * @param {*} fileName 文件名称
 */
export function callDownLoadByBlob(blob, fileName) {
    let eLink = document.createElement('a');

    eLink.download = fileName;
    eLink.style.display = 'none';
    eLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eLink);
    eLink.click();
    URL.revokeObjectURL(eLink.href); // 释放URL 对象
    document.body.removeChild(eLink);
}
