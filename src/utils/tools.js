/* eslint-disable */
export default class tools {
    static getUuid () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    static getFullId (key, date, id) {
        date = new Date(date)
        id = ('0000000000' + id).slice(-6)
        return key + "-" + date.getFullYear() + "-" + id
    }

    /**
     * file对象转base64
     * @param {*} file 
     */
    static fileToBase64 (file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                resolve(event.target.result)
            }
        })
    }
    /**
     * base64转blob
     * @param {*} dataurl 
     */
    static dataURLtoBlob (dataurl) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/) === null ? 'text/plain' : arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
}