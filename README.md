scratch-tickets
===============

scratch tickets(刮刮乐)

###配置
  - @param Element // element, 内容节点
  - @param Object // options
    - @width Int // 宽度
    - @height Int // 高度
    - @text Object // 文本配置
      - @size Int // 文本大小
      - @content String // 文本内容
    - @area Object // 刮刮乐主体区域配置
      - @width Int // 主体宽度
      - @height Int // 主体高度
      - @x Int // 主体横向位移
      - @y Int // 主体纵向位移
    - @scratchSize Int // 刮的触点大小
    - @callback Function // 回调

###例子
```js
    scratchTickets(document.getElementById('J_scratchTickets'), {  
      width: 410,  
      height: 210,  
      text: {  
        size: 30,  
        content: '明天再试一次吧,亲'  
      },  
      //url: 'tumblr_mz3jdlGmgl1qbfo7so1_1280.jpg',  
      area: {  
        width: 330,  
        height: 30,  
        x: 80,  
        y: 90  
      },  
      scratchSize: 16,  
      callback: function(){  
        console.log('ok');  
      }  
    });  
```
