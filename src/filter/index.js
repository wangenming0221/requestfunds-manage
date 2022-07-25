/**
 * 千分位
 * @param {*} params 参数可传数字与字符
 */

export const formatThousands = params => {
  if (params) {
    let arr = params.toString().split('.');
    let str = arr[0];
    let commaStr = arr[1] ? '.' + arr[1] : '';
    let res = '';
    let strLen = str.length;
    for (let i = 1; i <= strLen; i++) {
      res += str[i - 1];
      if ((strLen - i) % 3 === 0 && i !== strLen) {
        res += ','
      }
    }
    return res + commaStr;
  } else {
    return params
  }
}
