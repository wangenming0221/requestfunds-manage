import Cookies from 'js-cookie'

/**
 * 登录方法
 */
export default class LoginManager {
    /**
       * 存储stoken到本地
       */
    static setToken (token) {
        localStorage.setItem('token', token)
    }

    /**
       * 从本地存储中获取stoken
       */
    static getToken () {
        return localStorage.getItem('token')
    }

    /**
       * 清空token
       */
    static clearToken () {
        localStorage.removeItem('token')
    }

    /**
     * 设置用户信息
     */
    static setUserInfo (user) {
        localStorage.setItem('user', JSON.stringify(user))
    }

    /**
     * 返回用户信息
     */
    static getCurentUserInfo () {
        return JSON.parse(localStorage.getItem('curentUser'))
    }

    static setCurentUserInfo (user) {
        localStorage.setItem('curentUser', JSON.stringify(user))
    }

    // 水印
    static getWater () {
        return JSON.parse(localStorage.getItem('water'))
    }

    static setWater (water) {
        localStorage.setItem('water', JSON.stringify(water))
    }

    static removeCurentUser () {
        localStorage.removeItem('curentUser')
        console.log(localStorage.getItem('curentUser'))
    }

    /**
     * 返回用户信息
     */
    static getUserInfo () {
        return JSON.parse(localStorage.getItem('user'))
    }


    /**
     * 清除用户信息
     */
    static clearUserInfo () {
        localStorage.removeItem('user')
        localStorage.removeItem('itemId')
        localStorage.removeItem('itemName')
        localStorage.removeItem('curentUser')
    }
    /**
     * 删除用户信息
     */
    static removeUserInfo () {
        localStorage.removeItem('user')
    }

    /**
     * 清除用户信息
     */
    static logout () {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('INDEX_PATH')
        localStorage.removeItem('SERVER_NAME')
        localStorage.removeItem('TREE_MODEL')
        localStorage.removeItem('itemId')
        localStorage.removeItem('itemName')
        localStorage.removeItem('fromProject')
        this.removeEzSystemWebInfo()
    }

    /**
     * 判断用户是否有该权限
     */
    static checkPermission (code) {
        const userInfo = LoginManager.getUserInfo()
        if (code && userInfo && userInfo.permissions) {
            if (userInfo.permissions.indexOf(',' + code + ',') >= 0) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    /**
     * 存储路由
     */
    static setRoute (route) {
        localStorage.setItem('route', JSON.stringify(route))
    }

    /**
     * 获取路由
     */
    static getRoute () {
        return JSON.parse(localStorage.getItem('route'))
    }

    /**
     * 清除路由
     */
    static clearRoute () {
        localStorage.removeItem('route')
    }

    /**
     * 存储从哪个项目登录到当前系统的信息
     */
    static setFromProject (project) {
        localStorage.setItem('fromProject', JSON.stringify(project))
    }

    /**
     * 获取从哪个项目登录到当前系统的信息
     */
    static getFromProject () {
        if (!localStorage.getItem('fromProject')) {
            return null
        }
        return JSON.parse(localStorage.getItem('fromProject'))
    }

    /**
     * 清除从哪个项目登录到当前系统的信息
     */
    static removeFromProject () {
        localStorage.removeItem('fromProject')
    }

    /**
     * 从网站前台登录到当前系统的用户信息
     */
    static getEzSystemWebInfo () {
        return{
            ez_system_web_token:Cookies.get('ez_system_web_token'),//token
            ez_system_web_user_uuid:Cookies.get('ez_system_web_user_uuid'),//用户uuid
            ez_system_web_curentUser_uuid:Cookies.get('ez_system_web_curentUser_uuid'),//租户uuid
        }
    }

    /**
     * 删除从网站前台登录到当前系统的用户信息
     */
    static removeEzSystemWebInfo () {

        let cookieConfig={
            path:'/',
            domain:process.env.VUE_APP_EZ_SYSTEM_WEB_COOKIE_DOMAIN,
        }
        //token
        Cookies.remove('ez_system_web_token',cookieConfig)
        //用户uuid
        Cookies.remove('ez_system_web_user_uuid',cookieConfig)
        //租户uuid
        Cookies.remove('ez_system_web_curentUser_uuid',cookieConfig)
    }

    /**
     * 当前时间
     */
    static nowTime(){
      const dt = new Date()
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + '').padStart(2, '0');
      const d = (dt.getDate() + '').padStart(2, '0');
      const hh = (dt.getHours() + '').padStart(2, '0');
      const mm = (dt.getMinutes() + '').padStart(2, '0');
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    
    /**
     * 得到平台管理员的租户id
     * @returns 
     */
    static getAdminTenentId(){
        return '12345678901234567890123456789012'
    }
}
