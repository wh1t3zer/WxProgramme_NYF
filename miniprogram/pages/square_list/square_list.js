var app=getApp()
var util=require('../utils/util')
let dianzan=false
let ID=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    swiperList:[],
    dianzanUrl:"../../images/topic_praise.png",
    //评论数组
    comment:[],
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.getUserInCloud(this.data.openid);
    ID=options.id
    console.log("接收的id",ID)
    const db=wx.cloud.database()
    db.collection('square')
    .doc(ID)
    .get()
    .then(res=>{
      console.log("详情页成功",res)
      dianzan=res.data.dianzan
      this.setData({
        detail:res.data,
        dianzanUrl:dianzan? "../../images/color-love.png":"../../images/topic_praise.png",
        comment:res.data.comment
      })
    })
    .catch(res=>{
      console.log("详情页失败",res)
    })
    this.setData({
      swiperList: app.globalData.swiperList,
    })
  },

  //获取用户输入评论
  getinfo:function(e){
   this.setData({
    content:e.detail.value
   })
  },
  //发布评论
  postcomment(){
  let content=this.data.content
   let commentItem={}
   commentItem.name=app.globalData.userCloudData.nick_name
   commentItem.content=content
   commentItem.swiper_index=app.globalData.userCloudData.swiper_index
   commentItem.date=app.getnowtime()
   let commentArr=this.data.comment
   if(content.length==0){
     wx.showToast({
       title: '评论不能为空哦',
       icon:'none'
     })
     return 
   }else{
   commentArr.push(commentItem)
   console.log(commentArr)
   }
   wx.showLoading({
     title: '发表中...',
   })
   wx.cloud.callFunction({
     name:"postcomment",
     data:{
        comment:commentArr,
        id:ID,
     }
   })
   .then(res=>{
    console.log("发表成功",res)
    this.setData({
      comment:commentArr,
      content:'',
    })
    wx.hideLoading()
   })
   .catch(res=>{
    console.log("发表失败",res)
    wx.hideLoading()
   })
  },
  //点赞
  dianzan(){
    if(dianzan){
      this.setData({
        dianzanUrl:"../../images/topic_praise.png"
      })
      dianzan=false
    }else{
      this.setData({
        dianzanUrl:"../../images/color-love.png"
      })
      dianzan=true
    }
    wx.cloud.callFunction({
      name:"FrofessZan",
      data:{
        id:ID,
        dianzan:dianzan
      }
    })
    .then(res=>{
      console.log("改变点赞成功")
    })
    .catch(res=>{
      console.log("改变点赞失败")
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})