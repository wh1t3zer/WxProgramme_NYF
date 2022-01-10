var util = require('../../utils/util')
var app = getApp()
Page({
  //失物招领
  /**
   * 页面的初始数据
   */
  data: {
    //文字输入框字数
    inputLength: 0,

    //用户上传的信息
    shiwu_content:"",
    shiwu_things:"",
    //照片在云的位置
    shiwu_imgs:[],
    //存放照片在手机中的位置
    images:[], 
    //选择物品类型
    types: ["寻找失物", "拾物寻主"],
    type_index:0,
    shiwu_type:"",
    //警告
    warning: "",
    //检验状态
    status: "",
    // 辨别用户第几次点击发布
    display:true,

   //可选择联系方式
    contact_wechat: true,
    contact_phone: true,

    //发布的联系方式
    contact_way: "all",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断当前用户是否为以注册用户
    util.isRegistered()
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
    //统计文本字数
    bindInput: function(e) {
      var inputLength = e.detail.value.length;
      this.setData({
        inputLength: inputLength,
      })
    },

  //处理填写的信息准备上传
  uploadPost:function(e){
    //得到用户填写的信息
    var that=this;
    var nowtime=app.getnowtime()
    this.setData({
      shiwu_content:e.detail.value.shiwu_content,
      shiwu_things:e.detail.value.shiwu_things,
      warning:"",
      status: false,
    })
    if(this.data.shiwu_type==""){
      this.setData({
        warning: "请选择物品类型",
      })
    }
    else if(this.data.shiwu_things==""){
      this.setData({
        warning:"请输入物品名称"
      })
    }
    else if (this.data.images.length === 0) {
      this.setData({
        warning: "请上传物品的图片",
      })
    } 
    else if (this.data.contact_way == "none") {
      this.setData({
        warning: "请至少选择一种联系方式",
      })
    } else {
      this.setData({
        warning: "发布成功",
        status: true,
        display:false
      })
    }
    this.setData({
      modalName: "Modal",
    })
    const db=wx.cloud.database()
    db.collection('shiwuzhaoling').add({
      data:{
        "swiper_index": app.globalData.userCloudData.swiper_index,
        "nickname":app.globalData.userCloudData.nick_name,
        "content":this.data.shiwu_content,
        "date":nowtime,
        "type":this.data.shiwu_type,
        "contact":this.data.contact_way,
        "things":this.data.shiwu_things
      },
      success(res){
        console.log('提交结果',res)
        var _id=res._id
        var images=that.data.images
        var shiwu_imgs=[]
        images.forEach(item => {
          console.log(item)
          wx.cloud.uploadFile({
            cloudPath: "shiwuzhaoling_imgs/"+item.substring(item.length-20), // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              console.log(res.fileID)
             shiwu_imgs.push(res.fileID)
              console.log(shiwu_imgs)
              if(res.errMsg=="cloud.uploadFile:ok"){
              db.collection('shiwuzhaoling').doc(_id).update({
                data:{
                  "images":shiwu_imgs,
                },
                success:console.log,
                fail:console.error
              })
              wx.hideLoading();
              wx.navigateBack({
               delta:1,
              })
            }
            else{
              wx.showToast({
                title: res.errMsg,
                icon:'none'
              });
            }
            },
            fail: console.error
          })
        });
      }
    })
  },

  //隐藏模态窗口
  modalChange(e) {
    this.setData({
      modalName: null
    })
  },
  
    //判断物品的类型
    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        type_index: e.detail.value,
        shiwu_type:this.data.types[e.detail.value]
      })
    },
  
  //选择图片
  chooseImage:function(e){
    var that=this;
    if(that.data.images.length<2){
      wx.chooseImage({
        count: 2,//最多可以选择的图片张数
        sizeType:['compressed'],//可以指定是原图还是压缩图，默认二者都有
        sourceType:['album','camera'],//可以指定来源是相册还是相机，默认二者都有
        success:res=>{
          this.setData({
            images:this.data.images.concat(res.tempFilePaths)
          })
          console.log(this.data.images)
        }
      });
    }else{
      wx.showToast({
        title: "图片只能上传两张！",
        icon:'none',
        duration:2000,
        mask:true,
      })
    }
  },
  //用户点击放大图片
  handleImagePreview:function(e){
    var index=e.target.dataset.index
    var images=this.data.images
    wx.previewImage({
      current:images[index],//当前浏览的图片
      urls:images, //所有要浏览的图片
   })
  },
  //点击删除图片
  removeImage:function(e){
    var index=e.target.dataset.index
    //删除指定位置的图片
    var images=this.data.images
    images.splice(index,1)
    this.setData({
      images:images
    })
    console.log(index)
    console.log(this.data.images)
  },
  //选择微信联系方式
  switchChange:function(e){
    console.log('wechat',e.detail.value)
    this.setData({
      contact_wechat:e.detail.value
    })
    this.contactChange()
    console.log('contact_way:',this.data.contact_way)
  },
  //选择手机号联系方式:
  switchChange2:function(e){
    console.log('phone',e.detail.value)
    this.setData({
      contact_phone:e.detail.value,
    })
    this.contactChange()
    console.log('contact_way:',this.data.contact_way)
  },
  //选择联系方式
  contactChange:function(){
    if(this.data.contact_wechat && this.data.contact_phone){
      this.setData({
        contact_way:"all"
      })
    }else if(!this.data.contact_wechat&& this.data.contact_phone){
      this.setData({
        contact_way:"phone"
      })
    }else if(this.data.contact_wechat&&!this.data.contact_phone){
      this.setData({
        contact_way:"wechat"
      })
    }else {
      this.setData({
        contact_way:"none"
      })
    }
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