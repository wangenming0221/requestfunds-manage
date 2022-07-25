/* eslint-disable */
import OSS from 'ali-oss';
import request from '@/utils/request'
export default class alioss {

    static getUuid () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = ""
        var uuid = s.join("")
        return uuid
    }
    async getOss(){
        let response = await request.get('/total-material/totalmaterial/sysOss/getStsToken', {
            params: {
            }
        })
        let token  = response.data
      console.log("token",token)
        if(!token){
            return false
        }
        return  new OSS({
            region: 'oss-cn-zhangjiakou',
            accessKeyId: token.credentials.accessKeyId,
            accessKeySecret: token.credentials.accessKeySecret,
            stsToken: token.credentials.securityToken,
            bucket: 'shouliaoxitong',
        });
    }
    async uploadAudio(file,progress) {

        try {
            const client = await this.getOss();
          console.log("client",client)
            if(!client){
                return false
            }
            const temp = file.name.split('.')
            const ext ='.' + temp[temp.length - 1]
            let now = new Date(); //获取系统日期
            let yy = now.getFullYear(); //获取年，即2007
            let mm = now.getMonth(); //获取月，即04
            let dd = now.getDay(); //获取日，即29
            let clock = yy+"-"+mm+"-"+dd;
            let fileName = clock + "/" + alioss.getUuid() + ext
            const result = await client.multipartUpload(fileName, file, {
                progress,
                // meta是用户自定义的元数据，通过head接口可以获取到Object的meta数据。
                // meta: {
                //     year: 2020,
                //     people: 'test',

                // },
            });
            if(result && result.res && result.res.status == 200){
                const head = await client.head(fileName);
                if(head && head.res && head.res.status == 200 && head.res.requestUrls){
                    return await head.res.requestUrls[0]
                }
            }
        } catch (e) {
            // 捕获超时异常。
            if (e.code === 'ConnectionTimeoutError') {
                console.log('TimeoutError');
                return false
                // do ConnectionTimeoutError operation
            }
            console.log(e);
            return false
        }
    }
    async getSignatureUrl (objectName,fileName){
        const client = await this.getOss();
        if(!client){
            return false
        }
        try {
            console.log(client)
            // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
            const response = {
                'content-disposition': 'attachment; filename='+encodeURIComponent(fileName),
                'content-type': 'application/octet-stream',
            }
            const result = await client.signatureUrl(
                objectName,
                { response }
            );
            return result;
        } catch (e) {
            console.log(e);
        }
    }

}
