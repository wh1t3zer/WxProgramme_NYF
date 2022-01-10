var app=getApp()
var util=require('../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
//用户信息
    user_id: "",
    user_data: {},
    //帖子信息
    detail:{},
    //头像列表
    swiperList:[],
    //窗口宽度
    windowWidth: 0,
    // json格式的帖子信息
    old_xianzhi_data: {},
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // var xianzhi_data=JSON.parse(options.xianzhi_data)
   console.log("接收的id",options.id)
   const db=wx.cloud.database()
   db.collection('xianzhi')
   .doc(options.id)
   .get()
   .then(res=>{
     console.log("详情页成功",res)
     this.setData({
       detail:res.data
     })
   })
   .catch(res=>{
     console.log("详情页失败",res)
   })
    this.setData({
        swiperList: app.globalData.swiperList,
        windowWidth: wx.getSystemInfoSync().windowWidth,
    })

    // 允许此页面进行转发
    wx.showShareMenu({
      withShareTicket: true
    }); 

    this.getUserData()
  },
  //用户点击放大图片
  PreviewImg:function(e) {
    var index = e.target.dataset.index
    var images = this.data.xianzhi_data.images
    wx.previewImage({
      current: images[index],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
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
        console.log('[数据库] [查询记录] 成功: ', this.data.user_data)
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
  showConnect: function (e) {
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

   // 复制功能函数
   copyText:function(connectWay){
    var that = this;
    wx.setClipboardData({
      data: that.data,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
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
  onShareAppMessage: function (options) {
    var xianzhi_type = "闲置"
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target)
    }
    return {
      //## 此为转发页面所显示的标题
      title: xianzhi_type + ": " + this.data.xianzhi_data.title,
      path: 'pages/Index/contact/contact?xianzhi_data=' + this.data.old_xianzhi_data,
      imageUrl: this.data.xianzhi_data.imgs[0],
      success: function (res) {
        console.log("发送成功")
      },
      fail: function () {
        console.log("发送失败")
      }
    }
  }
})