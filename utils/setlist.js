// Created by CuberQAQ
// Setlist.js 2.0
// 相较于上一代，将对象变为类，实现了各种新功能
// 应当兼容上一代
const logger = DeviceRuntimeCore.HmLogger.getLogger('CuberSet')
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT, screenShape } = hmSetting.getDeviceInfo()
//工具函数 回到页面顶上
export function getToPageTop() {
  hmUI.setScrollView(true, px(480), 20, true)
  hmUI.scrollToPage(0, false)
  hmUI.setScrollView(false)
  hmUI.setLayerScrolling(true)
}

// SetTool可以容纳多个SetPage，并统一管理其路由等
//TODO添加page的方法
export class SetTool {
  constructor({ pageArray, mainPageInstance, onExit_func, run_now }) {
    if (pageArray) {
      this.pageArray = pageArray
      pageArray.forEach((page, index) => {
        page.setIndex(index)
        page.setParentTool(this)
      })
    }
    else { this.pageArray = [] }
    //设置主界面
    if (mainPageInstance) { this.mainPageInstance = mainPageInstance } //给定主界面
    else if (pageArray) { this.mainPageInstance = pageArray[0] }//未给定主界面 但给定page数组则以第一个作为主界面
    else { this.mainPageInstance = null }//啥都不给
    //初始化一些属性
    this.nowPageInstance = null
    this.routingStack = [] //路由栈 用数组代替栈
    //退出回调
    if (onExit_func) {
      this.onExit = onExit_func
    }
    else {
      this.onExit = (tool) => {
        console.log('SetTool:error, no onExit Function')
      }
    }
    //立即执行
    if (run_now) {
      this.start()
    }
  }
  getPageByName(name) {
    // this.pageArray.forEach(page => {
    //   console.log("pagename:" + page.name)
    //   if (page.name == name) { console.log("getpagebyname done");return page }
    // });
    let length = this.pageArray.length
    for (let i = 0; i < length; ++i) {
      if (this.pageArray[i].name == name) { console.log("getpagebyname done"); return this.pageArray[i] }
    }
    console.log("return null")
    return null
  }
  getPageByIndex(index) {
    if (index >= 0 && index < this.pageArray.length) {
      return this.pageArray[index]
    }
    // else
    return null
  }
  gotoPageByName(name) {
    this.gotoPageByInstance(this.getPageByName(name))
  }
  gotoPageByIndex(index) {
    this.gotoPageByInstance(this.getPageByIndex(index))
  }
  gotoPageByInstance(instance) {
    //console.log("awa0awa0awa0awa0")
    //原实例入路由栈
    this.routingStack.push(this.nowPageInstance)
    //page对接
    if (this.nowPageInstance) {
      //console.log("awa1awa1awa1awa1")
      this.nowPageInstance.setActive(false)
      this.nowPageInstance = null
    }
    getToPageTop() //回到页面顶部
    this.nowPageInstance = instance
    //console.log("awa2awa2awa2awa2")
    instance.setActive(true)
    console.log("Goto SetPage:" + this.nowPageInstance.name)
  }
  goBackNow() {
    if (this.routingStack.length) { //如果路由栈中有东西 即还有退路
      if (this.nowPageInstance) {
        this.nowPageInstance.setActive(false)
        this.nowPageInstance = null
      }
      getToPageTop()
      this.nowPageInstance = this.routingStack.pop()
      this.nowPageInstance.setActive(true)
    }
    else { //妈的，没退路了
      if (this.nowPageInstance) {
        this.nowPageInstance.setActive(false)
        this.nowPageInstance = null
      }
      this.onExit() //执行退出回调
      hmApp.unregisterGestureEvent() //取消滑动手势注册事件
      hmApp.goBack()
    }

  }
  //开始运行
  start() {
    if (this.mainPageInstance) {
      console.log('SetTool: start() starting setpage')
      this.mainPageInstance.setActive(true)
      this.nowPageInstance = this.mainPageInstance
      console.log('SetTool: start() started setpage')
    }
    //注册手势监听 一个 JsApp 重复注册会导致上一个注册的回调失效
    hmApp.registerGestureEvent(event => {
      switch (event) {
        case hmApp.gesture.RIGHT: //关闭
          this.goBackNow()
          break
        // case hmApp.gesture.RIGHT: //TODO考虑做个前进页面
        //   msg = 'right'
        //   break
        default:
          break
      }
      //跳过默认手势
      return true
    })
  }
  //插入新的page index为插入后新的page的index 
  //若不提供index则相当于addPage()直接在末尾添加
  //返回插入后的index 为-1则表示失败
  insertPage(page, index) {
    if (!page) { return -1 }
    if ((!index && index != 0) || index >= this.pageArray.length) { return this.addPage(page) }
    if (index < 0) { return -1 } //失败
    //在数组中插入page
    this.pageArray.splice(index, 0, page)
    pageArray.forEach((page, index) => {
      page.setIndex(index)
    })
    page.setParentTool(this)
  }
  //添加新的Page，返回添加后的index
  addPage(page) {
    let result = this.pageArray.push(page)
    page.setIndex(result)
    page.setParentPage(this)
    return page
  }
}

