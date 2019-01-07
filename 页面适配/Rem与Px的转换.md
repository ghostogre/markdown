假设就使用浏览器默认的字号`16px`

如果你要设置一个不同的值，那么需要在根元素`<html>`中定义，为了方便计算，时常将在`<html>`元素中设置font-size值为62.5%

    html {
      font-size: 62.5%; /* 10 ÷ 16 × 100% = 62.5% */
    }

相当于在`<html>`中设置font-size为10px
    
## 利用sass计算rem

通过Sass的@function方法来实现。

    $browser-default-font-size: 16px !default; // 变量的值可以根据自己需求定义

    html {
      font-size: $browser-default-font-size;
    }

    @function pxTorem($px){
      //$px为需要转换的字号
      @return $px / $browser-default-font-size * 1rem;
    }

定义好@function之后，实际使用中就简单多了：

    //SCSS
    html {
      font-size: $browser-default-font-size;
    }
    
    .header {
      font-size: pxTorem(12px);
    }
    
    //CSS
    html {
      font-size: 16px;
    }
    
    .header {
      font-size: 0.75rem;
    }

## Sass中mixin实现rem

除了使用@function实现px转换成rem之外，还可以使用Sass中的mixin实现px转rem功能。

font-size是样式中常见的属性之一，我们先来看一个简单mixin，用来实现font-size的px转rem：

    @mixin font-size($target){
      font-size: $target;
      font-size: ($target / $browser-default-font-size) * 1rem;
    }

为了实现多个属性能设置多值，就需要对mixin做出功能扩展：

    @mixin remCalc($property, $values...) {
      $max: length($values);//返回$values列表的长度值
      $pxValues: '';
      $remValues: '';
      @for $i from 1 through $max {
        $value: strip-units(nth($values, $i));//返回$values列表中的第$i个值，并将单位值去掉
        $browser-default-font-size: strip-units($browser-default-font-size);
        $pxValues: #{$pxValues + $value * $browser-default-font-size}px;
        
        @if $i < $max {
          $pxValues: #{$pxValues + " "};
        }
      }
      
      @for $i from 1 through $max {
        $value: strip-units(nth($values, $i));
        $remValues: #{$remValues + $value}rem;
        @if $i < $max {
          $remValues: #{$remValues + " "};
        }
      }
      
      #{$property}: $pxValues;
      #{$property}: $remValues;
    }



