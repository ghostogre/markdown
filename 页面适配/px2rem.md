```
cnpm i postcss-px2rem -S
```
配置postcss-px2rem
```
//.postcssrc.js

module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px2rem': {
      remUnit: 37.5 
    }
  }
}
```
安装amfe-flexible
```
cnpm i amfe-flexible -S
```

配置amfe-flexible
```
//.main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'amfe-flexible'
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

默认是将所有的px转换为rem，对于那些不需要转换的如1px border
```
直接写px，编译后会直接转化成rem ---- 除开下面两种情况，其他长度用这个
在px后面添加/*no*/，不会转化px，会原样输出。 --- 一般border需用这个
在px后面添加/*px*/,会根据dpr的不同，生成三套代码。---- 一般字体需用这个
```
编译前
```
.selector {
    width: 150px;
    height: 64px; /*px*/
    font-size: 28px; /*px*/
    border: 1px solid #ddd; /*no*/
}
```
编译后
```
.selector {
    width: 2rem;
    border: 1px solid #ddd;
}
[data-dpr="1"] .selector {
    height: 32px;
    font-size: 14px;
}
[data-dpr="2"] .selector {
    height: 64px;
    font-size: 28px;
}
[data-dpr="3"] .selector {
    height: 96px;
    font-size: 42px;
}
```

