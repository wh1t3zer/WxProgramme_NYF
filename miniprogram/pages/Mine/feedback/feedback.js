Page({

  data: {
    name:"",//姓名
    yuanxi:"",//院系
    phone:"",//电话
    content:"",//内容
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

  },
  GetName(e){
    this.setData({
      name:e.detail.value
    })
  },
  Getyuanxi(e){
    this.setData({
      yuanxi:e.detail.value
    })
  },
  GetPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  GetContent(e){
    this.setData({
      content:e.detail.value
    })
  },

  confirm:function(){
    console.log(this.data.name)
    console.log(this.data.phone)
    console.log(this.data.yuanxi)
    console.log(this.data.content)

    if(this.data.name==""){
      wx.showToast({
        title: '请输入您的姓名',
        icon:"none",
      })
      return
    }else if(this.data.content==""){
      wx.showToast({
        title: '请输入内容',
        icon:'none',
      })
      return
    }else if(this.data.yuanxi==""){
      wx.showToast({
        title: '请输入您的院系',
        icon:"none",
      })
      return
    }
    wx.cloud.database().collection("feedback")
    .add({
      data:{
        name:this.data.name,
        yuanxi:this.data.yuanxi,
        content:this.data.content,
        phone:this.data.phone
      }
    })
    .then(res=>{
      console.log("提交成功")
      wx.showToast({
        title: '提交反馈成功',
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },1500)
    })
    .catch(err=>{
      console.log("提交失败",err)
      wx.showToast({
        title: '提交失败请重试',
        icon:'none',
      })
    })
  }
})