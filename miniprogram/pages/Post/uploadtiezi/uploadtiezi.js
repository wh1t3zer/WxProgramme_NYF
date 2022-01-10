var app=getApp()
var util=require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //发布帖子的类型
    types:["心情", "组队", "学习", "吐槽", "求助","其他"],
    type_index:0,
    //用户上传的信息
    fabu_type:"",
    textContent:"",
    //存放到手机的位置
    images:[],
    display:true,
    dizhi:"",
    fabu_imgs:[]
  },
  //选择图片
  chooseImage:function(e){
    var that=this;
    if(that.data.images.length < 6){
      wx.chooseImage({
        count: 6,//做多可选择的图片张数
        sizeType:["compressed"],//压缩图还是原图
        sourceType:['album','camera'],//指定拍摄还是相机
        success:res=>{
          this.setData({
            images:this.data.images.concat(res.tempFilePaths)
          })
          console.log(this.data.images)
        }
      });
    }else{
      wx.showToast({
        title: '图片限传6张',
        icon:'none',
        duration:2000,
        mask:true,
      })
    }
  },
  //判断物品的类型
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type_index: e.detail.value,
      fabu_type:this.data.types[e.detail.value]
    })
  },
  GetLocation:function(){
    wx.getLocation({
      type:'gcj02',
      success(res){
        const latitude=res.latitude
        const longitude=res.longitude
        console.log(res)
        wx.chooseLocation({
          success:function(res){
            console.log(res)
          }
        })
      }
    })
  },
  uploadPost:function(e){
    var that=this
    //时间
    var nowtime=app.getnowtime()
    this.setData({
      textContent:e.detail.value.textContent
    })
    if(this.data.textContent==''&&this.data.images.length==0){
      wx.showLoading({
        title: '内容不能为空！',
        icon:'warning',
      });
      setTimeout(function(){
        wx.hideLoading();
      },1500)
      return false;
    }else if(this.data.fabu_type==''){
      wx.showLoading({
        title: '发布的版块为空！',
        icon:'warning',
      });
      setTimeout(function(){
        wx.hideLoading();
      },1500)
      return false;
    }
    wx.showLoading({
      title: '发布中...',
    });
    this.setData({
      display:false
    })
    const db=wx.cloud.database()
    db.collection('square').add({
      data:{
        "nickname":app.globalData.userCloudData.nick_name,
        "swiper_index":app.globalData.userCloudData.swiper_index,
        "content":this.data.textContent,
        "posterid":app.globalData.userCloudData._openid,
        "type":this.data.fabu_type,
        "comment_number":0,
        "praise_number":0,
        "comment":[],
        "created_at":nowtime,
        "updated_at":nowtime
      },
      success(res){
        console.log("提交结果",res)
        var _id=res._id
        var images=that.data.images
        var fabu_imgs=[]
        images.forEach(item => {
          console.log(item)
          wx.cloud.uploadFile({
            cloudPath: "square_imgs/"+item.substring(item.length-20), // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              console.log(res.fileID)
              fabu_imgs.push(res.fileID)
              console.log(fabu_imgs)
              if(res.errMsg=="cloud.uploadFile:ok"){
              db.collection('square').doc(_id).update({
                data:{
                  "images":fabu_imgs,
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
              setTimeout(function(){
                wx.hideLoading();
              },1500)
            }
            },
            fail: console.error
          })
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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