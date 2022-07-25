export default {
  numSub( arg1, arg2 ) {
    let r1, r2, m;
    let precision ; // 精度
    try {
      r1 = arg1.toString().split('.')[1].length; // 获取arg1小数位的长度
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length; // 获取arg2小数位的长度
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    precision = (r1 > r2) ? r1 : r2;  // 获取精度，
    return ((arg1 * m - arg2 * m)/m).toFixed(precision)
  }

}