// SetPage可以容纳SetItem
export class SetPage {
  constructor({ index, name, itemArray, item_item_space, end_space }) {
    this.index = index
    this.name = name
    if (itemArray) {
      this.itemArray = itemArray
      itemArray.forEach((item, index) => {
        item.setIndex(index)
        item.setParentPage(this)
      })
    }
    else { this.itemArray = [] }
    this.active = false //是否活动 即是否在前台显示
    //item之间的距离
    if (item_item_space) { this.item_item_space = item_item_space }
    else { this.item_item_space = px(25) }
    //页尾预留距离
    if (end_space) { this.end_space = end_space }
    else { this.end_space = px(180) }
    //页尾预留距离的占位控件
    this.end_space_widget = null
    //绘制后页面的总长
    this.pageHeight = -1 //-1为未知
    //当前用户停留位置的y坐标 可用于goback后恢复所在位置
    this.userRemainY = 0
    //所属SetTool
    this.parentTool = null
  }
  //使用类似第一代的shell来创建 基于SetItemMaker
  //shell是对象 包含name:String,items:Array两个必选属性
  //           和item_item_place:int,end_space:int两个可选属性
  //items是对象数组
  //其中的对象的属性:
  //  name  :String 作为唯一标识名
  //  type  :SetItemMaker.Item枚举
  //  style :SetItemMaker.Style枚举
  //  data  :相关选项的属性和方法设置
  //后三项看SetItemMaker
  static shellCreate(shell) {
    let itemArray = [] //保存了规范化后的SetItem实例
    shell.items.forEach(rawItem => {
      itemArray.push(
        new SetItemMaker({
          ...rawItem,
          enable: false,
        })
      )
    })
    let resultPage = new SetPage({
      name: shell.name,
      itemArray,
      item_item_space: shell.item_item_space,
      end_space: shell.end_space,
    })
    return resultPage
  }
  setIndex(index) { this.index = index }
  getIndex() { return this.index }
  setParentTool(tool) {
    this.parentTool = tool
  }
  getParentTool() { return this.parentTool }
  setName(name) {
    this.name = name
  }
  getName() { return this.name }
  setActive(active) {
    //console.log("qwq1")
    this.itemArray.forEach(item => {
      item.setActive(active)
    });
    //console.log("qwq2")
    this.active = active
    if (active) { this.show() } //绘制所有组件
    else { ; this.clear() }
    console.log('SetPage ' + this.name + ".setActive(" + active + ") Done")
  }
  getActive() { return this.active }
  getItemByName(name) {
    let res = null
    this.itemArray.forEach(item => {
      if (item.name == name) { console.log('getitembyname done'); res = item; return }
    });
    if (res) { return res }
    console.log('getitembyname failed')
    return null
  }
  getItemByIndex(index) {
    if (index >= 0 && index < this.itemArray.length) {
      return this.itemArray[index]
    }
    // else
    return null
  }
  show() { //可以考虑加个index来局部重绘制
    let arrayLength = this.itemArray.length
    this.pageHeight = screenShape ? 0 : px(55) //作为当前item的y坐标偏移
    for (let i = 0; i < arrayLength; ++i) {
      //console.log("page show() 1")
      //给定当前item的y坐标偏移
      this.itemArray[i].show(this.pageHeight)

      //console.log("page show() 2")
      //获取当前item的总高，累加进pageHeight
      this.pageHeight += this.itemArray[i].getTotalHeight()
      //console.log("totalheight+="+this.itemArray[i].getTotalHeight()+"  now:"+this.pageHeight)
      //console.log("page show() 3")
      //item之间的距离
      this.pageHeight += this.item_item_space
      //console.log("page show() 4")
    }
    if (arrayLength > 0) {
      //把最后一个item多加的item_item_space减回去
      this.pageHeight -= this.item_item_space
    }
    //console.log("page show() 5")
    //页尾预留距离 并使用text控件来占位置
    if (!this.end_space_widget) {
      this.end_space_widget = hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: this.pageHeight,
        w: px(480),
        h: this.end_space,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text: "SetTool by CuberQAQ",
        text_size: px(10),
        color: 0x050505
      })
    }
    //console.log("page show() 6")

    this.pageHeight += this.end_space
  }
  clear() {
    //console.log("qaq1")
    this.itemArray.forEach(item => {
      //console.log("qaq1a")
      item.clear()
    })
    //console.log("qaq2")
    if (this.end_space_widget) {
      hmUI.deleteWidget(this.end_space_widget)
      this.end_space_widget = null
    }
    //console.log("qaq3")
  }
  //插入新的item index为插入后新的item的index 
  //若不提供index则相当于addItem()直接在末尾添加
  //返回插入后的index 为-1则表示失败
  insertItem(item, index) {
    if (!item) { return -1 }
    if ((!index && index != 0) || index >= this.itemArray.length) { return this.addItem(item) }
    if (index < 0) { return -1 } //失败
    //在数组中插入item
    this.itemArray.splice(index, 0, item)
    itemArray.forEach((item, index) => {
      item.setIndex(index)
    })
    item.setParentPage(this)
    //重置pageHeight属性为未知
    this.pageHeight = -1
    //若该page已处于活动状态 则重新绘制
    if (this.active) {
      item.setActive(true)
      this.show()
    }
  }
  //添加新的item 返回所在的index
  addItem(item) {
    let result = this.itemArray.push(item)
    if (this.active) {
      item.setActive(true)
      this.show()
    }
    item.setIndex(result)
    item.setParentPage(this)
    return result
  }
}

