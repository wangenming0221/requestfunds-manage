//时间插件处理
export function dateToDay(index,timeRange) {
  var dateRange=new Date(timeRange[index]);
  var year=dateRange.getFullYear();
  var month=dateRange.getMonth()+1<10?"0"+(dateRange.getMonth()+1):(dateRange.getMonth()+1);
  var day=dateRange.getDate()<10?"0"+dateRange.getDate():dateRange.getDate();
  return year+"-"+month+"-"+day;
}
//到秒
export function dateToSecond(index,timeRange) {
  var dateRange=new Date(timeRange[index]);
  var year=dateRange.getFullYear();
  var month=dateRange.getMonth()+1<10?"0"+(dateRange.getMonth()+1):(dateRange.getMonth()+1);
  var day=dateRange.getDate()<10?"0"+dateRange.getDate():dateRange.getDate();
  var hour=dateRange.getHours()<10?"0"+dateRange.getHours():dateRange.getHours();
  var minu=dateRange.getMinutes()<10?"0"+dateRange.getMinutes():dateRange.getMinutes();
  var seco=dateRange.getSeconds()<10?"0"+dateRange.getSeconds():dateRange.getSeconds();
  return year+"-"+month+"-"+day+" "+hour+":"+minu+":"+seco;
}
//删除空children
export function deleteChildren(arr) {
  let childs = arr
  for (let i = childs.length; i--; i > 0) {
    if (childs[i].children) {
      if (childs[i].children.length) {
        deleteChildren(childs[i].children)
      } else {
        delete childs[i].children
      }
    }
   }
  return arr
}
//push节点id
export function pushChildrenNode(arr) {
  let allArray=arr;
  let backArray="";
  let index=0;
  if(allArray.length>0){
    for (let i=0;i < allArray.length;i++){
      if(index==allArray.length-1){
        backArray+=allArray[i].toString();
      }else{
        backArray+=allArray[i].toString()+",";
      }
      index++;
    }
  }
  return  Array.from(new Set(backArray.split(','))).toString();
}



