// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection("square").doc(event.id)
  .update({
    data:{
      comment:event.comment
    }
  })
  .then(res=>{
    console.log("添加评论成功")
    return res
  })
  .catch(res=>{
    console.log("添加评论失败")
    return res
  })
}