var app=getApp()
var util=require('../../utils/util')
Page({
  data: {
    imageArray:[],
    //是否匿名 
    private:false,
    privateValue:'',
    //文本内容
    textContent:'',
    //表白对象姓名
    name:'',
    //弹窗
    warning:"",
    //上传图片
    images:[],
    love_imgs:[],
    modalName:null,
    //是否发送
    canPost:true,
    //验证状态
    status:"",
    display:true,
  },

  //选择图片
  chooseImage:function(e){
      var that=this;
      if(that.data.images.length<4){
        wx.chooseImage({
          count: 4,
          sizeType:['compressed','original'],
          sourceType:['album','camera'],
          success:res=>{
            this.setData({
              images:this.data.images.concat(res.tempFilePaths)
            })
            console.log(this.data.images)
          }
        });
      }
      else{
        wx.showToast({
          title: "图片最多只能上传四张！",
          icon:'none',
          duration:2000,
        })
      }
      
  },
  //删除图片
  DelImg(e){
    var index=e.target.dataset.index
    var images=this.data.images
    images.splice(e.target.dataset.index,1)
    this.setData({
      images:images
    })
    console.log(index)
    console.log(this.data.images)
  },
  setPrivate:function(e){
    console.log(e.detail.value)
    this.setData({
      privateValue:e.detail.value
    });
  },
 //提交
 uploadPost:function(e){
  var that=this
  //时间
  var nowtime=app.getnowtime()
  this.setData({
    name:e.detail.value.name,
    textContent:e.detail.value.textContent,
  })

  if(this.data.textContent==''&& this.data.images.length==0){
    wx.showLoading({
      title: '内容不能为空！',
      icon:'warning',
    });
    setTimeout(function(){
      wx.hideLoading();
    },1500)
    return false;
  }

  wx.showLoading({
    title: '发布中..'
  });
  this.setData({
    display:false
  })
  const db=wx.cloud.database()
  db.collection('love').add({
    data:{
      "nickname":app.globalData.userCloudData.nick_name,
      "swiper_index": app.globalData.userCloudData.swiper_index,
      'name':this.data.name,
      "poster_id":app.globalData.userCloudData._openid,
      "content":this.data.textContent,
      "type":"",
      "status":false,
      "private":this.data.privateValue,
      "comment_number":0,
      "praise_number":0,
      "comment":[],
      "created_at":nowtime,
      "updated_at":nowtime
    },
    success(res){
      console.log('提交结果',res)
      var date=new Date
      const year=date.getFullYear().toString()
      const month=date.getMonth() +1
      const day=date.getDate()
      const hour=date.getHours()
      const minute=date.getMinutes()
      const second=date.getSeconds()
      var uptime=year+month.toString()+day.toString()+hour+minute+second
      var _id=res._id
      var images=that.data.images
      var love_imgs=[]
      if(images.length>0){
      images.forEach(item => {
        console.log(item)
        wx.cloud.uploadFile({
          cloudPath: "love_imgs/"+item.substring(item.length-20)+uptime, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            love_imgs.push(res.fileID)
            console.log(love_imgs)
            if(res.errMsg=="cloud.uploadFile:ok"){
            db.collection('love').doc(_id).update({
              data:{
                "images":love_imgs,
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
      })
    }
    else{
      wx.hideLoading();
      wx.navigateBack({
        delta:1,
       })
    }
    }
  })
},

previewImage:function(e){
  var index=e.target.dataset.index
  var images=this.data.images
  wx.previewImage({
    urls:images,
    current:images[index],
  })
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