// SetItem是单个SetPage的项目 显示时会自动堆叠
export class SetItem {
  constructor({ name, index, enable }) {
    this.name = name
    this.index = index == undefined ? -1 : index
    //是否启用 比如开关禁用后变暗且无法更改
    if (enable == undefined) { this.enable = true }
    else { this.enable = enable }
    //是否活动状态 即是否在前台显示
    this.active = false
    //y坐标偏移
    this.offsetY = 0
    //所属page实例
    this.parentPage = null
  }
  setParentPage(page) { this.parentPage = page }
  /**
   * @returns {SetPage} 宿主界面
   */
  getParentPage() { return this.parentPage }
  setIndex(index) {
    this.index = index
  }
  getIndex() { return this.index }
  setName(name) {
    this.name = name
  }
  getName() { return this.name }
  setEnable(enable) {
    // TODO 子类应该实现
    console.log("Error: SetItem.setEnable() haven't been implement")
    this.enable = enable
  }
  getEnable() { return this.enable }
  setActive(active) {
    this.active = active
  }
  getActive() { return this.active }
  //正式绘制
  show(offsetY) {
    // TODO 子类应该实现
    console.log("Error: SetItem.show() haven't been implement")
  }
  //清除绘制
  clear() {
    // TODO 子类应该实现
    console.log("Error: SetItem.clear() haven't been implement")
  }
  //获得item的总高度
  getTotalHeight() {
    // TODO 子类应该实现
    console.log("Error: SetItem.getTotalHeight() haven't been implement")
    return 0
  }
}

