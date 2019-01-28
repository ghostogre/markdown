Canvas是 HTML5 新增的，一个可以使用脚本(通常为JavaScript)在其中绘制图像的 HTML 元素。Canvas是由HTML代码配合高度和宽度属性而定义出的可绘制区域。

### **检查canvas兼容性：**

```
<canvas id="myCanvas" width="400" height="200">
  你的浏览器不支持canvas!
</canvas>
```
如果浏览器不支持这个API，则就会显示`<canvas>`标签中间的文字

```
var canvas = document.getElementById('test-canvas');
if (canvas.getContext) {
    console.log('你的浏览器支持Canvas!');
} else {
    console.log('你的浏览器不支持Canvas!');
}
```
每个canvas节点都有一个对应的context对象（上下文对象），Canvas API定义在这个context对象上面，所以需要获取这个对象，方法是使用getContext方法。

getContext方法指定参数2d，表示该canvas节点用于生成2D图案（即平面图案）。如果参数是webgl，就表示用于生成3D图像（即立体图案），这部分实际上单独叫做`WebGL API`。

    canvas画布提供了一个用来作图的平面空间，该空间的每个点都有自己的坐标，x表示横坐标，y表示竖坐标。原点(0, 0)位于图像左上角，x轴的正向是原点向右，y轴的正向是原点向下

### **绘制路径**

`beginPath`方法表示开始绘制路径，`moveTo(x, y)`方法设置线段的起点，`lineTo(x, y)`方法设置线段的终点，`stroke`方法用来给透明的线段着色。

```
ctx.beginPath(); // 开始路径绘制
ctx.moveTo(20, 20); // 设置路径起点，坐标为(20,20)
ctx.lineTo(200, 20); // 绘制一条到(200,20)的直线
ctx.lineWidth = 1.0; // 设置线宽
ctx.strokeStyle = '#CC0000'; // 设置线的颜色
ctx.stroke(); // 进行线的着色，这时整条线才变得可见
```

moveto和lineto方法可以多次使用。最后，还可以使用closePath方法，自动绘制一条当前点到起点的直线，形成一个封闭图形，省却使用一次lineto方法。

### **绘制矩形**

`fillRect(x, y, width, height)`方法用来绘制矩形，它的四个参数分别为矩形左上角顶点的x坐标、y坐标，以及矩形的宽和高。`fillStyle属性`用来设置矩形的填充色。

`strokeRect`方法与fillRect类似，用来绘制空心矩形。

`clearRect`方法用来清除某个矩形区域的内容。

### **绘制文本**

`fillText(string, x, y)` 用来绘制文本，它的三个参数分别为文本内容、起点的x坐标、y坐标。使用之前，需用font设置字体、大小、样式（写法类似与CSS的font属性）。与此类似的还有strokeText方法，用来添加空心字。

    // 设置字体
    ctx.font = "Bold 20px Arial"; 
    // 设置对齐方式
    ctx.textAlign = "left";
    // 设置填充颜色
    ctx.fillStyle = "#008600"; 
    // 设置字体内容，以及在画布上的位置
    ctx.fillText("Hello!", 10, 50); 
    // 绘制空心字
    ctx.strokeText("Hello!", 10, 100); 

fillText方法不支持文本断行，即所有文本出现在一行内。所以，如果要生成多行文本，只有调用多次fillText方法。

### **绘制圆形和扇形**

`ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);`方法用来绘制扇形

arc方法的x和y参数是圆心坐标，radius是半径，startAngle和endAngle则是扇形的起始角度和终止角度（以弧度表示），anticlockwise表示做图时应该逆时针画（true）还是顺时针画（false）。

下面是如何绘制实心的圆形。

    ctx.beginPath(); 
    ctx.arc(60, 60, 50, 0, Math.PI*2, true); 
    ctx.fillStyle = "#000000"; 
    ctx.fill();

