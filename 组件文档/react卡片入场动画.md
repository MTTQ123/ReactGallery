# 卡片入场动画

## 说明

> 在一个div进入页面显示区域时，会有从左侧淡入效果

![](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/card-transition/oneway.gif)



![](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/card-transition/twoway.gif)

## 设计

最终决定使用形式是钩子函数

### 思路

使用`IntersectionObserver`对传入 ref 的children 逐个监听，如果出现，添加动画类名（播放动画）

### Api

|   参数    |                         说明                          |               类型                | 默认值 |
| :-------: | :---------------------------------------------------: | :-------------------------------: | :----: |
|  rootRef  | 传入一个 ref 根节点，此节点下的子元素会自动添加上效果 | MutableRefObject<Element \| null> |   -    |
|           |                                                       |                                   |        |
| bothInOut |               多次出现是否仍要播放动画                |              boolean              | false  |

### 代码

```ts
export const useCardTransition = (
    rootRef: MutableRefObject<Element | null>,
    { bothInOut = false }: config) => {
    const ob = useCallback(() => new IntersectionObserver((entries) => {
        // entries 是监听的所有 dom 节点
        entries.forEach(entry => {
            // 进入页面 isIntersecting 为 true
            if (entry.isIntersecting) {
                // 添加动画
                entry.target.classList.add(styles.active);
            }
            // 离开页面后
            // 如果设置 多次播放，就删去动画（下次进入时会再次添加上，就会重复播放）
            // 如果 多次播放=false（动画类不删除，但是在类内部动画设置只播放一次）
            else if (bothInOut) {
                entry.target.classList.remove(styles.active);
            }
        })
    }), [])
    useEffect(() => {
        // 容器不存在报错
        if (!rootRef.current) {
            return console.log("容器错误");
        }
        // 获取容器内所有子元素的列表
        const children = rootRef.current?.children;
        for (const ele of children) {
            // 遍历子元素并对其进行监听
            ob().observe(ele);
        }

        return () => {
            // 关闭对所有元素的监听
            ob().disconnect();
        }
    }, [rootRef])
}
```

简单动画样式：

```css
.active{
    position: relative;
    animation: in 0.4s ease-in-out forwards;
}
@keyframes in {
    from{
        opacity: 0;
        transform: translateX(-160px);
    }
    to{
        opacity: 1;
        transform: translateX(0);
    }
}
```



### 使用

1. 直接引入 `useCardTransition`

   `` import { useCardTransition } from '../../UI/CardTransition/CardTransition';``

2. 使用 `useRef` 创建父容器

   ``  const rootRef = useRef(null);``

3. 使用`useCardTransition`

   ``  useCardTransition(rootRef, { });``

```tsx
import React, { useRef } from 'react'
import { useCardTransition } from '../../UI/CardTransition/CardTransition';

const style = {
    marginTop: 40,
    height: 260,
    backgroundColor: "#999",
}
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

const TestCardTransi = () => {
    const rootRef = useRef(null);
    useCardTransition(rootRef, { });
    return (
        <div ref={rootRef}>
            {
                list.map(num =>
                    <div key={num} style={style}>
                        {num}
                    </div>)
            }
        </div>
    )
}

export default TestCardTransi
```

## 补充

1. 这个组件正常是设计其实是完全可以的，就是把容器直接放在模板中即可
2. 可操作空间还很大，
   - 修改动画样式，
   - 配置项不只有 bothInOut

> [GitHub源码地址](https://github.com/MTTQ123/ReactGallery)
>
> 也欢迎到 [我的网站 ](https://home.shuihua.cc)查看

