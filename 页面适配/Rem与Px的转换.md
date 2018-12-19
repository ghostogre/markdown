假设就使用浏览器默认的字号`16px`

如果你要设置一个不同的值，那么需要在根元素`<html>`中定义，为了方便计算，时常将在`<html>`元素中设置font-size值为62.5%

    html {
      font-size: 62.5%; /* 10 ÷ 16 × 100% = 62.5% */
    }

相当于在`<html>`中设置font-size为10px
    
## 利用sass计算rem

通过Sass的@function方法来实现。

