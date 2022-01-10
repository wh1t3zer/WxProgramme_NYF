var util = require('../../utils/util')
var app = getApp()
var nowtime=app.getnowtime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择物品类型
    types: ["化妆类", "电器类", "学习类", "衣物类", "生活类","数码类"],
    type_index:0,
    //文字输入框字数
    inputLength: 0,

    //用户上传的信息
    xianzhi_price:Number,
    xianzhi_type:"",
    xianzhi_content:"",
    //照片在云的位置
    xianzhi_imgs:[],
    //存放照片在手机中的位置
    images:[],

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

    //判断物品的类型
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type_index: e.detail.value,
      xianzhi_type:this.data.types[e.detail.value]
    })
  },
  //处理填写的信息准备上传
  uploadPost:function(e){
    //得到用户填写的信息
    this.setData({
      xianzhi_price:e.detail.value.xianzhi_price,
      xianzhi_content:e.detail.value.xianzhi_content,
      warning:"",
      status: false,
    })
    //检查提交信息
    this.checkInfo()
    // 先将照片上传再上传数据库
    if (this.data.status) {
      if (this.data.images.length === 0) {
        console.log("没有上传图片")
        this.setData({
          xianzhi_imgs:this.data.xianzhi_imgs.concat("cloud://cloud1-8gy5it9pf79305cf.636c-cloud1-8gy5it9pf79305cf-1306549006/没有实物图.png")
        })
        this.uploadData()
      } else {
        this.uploadImages()
      }
    }
  },

  //检查提交信息
  checkInfo:function() {
    if (this.data.xianzhi_type=="") {
      this.setData({
        warning: "请选择闲置物品的分类类型",
      })
    }else if (this.data.xianzhi_content == "") {
      this.setData({
        warning: "请输入闲置物品的描述",
      })
    } 
    // else if (this.data.images.length === 0) {
    //   this.setData({
    //     warning: "请输入闲置物品的图片",
    //   })
    // } 
    else if (this.data.xianzhi_price == "") {
      this.setData({
        warning: "请输入闲置物品的价格",
      })
    } else if (this.data.contact_way == "none") {
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
  },
  //隐藏模态窗口
  modalChange(e) {
    this.setData({
      modalName: null
    })
  },
  //将帖子信息上传到数据库
  uploadData:function(){
    var date=new Date()
    const db = wx.cloud.database()
    db.collection("xianzhi").add({
      data:{
        "content":this.data.xianzhi_content,
        "imgs":this.data.xianzhi_imgs,
        "price":this.data.xianzhi_price,
        "type":this.data.xianzhi_type,
        "date":nowtime,
        "contact":this.data.contact_way,
      },
      success(res){
        //成功上传后提示信息
        console.log("插入成功")

        // 关闭当前页面，跳转到应用内的某个页面
        wx.navigateBack({
          delta: 1,
        })
        wx.showToast({
          title: '成功发布',
          icon: 'success',
          duration: 1000
        })

      }
    })
  },
  //上传物品图片信息
  uploadImages:function(){
     var images=this.data.images
     //先添加到这一变量，在最后一个再改变this.data中的xianzhi_imgs
     var xianzhi_imgs=[]

     images.forEach(item=>{
       console.log(item)
       wx.cloud.uploadFile({
         cloudPath:"xianzhi_imgs/"+item.substring(item.length-20),//上传至云端的路径
         filePath:item,//小程序临时文件路径
         success:res=>{
           //返回文件ID
           console.log(res.fileID)
           xianzhi_imgs.push(res.fileID)
           console.log(xianzhi_imgs)
           
           //获取所有图片在云端的位置后上传到数据库

           if(xianzhi_imgs.length===images.length){
             //将局部变量赋给this.data
             this.setData({
               xianzhi_imgs:xianzhi_imgs
             })
             console.log(this.data.xianzhi_imgs)
             //隐藏上传提示
             wx.hideLoading()
           }
           this.uploadData()
         },
         fail:console.error
       })
     });
  },
  //选择图片
  chooseImage:function(e){
    var that=this;
    if(that.data.images.length<3){
      wx.chooseImage({
        count: 3,//最多可以选择的图片张数
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
        title: "图片只能上传三张！",
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