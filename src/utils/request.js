import axios from 'axios'
// import { Notification, MessageBox, Message } from 'element-ui'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import errorCode from '@/utils/errorCode'
import { tansParams } from "@/utils/ruoyi";
import { baseURL } from '@/config'
import { oXHRHeadrs } from './headers'
import { site } from '@/utils/tengyun'

axios.defaults.headers['Content-Type'] = oXHRHeadrs.headers["Content-Type"]
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: baseURL + process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 40000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config
}, error => {
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    // const code = res.data.code || 200;
    // 获取错误信息
    // const msg = errorCode[code] || res.data.msg || errorCode['default']
    // if (code === 401) {
    //   MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   ).then(() => {
    //     store.dispatch('LogOut').then(() => {
    //       location.href = '/index';
    //     })
    //   });
    //   return Promise.reject()
    // } else if (code === 500) {
    //   Message({
    //     message: msg,
    //     type: 'error'
    //   })
    //   return Promise.reject(new Error(msg))
    // } else if (code !== 200) {
    //   Notification.error({
    //     title: msg
    //   })
    //   return Promise.reject('error')
    // } else {
    //   return res.data
    // }
    const code = Number(res.data.code);
    if (code === 0) {
      return res.data;
    } else if (code === 401) {
      MessageBox.alert('登录状态已过期，请您重新登录!', '系统提示', {
          confirmButtonText: '重新登录',
          showClose: false,
          // cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.href = '/requestFundsManageWeb/';
        })
      });
      return Promise.reject()
    } else if (code === 402) {
      // 从腾云进入时 未绑定角色会返回402
      MessageBox.alert(res.data.msg, '系统提示', {
          confirmButtonText: '返回',
          showClose: false,
          // cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        location.href = site;
      });
      return Promise.reject()
    } else {
      Message({
        message: res.data.msg,
        type: 'error'
      })
      return Promise.reject('error')
    }
  },
  error => {
    console.log(error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(url, params, filename) {
  return service.post(url, params, {
    transformRequest: [params => {
      return tansParams(params)
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob'
  }).then((data) => {
    const content = data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = filename
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, filename)
    }
  }).catch((r) => {
    console.error(r)
  })
}

export default service
