// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection("square").doc(event.id)
  .update({
    data:{
      dianzan:event.dianzan
    }
  })
  .then(res=>{
    console.log("改变点赞状态成功")
    return res
  })
  .catch(res=>{
    console.log("改变点赞失败")
    return res
  })
}