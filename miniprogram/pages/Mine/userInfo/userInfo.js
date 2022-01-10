const app=getApp()
Page({
  data:{
    StatusBar:app.globalData.StatusBar,
    CustomBar:app.globalData.CustomBar,
    //头像列表
    swiperList:[],
    //头像索引
    swiper_index:"",
    //昵称
    nick_name:"",
    //原昵称
    old_nick_name:"",
    //姓名

    //real_name:"",
    //原姓名
   // old_real_name:"",
   
    //学校索引
    school_index:null,
    //学校选择
    school_choose:["广州南方学院"],
    //微信号
    wechat_id:"",
    //原微信号
    old_wechat_id:"",
    //手机号码
    phone:"",
    //原手机号码
    old_phone:"",
    //存放照片在手机的位置
    imgList:[],
    //照片在云的位置
    pass_img:[],

    //警告
    warning:"",
    //认证状态
    pass:"",
    //审阅状态
    al_pass:"",
    //修改了电话号码
    editPhone:false,
  },
  onLoad(options){
    //初始化towerSwiper 传已有的数组名即可
    this.setData({
      swiperList: app.globalData.swiperList,
      swiper_index: app.globalData.userCloudData.swiper_index,
      nick_name: app.globalData.userCloudData.nick_name,
      old_nick_name: app.globalData.userCloudData.nick_name,
      school_index: app.globalData.userCloudData.school_index,
      wechat_id: app.globalData.userCloudData.wechat_id,
      old_wechat_id: app.globalData.userCloudData.wechat_id,
      phone: app.globalData.userCloudData.phone,
      old_phone: app.globalData.userCloudData.phone,
      imgList: app.globalData.userCloudData.pass_img,
      pass_img: app.globalData.userCloudData.pass_img,
      pass: app.globalData.userCloudData.pass,
      al_pass: app.globalData.userCloudData.al_pass,
    })

    this.towerSwiper('swiperList');

    //提示已注册但未通过的用户
    if(options.show=="true"){
      wx.showToast({
        title: '通过验证才能使用更多功能哦',
        icon:'none',
        duration:2000,
        mask:true
      })
    }
  },

//选择图片
ChooseImage:function(){
  wx.chooseImage({
    count: 1,//默认为9
    sizeType:['compressed'],//可以指定是原图还是压缩图，默认二者都有
    sourceType:['album','camera'],//从相册选择
    success:(res)=>{
      if(this.data.imgList.length!=0){
        this.setData({
          imgList:this.data.imgList.concat(res.tempFilePaths)
        })
      }else{
        this.setData({
          imgList:res.tempFilePaths
        })
      }
    }
  });
},
//显示图片
ViewImage:function(e){
  wx.previewImage({
    urls: this.data.imgList,
    current:e.currentTarget.dataset.url
  });
},
//删除图片
delImg:function(e){
  wx.showModal({
    title:'提示',
    content:'确定要删除该图片吗？',
    cancelText:'取消',
    confirmText:'删除',
    success:res=>{
      if(res.confirm){
        this.data.imgList.splice(e.currentTarget.dataset.index,1);
        this.setData({
          imgList:this.data.imgList
        })
      }
    }
  })
},

//选择学校
SchoolChange:function(e){
  this.setData({
    school_index:e.detail.value,
  })
},

//获取手机号
getPhone(e){
  var data=e.detail.value;
  if(data==""||data==this.data.old_phone){
    this.setData({
      phone:this.data.old_phone,
      editPhone:false,
    })
  }else{
    this.setData({
      phone:data,
      editPhone:true,
    })
  }
},
//隐藏模态窗口
hideModal(e){
  this.setData({
    modalName:null
  })
},
//数据库查重
checkDB:function(key,value){
    return new Promise((resolve,reject)=>{
      const db=wx.cloud.database()
      const _=db.command
      db.collection('users')
      .where(_.and([
        {
          "_openid":_.neq(app.globalData.userCloudData._openid),
        },
        {
          [key]:value,
        }
      ]))
      .limit(1)
      .get({
        success:function(res){
          if(res.data.length>0){
            resolve(true)
          }else{
            resolve(false)
          }
        }
      })
    })
},
//检验数据
async checkInfo(){
  this.setData({
    isLoad:true,
  })
  wx.showLoading({
    title: '正在验证',
    icon:'loading',
  })
  if(this.data.nick_name==""){
    this.setData({
      warning:"昵称不能为空",
    })
  }else if(await this.checkDB('name',this.data.nick_name)){
    this.setData({
      warning:"昵称已被注册",
    })
  }
  // else if(this.data.real_name==""){
  //   this.setData({
  //     warning:"姓名不能为空",
  //   })
  // }
  else if(this.data.school_index==null){
    this.setData({
      warning:"学校不能为空",
    })
  }else if(this.data.wechat_id==""){
    this.setData({
      warning:"微信号不能为空",
    })
  }else if(await this.checkDB('wechat_id',this.data.wechat_id)){
    this.setData({
      warning:"微信号已被注册",
    })
}else if (this.data.phone==""){
    this.setData({
      warning:"手机号码不能为空",
    })
  }else if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.phone))){
    this.setData({
      warning:"请输入正确的手机号",
    })
  }else if(await this.checkDB('phone',this.data.phone)){
    this.setData({
      warning:"该手机号已被注册",
    })
  }else if(this.data.imgList.length==0){
    this.setData({
      warning:"请上传学生证",
    })
  }else {
    this.setData({
      warning:"提交成功",
    })
    //判断是否有修改学生证信息
    //有则需要上传图片
    if(this.data.imgList!=app.globalData.userCloudData.pass_img){
      //删除旧照片，上传新照片
      this.delPassImg()
      this.uploadImages()
    }
    else{
      this.uploadData()
    }
  }

  wx.hideLoading()
  this.setData({
    modalName:"Modal",
    isLoad:false,
  })
},
//提交表单
formSubmit:function(e){
  if(e.detail.value.nick_name!=""){
    this.setData({
      nick_name:e.detail.value.nick_name
    })
  }else{
    this.setData({
      nick_name:this.data.old_nick_name
    })
  }
  // if(e.detail.value.real_name!=""){
  //   this.setData({
  //     real_name:e.detail.value.real_name
  //   })
  // }
  // else{
  //   this.setData({
  //     real_name:this.data.old_real_name
  //   })
  // }
  if(e.detail.value.wechat_id!=""){
    this.setData({
      wechat_id:e.detail.value.wechat_id
    })
  }else{
    this.setData({
      wechat_id:this.data.old_wechat_id
    })
  }
  if(e.detail.value.phone!=""){
    this.setData({
      phone:e.detail.value.phone
    })
  }else{
    this.setData({
      phone:this.data.old_phone
    })
  }
  //如果是未通过的用户更新资料需要更新al_pass
  if(!this.data.pass){
    this.setData({
      pass:false,
      al_pass:false
    })
  }
  this.setData({
    warning:"",
  })

  this.checkInfo()
},
//上传数据
uploadData:function(){
  console.log("上传数据")
  const db=wx.cloud.database()
  db.collection("users").doc(app.globalData.userCloudData._id).update({
    data:{
      "swiper_index":this.data.swiper_index,
      "nick_name":this.data.nick_name,
      // "real_name":this.data.real_name,
      "school_index":this.data.school_index,
      "wechat_id":this.data.wechat_id,
      "phone":this.data.phone,
      "pass_img":this.data.pass_img,
      "pass":this.data.pass,
      "al_pass":this.data.al_pass
    },
    success:function(res){
      //成功上传后提示信息
      console.log("上传成功")
      wx.showLoading({
        title: '成功上传',
        icon:'success',
        duration:1500,
      })
      wx.navigateBack({})
    }
  })
},
//上传用户图片信息
uploadImages:function(){
  console.log("上传图片")
  var images=this.data.imgList
  //先添加到这一变量，在最后一个在改变this.data.中的pass_img
  var pass_img=[]
  //对用户点击的图片进行上传
  images.forEach(item=>{
    console.log(item)
    wx.cloud.uploadFile({
      cloudPath:"pass_imgs/"+item.substring(item.length-20),//上传至云端的路径
      filePath:item,//小程序临时文件路径
      success:res=>{
        //返回文件ID
        pass_img.push(res.fileID)
        //获取所有图片在云端的位置后上传到数据库
        if(pass_img.length===images.length){
          //将局部变量赋给this.data
          this.setData({
            pass_img:pass_img
          })
          console.log(this.data.pass_img)
        }
      },
      fail:console.error
    })
  });
  //上传完图片上传用户数据
  this.uploadData()
},

