const app =getApp();

Page({
  data:{
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    //头像列表
    swiperList:[],
    //头像索引
    swiper_index:"",
    //昵称
    nick_name:"",
    //学校索引
    school_index:0,
    //学校选择
    school_choose:["广州南方学院"],
    //微信号
    wechat_id:"",
    //手机号码
    phone:"",
    //存放照片在手机中的位置
    imgList:[],
    //照片在云的位置
    pass_img:[],

    //警告
    warning:"",
    //检验填写信息是否完整(boolean)
    isInfo:false,
    //是否同意协议
    agree:false,
    //微信号与手机号关联
    associate:true,
  },

  onLoad(options){
    this.setData({
      swiperList:app.globalData.swiperList
    })
    //初始化towerSwiper 传已有数组名，在app.js
    this.towerSwiper('swiperList');
    this.setData({
      swiper_index:this.data.swiperList[3].id,
      nick_name:this.data.nick_name,
    })
    console.log('swiper_index:',this.data.swiper_index)

    //如果没注册则提醒用户注册
    if(options.show=="true"){
      wx.showToast({
        title: '请先完成注册才能使用更多功能哦',
        icon:'none',
        duration:1500,
        mask:true,
      });
    }
  },

  //选择图片
  ChooseImage(){
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
  ViewImage(e){
    wx.previewImage({
      urls: this.data.imgList,
      current:e.currentTarget.dataset.url
    });
  },

//用户点击放大图片
handleImagePreview:function(e){
  var index=e.target.dataset.index
  var images=this.data.images
  wx.previewImage({
    urls: images,//所有要浏览的图片
    current:images[index],//当前浏览的图片
  })
},

//删除图片
DelImg(e){
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

//towerSwiper
//初始化towerSwiper
towerSwiper(name){
  let list=this.data[name];
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
    direction:e.touches[0].pageX-this.data.towerStart> 0 ? 'right' : 'left'
  })
},
//towerSwiper计算滚动
towerEnd(e){
  let direction=this.data.direction;
  let list=this.data.swiperList;
  if(direction=='right'){
    let mLeft=list[0].mLeft;
    let zIndex=list[0].zIndex;
    for(let i =0;i<list.length;i++){
      list[i-1].mLeft=list[i].mLeft
      list[i-1].zIndex=list[i].zIndex
    }
    list[list.length-1].mLeft=mLeft;
    list[list.length-1].zIndex=zIndex;
    this.setData({
      swiperList:list
    })
  }else{
    let mLeft = list[list.length-1].mLeft;
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
      swiper_index:list[1].id
    })
  }
}
console.log('swiper_index:',this.data.swiper_index)
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
  this.setData({
    phone:data,
  })
},
//隐藏模态窗口
hideModal(e){
  this.setData({
    modalName:null
  })
},
//数据库查重
checkDB(key,value){
  return new Promise((resolve,reject)=>{
    const db=wx.cloud.database()
    db.collection('users')
    .where({
      [key]:value,
    })
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
  if(this.data.nick_name==""){
    this.setData({
      warning:"昵称不能为空",
    })
  }else if (await this.checkDB('nick_name',this.data.nick_name)){
    this.setData({
      warning:"昵称已被注册",
    })
  }else if(this.data.school_index==null){
    this.setData({
      warning:"学校不能为空"
    })
  }else if(this.data.phone==""){
    this.setData({
      warning:"手机号码不能为空",
    })
  }else if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.phone))){
    this.setData({
      warning:"请输入正确的手机号",
    })
  }else if(await this.checkDB('phone',this.data.phone)){
    this.setData({
      warning:"手机号码已被注册",
    })
  }else if (this.data.wechat_id==""){
    this.setData({
      warning:"微信号不能为空",
    })
  }else if(await this.checkDB('wechat_id',this.data.wechat_id)){
    this.setData({
      warning:"微信号已被注册",
    })
  }else if (this.data.imgList.length==0){
    this.setData({
      warning:"请上传学生证",
    })
  }else if(!this.data.agree){
    this.setData({
      warning:"未同意南苑范用户服务协议",
    })
  }
  //填入数据无问题
  else{
    this.setData({
      isInfo:true,
    })
  }
  //若有问题则弹框提示
  if(!this.data.isInfo){
    this.setData({
      modalName:"Modal",
    })
  }
},

//记录用户填入信息
setUserInfo:function(e){
  if(e.detail.value.nick_name!=""){
    this.setData({
      nick_name:e.detail.value.nick_name,
    })
  }
  if(this.data.associate){
    this.setData({
      wechat_id:e.detail.value.phone,
    })
  }else{
    this.setData({
      wechat_id:e.detail.value.wechat_id,
    })
  }
  this.setData({
    phone:e.detail.value.phone,
    warning:"",
  })
},

//处理表单信息
processForm:function(e){
  // this.setUserInfo(e)
  this.setData({
    nick_name:e.detail.value.nick_name,
    phone:e.detail.value.phone,
  })
  if(this.data.associate){
    this.setData({
      wechat_id:this.data.phone
    })
  }else{
    this.setData({
      wechat_id:this.data.wechat_id
    })
  }
  this.checkInfo()
  //填写信息完整则准备上传
   if(this.data.isInfo){
     this.uploadImage()
   }
},

//上传数据
uploadData:function(){
  console.log("上传数据")
  const db=wx.cloud.database()
  db.collection('users').add({
    data:{
      "swiper_index":this.data.swiper_index,
      "nick_name":this.data.nick_name,
      "school_index":this.data.school_index,
      "wechat_id":this.data.wechat_id,
      "phone":this.data.phone,
      "pass_img":this.data.pass_img,
      "pass":false,
      "al_pass":false,
    },
    success:function(res){
      //成功上传后提示信息
      console.log("上传成功")
      wx.showLoading({
        title: '注册信息成功提交',
        icon:'success',
        duration:1000
      })
      wx.navigateBack({})
    }
  })
},

//上传用户图片信息
uploadImage:function(){
  console.log("上传图片")
  var images=this.data.imgList
  //先添加到这一变量，在最后一个再改变this.data.中的pass_img
  var pass_img=[]
  //对用户点击的图片进行上传
  images.forEach(item=>{
    console.log(item)
    wx.cloud.uploadFile({
      cloudPath:"pass_imgs/"+item.substring(item.length - 20),//上传至云端的路径
      filePath:item,//小程序临时文件路径
      success:res=>{
        //返回文件ID
        console.log(res.fileID)
        pass_img.push(res.fileID)
        console.log(pass_img)
        //获取所有图片在云端的位置后上传到数据库
        if(pass_img.length==images.length){
          this.setData({
            pass_img:pass_img
          })
          console.log(this.data.pass_img)
          this.uploadData()
        }
      },
      fail:console.error
    })
  });
},

//是否同意协议
checkboxChange(){
  this.setData({
    agree:!this.data.agree
  })
  console.log("agree?",this.data.agree)
},

//打开同意协议
openProtocol(){
  wx.navigateTo({
    url: '../../Admin/agreement/agreement',
  })
},

//微信号和手机号关联
associateWechat(){
  this.setData({
    associate:!this.data.associate
  })
  console.log("associate?",this.data.associate)
},
})