复制代码绘制空心圆形的例子。

    ctx.beginPath(); 
    ctx.arc(60, 60, 50, 0, Math.PI*2, true); 
    ctx.lineWidth = 1.0; 
    ctx.strokeStyle = "#000"; 
    ctx.stroke();

### **设置渐变色**

`createLinearGradient`方法用来设置渐变色。方法的参数是(x1, y1, x2, y2)，其中x1和y1是起点坐标，x2和y2是终点坐标。通过不同的坐标值，可以生成从上至下、从左到右的渐变等等。

```
var myGradient = ctx.createLinearGradient(0, 0, 0, 160); 
myGradient.addColorStop(0, "#BABABA"); 
myGradient.addColorStop(1, "#636363");

ctx.fillStyle = myGradient;
ctx.fillRect(10,10,200,100);
```

### **设置阴影**

    ctx.shadowOffsetX = 10; // 设置水平位移
    ctx.shadowOffsetY = 10; // 设置垂直位移
    ctx.shadowBlur = 5; // 设置模糊度
    ctx.shadowColor = "rgba(0,0,0,0.5)"; // 设置阴影颜色

    ctx.fillStyle = "#CC0000"; 
    ctx.fillRect(10,10,200,100);

## **图像处理方法**

Canvas API 允许将图像文件插入画布，做法是读取图片后，使用`drawImage`方法在画布内进行重绘。

```
var img = new Image();
img.src = 'image.png';
ctx.drawImage(img, 0, 0); // 设置对应的图像对象，以及它在画布上的位置
```

由于图像的载入需要时间，drawImage方法只能在图像完全载入后才能调用:

```
var image = new Image();

image.onload = function() {
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext('2d').drawImage(image, 0, 0);
  // 插入页面底部
  document.body.appendChild(image);
  return canvas;
}

image.src = 'image.png';
```

### **getImageData方法，putImageData方法**

`getImageData`方法可以用来读取Canvas的内容，返回一个对象，包含了每个像素的信息。

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

imageData对象有一个data属性，它的值是一个一维数组。该数组的值，依次是每个像素的红、绿、蓝、alpha通道值，因此该数组的长度等于 图像的像素宽度 x 图像的像素高度 x 4，每个值的范围是0–255。这个数组不仅可读，而且可写，因此通过操作这个数组的值，就可以达到操作图像的目的。修改这个数组以后，使用putImageData方法将数组内容重新绘制在Canvas上。

    context.putImageData(imageData, 0, 0);

### **toDataURL方法**

对图像数据做出修改以后，可以使用toDataURL方法，将Canvas数据重新转化成一般的图像文件形式。

    function convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL('image/png');
        return image;
    }

### **save方法，restore方法**

save方法用于保存上下文环境，restore方法用于恢复到上一次保存的上下文环境。

## **动画**

利用JavaScript，可以在canvas元素上很容易地产生动画效果。

## **灰度效果**

灰度图就是取红、绿、蓝三个像素值的算术平均值，这实际上将图像转成了黑白形式。假定d[i]是像素数组中一个象素的红色值，则d[i+1]为绿色值，d[i+2]为蓝色值，d[i+3]就是alpha通道值。转成灰度的算法，就是将红、绿、蓝三个值相加后除以3，再将结果写回数组。

## **复古效果**

复古效果则是将红、绿、蓝三个像素，分别取这三个值的某种加权平均值，使得图像有一种古旧的效果。

## **红色蒙版**

指的是让图像呈现一种偏红的效果。算法是将红色通道设为红、绿、蓝三个值的平均值，而将绿色通道和蓝色通道都设为0。

## **亮度效果**

亮度效果是指让图像变得更亮或更暗。算法将红色通道、绿色通道、蓝色通道，同时加上一个正值或负值。

## **反转效果**

是指图片呈现一种色彩颠倒的效果。算法为红、绿、蓝通道都取各自的相反值（255-原值）。



> https://www.cnblogs.com/mopagunda/p/5622911.html
