//删除旧学生证图片
delPassImg:function(){
  console.log("删除旧学生证照片")
  console.log(app.globalData.userCloudData.pass_img)
  wx.cloud.deleteFile({
    fileList:app.globalData.userCloudData.pass_img,
    success:res=>{
      console.log("删除旧图片成功")
    },
    fail:console.error
  })
},

//轮播图
//towerSwiper
//初始化towerSwiper
towerSwiper:function(name){
  let list= this.data[name];
  for(let i=0;i<list.length;i++){
    list[i].zIndex=parseInt(list.length/2)+1-Math.abs(i-parseInt(list.length/2))
    list[i].mLeft=i-parseInt(list.length/2)
  }
  this.setData({
    swiperList:list
  })
},
//towerSwiper触摸开始
towerStart(e){
  this.setData({
    towerStart:e.touches[0].pageX
  })
},
//towerSwiper计算方向
towerMove(e){
  this.setData({
    direction:e.touches[0].pageX-this.data.towerStart> 0 ? 'right' :'left'
  })
},
//towerSwiper计算滚动
towerEnd(e){
  let direction=this.data.direction;
  let list=this.data.swiperList;
  if(direction=='right'){
    let mLeft=list[0].mLeft;
    let zIndex=list[0].zIndex;
    for(let i=1;i<list.length;i++){
      list[i-1].mLeft=list[i].mLeft
      list[i-1].zIndex=list[i].zIndex
    }
    list[list.length-1].mLeft=mLeft;
    list[list.length-1].zIndex=zIndex;
    this.setData({
      swiperList:list
    })
  }else{
    let mLeft=list[list.length-1].mLeft;
    let zIndex=list[list.length-1].zIndex;
    for(let i=list.length-1;i>0;i--){
      list[i].mLeft=list[i-1].mLeft
      list[i].zIndex=list[i-1].zIndex
    }
    list[0].mLeft=mLeft;
    list[0].zIndex=zIndex;
    this.setData({
      swiperList:list
    })
  }
  //zIndex=4,mLeft=0为中心图片
  var that=this;
  for(let i=0;i<list.length;i++){
    if(list[i].mLeft==0){
      that.setData({
        swiper_index:list[i].id
      })
    }
  }
  console.log('swiper_index',this.data.swiper_index)
},
})