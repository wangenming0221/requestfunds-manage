import axios from 'axios'
import { baseURL } from '@/config'
import { oXHRHeadrs } from './headers'

axios.defaults.headers['Content-Type'] = oXHRHeadrs.headers["Content-Type"]
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: baseURL + process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 40000
})

export function download(url, filename) {
  console.log("url",url)
  return service.get(url,
    {
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob'
  }).then((data) => {
    const content = data;
    const blob = new Blob([content.data], {     // 创建一个新的Blob对象来接收后端的文件,这里第一个参数必须是数组类型，否则下载必出错。
      type: 'application/vnd.ms-excel'    // type，表明该 Blob 对象所包含数据的 MIME 类型,这需要前后端统一规划
    })
    let link = document.createElement('a')
    let body = document.querySelector('body')
    link.href = window.URL.createObjectURL(blob) //
    link.style.display = 'none' // 让这个a标签不可见
    link.download = filename  //文件名称
    body.appendChild(link)
    link.click()        // 创建了新的a标签之后模拟点击事件，开始传输文件
    body.removeChild(link)  // 下载完成之后，移除按钮，垃圾回收，减少页面内存消耗
    window.URL.revokeObjectURL(link.href)   // 移除之前使用createObjectURL创建的URL，垃圾回收
  }).catch((r) => {
    console.error(r)
  })
}
