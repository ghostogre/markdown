这也是淘宝使用的方案，根据屏幕宽度设定 rem 值，需要适配的元素都使用 rem 为单位，不需要适配的元素还是使用 px 为单位。

> 实现原理

根据rem将页面放大dpr倍, 然后viewport设置为1/dpr.

    1. 如iphone6 plus的dpr为3, 则页面整体放大3倍, 1px(css单位)在plus下默认为3px(物理像素)
    2. 然后viewport设置为1/3, 这样页面整体缩回原始大小. 从而实现高清。

这样整个网页在设备内显示时的页面宽度就会等于设备逻辑像素大小，也就是device-width。这个device-width的计算公式为：

设备的物理分辨率/(devicePixelRatio * scale)，在scale为1的情况下，device-width = 设备的物理分辨率/devicePixelRatio 。

