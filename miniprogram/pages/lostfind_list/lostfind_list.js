var app=getApp()
var util=require("../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:"",
    swiperList:[],
    user_id:"",
    user_data:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isregister=util.isRegistered()
    console.log("接收的id",options.id)
    const db=wx.cloud.database()
    db.collection('shiwuzhaoling')
    .doc(options.id)
    .get()
    .then(res=>{
      console.log("详情页成功",res)
      this.setData({
        detail:res.data,
      })
    })
    .catch(res=>{
      console.log("详情页失败",res)
    })
    this.setData({
      swiperList: app.globalData.swiperList,
    })
    this.getUserData()
  },
  // 获取物品主人的信息
  getUserData:function(){
    const db = wx.cloud.database()
    // 查询当前物品的主人信息
    db.collection('users').where({
      _openid:this.data.user_id
    }).get({
      success: res => {
        this.setData({
          user_data:res.data[0]
        })
        console.log('[数据库] [查询记录] 成功: ',res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
  },
  //用户联系方式复制
  copywechat: function (e) {
    // 判断当前用户是否为以注册用户
    var isRegistered=util.isRegistered()
    if(isRegistered)
    {
      // 判断微信还是手机
      var promptTitle=""
      var content=""
      if(e.currentTarget.id==="wechatButton"){
        promptTitle="卖家微信"
        content=this.data.user_data.wechat_id
      }
      else{
        promptTitle="卖家手机号码"
        content=this.data.user_data.phone
      }
      console.log(promptTitle)
      console.log(content)
      wx.showModal({
        title: promptTitle,
        content: content,
        confirmText:"复制",
        success: function (res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: content,
              success: function (res) {
                wx.showToast({
                  title: '复制成功',
                });
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //拨打电话
  callphone:function(){
    var content=""
    content=this.data.user_data.phone
    wx.makePhoneCall({
    phoneNumber: content
  }).catch((e)=>{
    //console.log(e)
  })
},
  PreviewImg:function(e){
    var index = e.target.dataset.index
    var images = this.data.detail.images
    wx.previewImage({
      current: images[index],  //当前预览的图片
      urls: images,  //所有要预览的图片
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