// SetItemMaker 可以通过内置样式生成一个SetItem子类的实例
export class SetItemMaker extends SetItem {
  constructor({
    type, //类型，详见枚举Types
    style, //主题，详见枚举Styles
    data, //Object 小组件的具体内容，详见Types的注释
    name, //控件的唯一名称,
    enable, //是否启用控件
  }) {
    super({ name, enable })
    this.type = type
    this.style = style
    this.data = data
    this.widgets = {} //保存显示控件实例的数组
    this.totalHeight = 0
    this.onDeletes = []
  }
  setEnable(enable) {

  }
  show(offsetY) {
    //console.log("item_maker show() 1")
    if (this.widgets.length) { //若已经显示
      this.clear()
    }
    //console.log("item_maker show() 2")
    this.totalHeight = 0
    switch (this.style) {
      case SetItemMaker.Styles.HEAD: {
        let height = 0 // 总高
        let icon = this.type & SetItemMaker.Types.ICON
        let text = this.type & SetItemMaker.Types.TEXT
        let button = this.type & SetItemMaker.Types.BUTTON
        if (!icon && text && !button) { // 只有文字
          height = px(100)
          console.log("Only Text")
          this.widgets["text"] = (
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: px(90),
              y: px(0) + offsetY,
              w: px(300),
              h: px(100),
              text: this.data.text ? this.data.text : 'Text',
              text_size: px(45),
              color: 0xffffff,
              align_h: hmUI.align.CENTER_H,
              align_v: hmUI.align.CENTER_V,
            })
          )
          console.log("Only Text2")
          this.totalHeight = px(100) + px(100)//总高 100分隔
        }
        else if (icon && !text && !button) { //只有图片
          console.log("Only ICON")
          let height = px(100)
          if (this.data.icon.h > height) { height = this.data.icon.h }
          this.widgets["icon"] = (
            hmUI.createWidget(hmUI.widget.IMG, {
              src: this.data.icon.src,
              x: (DEVICE_WIDTH - this.data.icon.w) / 2,
              y: (height - this.data.icon.h) / 2 + offsetY,
              w: this.data.icon.w,
              h: this.data.icon.h,
            })
          )
          this.totalHeight = height //总高
        }
        else if (icon && text && !button) { //图标与文字
          console.log("Icon and Text")
          let height = this.data.icon.h > px(100) ? this.data.icon.h : px(100)
          let width = 0 //后面计算
          let textWidth = (hmUI.getTextLayout(this.data.text.text, {
            text_size: px(50),
            text_width: 0, //表示单行
            wrapped: 0, //表示不换行
          })).width
          width = this.data.icon.w + textWidth + px(5) //分开icon和text
          this.widgets["icon"] = (
            //创建图片控件
            hmUI.createWidget(hmUI.widget.IMG, {
              src: this.data.icon.src,
              x: (DEVICE_WIDTH - width) / 2,
              y: (height - this.data.icon.h) / 2 + offsetY,
              w: this.data.icon.w,
              h: this.data.icon.h,
            })
          )
          this.widgets["text"] = (
            //创建文字控件
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: (DEVICE_WIDTH - width) / 2 + this.data.icon.w + px(5), //5是分隔
              y: 0 + offsetY,
              w: textWidth,
              h: height,
              text: this.data.text ? this.data.text : 'Text',
              text_size: px(50),
              color: 0xffffff,
              align_h: hmUI.align.CENTER_H,
              align_v: hmUI.align.CENTER_V,
            })
          )
          this.totalHeight = height + px(30) //总高 30分隔
        }
        else if (!icon && text && button) { //文字与按钮
          let height = this.data.button.h > px(100) ? this.data.button.h : px(100)
          let width = 0 //后面计算
          let textWidth = (hmUI.getTextLayout(this.data.text.text, {
            text_size: px(50),
            text_width: 0, //表示单行
            wrapped: 0, //表示不换行
          })).width
          width = textWidth + px(5)/*分隔*/ + this.data.button.w
          this.widgets["text"] = (
            //创建文字控件
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: (DEVICE_WIDTH - width) / 2,
              y: 0 + offsetY,
              w: textWidth,
              h: height,
              text: this.data.text.text ? this.data.text.text : 'Text',
              text_size: px(50),
              color: 0xffffff,
              align_h: hmUI.align.CENTER_H,
              align_v: hmUI.align.CENTER_V,
            })
          )
          //设置data中button的部分属性
          this.data.button.x = (DEVICE_WIDTH - width) / 2 + textWidth + px(5)/*分隔*/
          this.data.button.y = 0 + offsetY
          // if(!this.data.button.text) {this.data.button.text = 'Text'}
          this.widgets["button"] = (
            //创建按钮控件
            hmUI.createWidget(hmUI.widget.TEXT, {
              ...this.data.button
            })
          )
          this.totalHeight = height + px(30)//总高 30分
        }
        this.totalHeight = height
      }
        break;
      case SetItemMaker.Styles.BODY: {
        let icon = this.type & SetItemMaker.Types.ICON
        let text = this.type & SetItemMaker.Types.TEXT
        let subtext = this.type & SetItemMaker.Types.SUBTEXT

        console.log("item_maker icon:" + icon)
        console.log("item_maker text:" + text)
        console.log("item_maker subtext:" + subtext)
        console.log("type:" + this.type)
        let height = px(100)
        //console.log("item_maker show() 10")
        //ICON图标
        if (icon) {

          console.log("item_maker show() icon")
          if (this.data.icon.h > px(100)) {
            height = this.data.icon.h
          }
          this.widgets["icon"] = (
            //创建图片控件
            hmUI.createWidget(hmUI.widget.IMG, {
              src: this.data.icon.src,
              x: px(30),
              y: (height - this.data.icon.h) / 2 + offsetY,
              w: this.data.icon.w,
              h: this.data.icon.h,
            })
          )
        }

        // 2022/12/29 更新：检测subtext的行数，来判断右侧单选到底是和主副文字并列(<=3行)还是副文字和主文字+右侧单选并列
        var bSubtextAlone = false
        var subtextHeight = 0, subtextWidth = px(300)
        if (subtext) {
          subtextHeight = (hmUI.getTextLayout(this.data.subtext.text, {
            text_size: px(30),
            text_width: px(300), //表示单行
            wrapped: 1, //表示换行
          })).height
          if (height >= 150) { // 超过三行
            bSubtextAlone = true
          }
        }

        //TEXT大文字
        if (text) {

          console.log("item_maker show() text")

          //console.log("fuck 0")
          let textWidth = px(300) - ((icon) ? this.data.icon.w + px(10) : 0)

          //console.log("fuck 0.5")
          let textHeight = (hmUI.getTextLayout(this.data.text.text, {
            text_size: px(40),
            text_width: textWidth, //表示单行
            wrapped: 1, //表示换行
          })).height
          //console.log("!!!!!!height" + textHeight)
          //console.log("!!!!!!width" + textWidth)

          if (textHeight > height) { height = textHeight }
          //console.log("fuck 2")

          this.widgets["text"] = (
            //创建文字控件
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: px(30) + (icon ? this.data.icon.w + px(10) : 0),
              y: 0 + offsetY,
              w: textWidth,
              h: height,
              text: this.data.text.text ? this.data.text.text : 'Text',
              text_size: px(40),
              color: 0xffffff,
              align_h: hmUI.align.LEFT,
              align_v: hmUI.align.CENTER_V,
            })
          )
          //console.log("fuck 3")

        }
        //SUBTEXT小文字
        if (subtext) {
          if (bSubtextAlone) {
            let size = hmUI.getTextLayout(this.data.subtext.text, {
              text_size: px(30),
              text_width: px(420), //表示单行
              wrapped: 1, //表示换行
            })
            subtextHeight = size.height
            subtextWidth = px(420)
          }
          this.widgets["subtext"] = (
            //添加小文字
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: px(30),
              y: height + offsetY, //接在原文字的下面
              w: subtextWidth,
              h: subtextHeight,
              text: this.data.subtext.text ? this.data.subtext.text : 'Text',
              text_size: px(30),
              color: 0x888888,
              align_h: hmUI.align.LEFT,
              align_v: hmUI.align.CENTER_V,
              text_style: hmUI.text_style.CHAR_WRAP,
            })
          )
          height += subtextHeight
        }
        //右侧单选
        if (this.type & SetItemMaker.Types.ARROW) { //箭头跳转
          this.widgets["arrow"] = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: px(260),//TODO宽度要缩小30
            y: (height - px(100)) / 2 + offsetY + px(16),// bSubtextAlone?(offsetY + px(16)):((height - px(100)) / 2 + offsetY),
            w: px(190),
            h: px(100),
            press_src: 'image/enter.png',
            normal_src: 'image/enter.png',
            click_func: () => {
              this.data.arrow.click_func(this)
            },
          })
        }
        else if (this.type & SetItemMaker.Types.SWITCH) { //开关
          this.widgets["switch"] = hmUI.createWidget(hmUI.widget.SLIDE_SWITCH, {
            x: px(350),
            y: bSubtextAlone ? ((px(100) - px(64)) / 2 + offsetY + 5) : ((height - px(64)) / 2 + offsetY),
            w: px(100),
            h: px(64),
            un_select_bg: "image/false.png",
            select_bg: "image/true.png",
            slide_src: "image/button.png",
            slide_un_select_x: px(8),
            slide_select_x: px(44),
            checked: this.data.switch.get_func(), //获取初始状态
            checked_change_func: (widget, bool) => {
              this.data.switch.click_func(bool, this)
            }
          })
        }
        else if (this.type & SetItemMaker.Types.COLOR) { //色块//TODO全部检查
          let buttonColor = this.data.color.get_func()//获取初始状态
          this.widgets["color"] = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: px(390),
            y: bSubtextAlone ? ((px(100) - px(60)) / 2 + offsetY) : ((height - px(60)) / 2 + offsetY),
            w: px(60),
            h: px(60),
            text: " ",
            normal_color: buttonColor,
            press_color: buttonColor,
            radius: px(10),
            click_func: () => {
              this.data.color.click_func(this)
            }
          })
          this.widgets["color"].addEventListener(hmUI.event.CLICK_DOWN, function (info) {
            //控件注册事件监听
            console.log(info.x)
          })
        }
        else if (this.type & SetItemMaker.Types.NUM_INT) { //数字选择器
          // //灰色底盘
          // this.widgets["numRect"] = hmUI.createWidget(hmUI.widget.FILL_RECT, {

          // })
        }
        else if (this.type & SetItemMaker.Types.RADIO_BOXES) { //单选框集合
          this.onDeletes.push(() => {
            let length = this.data.radio_boxes.items.length
            for (let i = 0; i < length; ++i) {
              hmUI.deleteWidget(this.widgets["text" + 1])
              this.widgets["text" + 1] = undefined
              // this.widgets["stateButton" + 1].setProperty(hmUI.prop.VISIBLE, false)
              // this.widgets["stateButton" + 1] = undefined
            }
            if(this.widgets["radioGroup"]){this.widgets["radioGroup"].setProperty(hmUI.prop.VISIBLE, false)}
            this.widgets["radioGroup"] = undefined
          })
          let length = this.data.radio_boxes.items.length
          //初始化要state_button实例 得先准备获取
          let initButtonIndex = this.data.radio_boxes.get_func()
          let initButtomInstance = null
          let tempButtonInstance = null //临时接受每次create的state_button实例
          // TODO bug预知：在group和button释放的时候面临顺序问题，考虑要不要亲自释放button
          //添加radioGroup
          let offsetY2 = 0, radioHeight = px(100)/**每个选项的高度 */
          //this.widgets["radioGroup"] = 
          let radioGroup = hmUI.createWidget(hmUI.widget.RADIO_GROUP, {
            x: px(260),
            y: offsetY,//offsetY + offsetY2 + (radioHeight - 40/*TODO 多机型适配注意*/) / 2,
            w: px(190),
            h: radioHeight * length,
            select_src: "image/radioSelect.png",
            unselect_src: "image/radioUnselect.png",
            check_func: (group, index, checked) => {
              if (checked) {
                this.data.radio_boxes.click_func(index, this)
              }
            }
          })


          //循环添加文字和state_button
          for (let i = 0; i < length; ++i) {

            //添加文字
            this.widgets["text" + i] =
              hmUI.createWidget(hmUI.widget.TEXT, {
                x: px(30),
                y: offsetY + offsetY2,
                w: px(300),
                h: radioHeight,
                text: this.data.radio_boxes.items[i],
                text_size: px(40),
                color: 0xffffff,
                align_h: hmUI.align.LEFT,
                align_v: hmUI.align.CENTER_V,
              })
            //添加state_button
            //TODO这里不知道要不要弄进widget里面哦
              tempButtonInstance = radioGroup.createWidget(hmUI.widget.STATE_BUTTON, {
                x: 0,
                y: offsetY2 + (height - px(100)) / 2, 
                w: px(190),
                h: px(100), 
              })
              logger.debug('awa')
            
            //this.widgets["stateButton" + i] = tempButtonInstance
            //判断是不是初始化用到的控件
            if (i == initButtonIndex) { initButtomInstance = tempButtonInstance }
            //offsetY2自增
            offsetY2 += radioHeight
          }
          //radiogroup初始化操作
          radioGroup.setProperty(hmUI.prop.INIT, initButtomInstance)
          //修改height 为下一个控件做好准备
          height = offsetY2 + radioHeight
          this.widgets["radioGroup"] = radioGroup
          //logger.debug("radioGroup:"+(this.widgets["radioGroup"]==undefined?"f":"t"))
        }
        else if (this.type & SetItemMaker.Types.BUTTON) { //按钮
          // y坐标自动计算，无法指定，可以指定x坐标
          if (!this.data.button.h) { this.data.button.h = px(80) }
          if (!this.data.button.w) { this.data.button.w = px(250) }
          if (!this.data.button.x) { this.data.button.x = (px(420) - this.data.button.w) / 2 + px(30) }
          this.data.button.y = (height - this.data.button.h) / 2 + offsetY
          if (!this.data.button.radius) { this.data.button.radius = px(40) }
          if (this.data.button.h > height) { height = this.data.button.h }
          this.widgets["button"] = hmUI.createWidget(hmUI.widget.BUTTON, {
            ...this.data.button,
          })
        }



        this.totalHeight = height
      }
        break;
      default:
        console.log("setlist.js: unknown style type for SetItemMaker")
        break;
    }
  }
  clear() {
    //console.log("qaqa1") 
    // this.widgets.forEach(widget => {
    //   console.log("qaqa1a")
    //   hmUI.deleteWidget(widget) 
    // })
    for (let i = 0; i < this.onDeletes.length; ++i) {
      (this.onDeletes[i])()
    }
    for (let key in this.widgets) {
      console.log("key:" + key)
      //console.log("qaqa111") 
      hmUI.deleteWidget(this.widgets[key]);
    }
    //console.log("qaqa1") 

    this.widgets = {}
    //console.log("qaqa1") 
  }
  getTotalHeight() {
    //TODO目前只能获取绘制后的
    return this.totalHeight
  }
}
SetItemMaker.Types = {
  //下面的可以同时选
  ICON: 0x1,    //00000001  图标，在左侧显示一个图标 
  //属性:   src路径（以开发文档IMG的为准）
  //        w宽度
  //        h高度
  TEXT: 0x2,    //00000010  大文字，显示在图标左侧的白色大标题文字
  //属性:   text文字的内容
  SUBTEXT: 0x4,    //00000100  小文字，显示在小文字下方 默认为灰色
  //属性:   text文字的内容
  //下面的只可选一个
  ARROW: 0x8,    //00001000  一个能点按的小箭头，
  //属性:   click_func(item) item为当前item的实例
  SWITCH: 0x10,   //00010000  开关
  //属性:   get_func() 要求返回一个布尔值作为开关初始状态
  //        click_func(checked, item) checked为布尔值，item为当前item的实例
  NUM_INT: 0x20,   //00100000  数值调节器，直接呈现为控件而无需跳转界面
  //属性:   max数值的最大值
  //        min数值的最小值
  //        get_func() 要求返回一个整数值作为默认状态
  //        click_func(value,item) value为改变后的数值 item不多解释
  COLOR: 0x40,   //01000000  色块显示
  //属性:   get_func() 要求返回一个8位十六进制数作为颜色初始值
  //        click_func(item) item为当前item的实例
  BUTTON: 0x80,   //10000000  显示按钮
  //具体属性详见zepp开发文档中BUTTON的用法，xy可以不填 会自动获取
  //如果不填w,h 会自动获取
  RADIO_BOXES: 0x0100 //注意！这里不用额外选择TEXT
  //00000001 00000000 单选按钮组
  //属性：  items字符串数组 每一项都代表一个选项
  //        get_func() 返回默认选项的索引
  //        click_func(index, item) index为当前索引，item为当前item的实例

}
SetItemMaker.Styles = {
  HEAD: 0x1,    //00000001  标题，会居中、总高度加大(只支持ICON,TEXT,BUTTON)
  BODY: 0x2,    //00000010  内容，文字图标靠左，控件靠右
}