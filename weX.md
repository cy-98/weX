## weX

小程序的状态管理（简单）

​      						|-------------|

​     	      			   |    state   |

​		      				|-------------|

​	        ↙ ↗	         	 ↓↑	 	  	↖↘

（ `page`)                   (`page`)               (`page`)  



#### 构建流程:

- 扩展page对象
  - 添加了对`state`的代理   `this.$state[key]`
  - 可以设置`watch` `this.$watch({ ... })`
  - 提取全局状态`state` ,`this.$fetch('key')`
    - 会提交当前页面作为一个等待被更新的`page`
  - 更新其他页面的状态  `this.$commit({ ... })`
    - 其他页面的更新会放在会被异步地更新

#### 使用流程：

```js
import axios from 'xxx'

App({
	onLoad: function(){
		mount({
			state: { motto: 'breeze' },
			custom: {
				$axios: axios
			}
		})
	}
})
```



```js

this.$state[key]  // 简单获取state中的值

// fetch 只会提交当前page作为待更新项，返回值传给回调函数
this.$fetch('motto'， (state)=>{ this.$commit(state) })
this.$fetch(['version', 'userId']) // 回调会操作保存多个结果的数组

this.$watch({
  motto : ()=>{
    console.log(1)
  }
})

this.$commit({ userType: 1 }) // 视图变化响应在此page或者其他page中
															// 其他页面的更新会放在队列里异步更新 
```



注意： `this.$get`用来提交依赖

​			`this.$commit` 应该只用来改变依赖而不提交





