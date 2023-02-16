# react分页器

## 设计

### 说明（最终效果）

> 假如：默认设置最大显示页数为7

1. 如果要渲染的页数少于设置最大页数

   ![image-20230214162129581](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/pagination/image-20230214162129581.png)

2. 如果要渲染的页数多于设置最大页数，又分为以下三种

   ![image-20230214162408133](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/pagination/image-20230214162408133.png)

   ![image-20230214162425617](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/pagination/image-20230214162425617.png)

   ![image-20230214162440641](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/pagination/image-20230214162440641.png)

### Api

|    参数     |                  说明                  |   类型   | 默认值 |
| :---------: | :------------------------------------: | :------: | :----: |
|  className  |                  类名                  |  string  |   “”   |
|    totle    |                数据总量                |  number  |   -    |
|    count    |             每页展示的数量             |  number  |   8    |
| currentPage |             初始时所在页数             |  number  |   1    |
|   handler   | 页码改变的回调函数，参数是改变后的页码 | Function |   -    |

### 代码

- 页面基本骨架

```tsx
type Props = {
    className?: string

    totle: number
    count?: number

    handleSearch: Function
}

const MORETXT = '...'; // 页面过多时显示的符号
const MAX_PAGE = 7; // 最多展示的分页器个数，建议为奇数，保证分页器的对称

const Pagination = ({
    className = "",
    totle,
    count = 8,
    currentPage = 1,
    handleSearch }: Props) => {
    
    return(<ul className={`${styles.pagination} ${className}`}>

        </ul>)
    
}
```

- 内部变量

  ```ts
  // 根据传入的数据总数量和每页显示的数量计算出总工划分的页数
  const totalPage = Math.ceil(totle / count);
  
  // 要显现出来的页数（[1,2,3,4,5,...,9][1,...,4,5,6,...,9]）
  const [nums, setNums] = useState<any[]>([]);
  
  // 当前在第几页（currentPage默认为1，即第一页）
  const [current, setCurrent] = useState(currentPage);
  ```

- 内部方法

  1. handleClick: 点击时进行判断
     * item：跳转的页数或为多余符号...

```ts
    const handleClick = (item: any) => {
    // 判断点击的是否是数字页码还是多余符号
    const isMoreTxt = item === MORETXT;
    // 如果是多余符号，就设置num为0，表示不跳转
    // 如果是数字页码，就设置num为要跳转的页数
    let num = isMoreTxt ? 0 : parseInt(item, 10);
    if (num < 1 || num > totalPage) {
        // 跳转的页码小于1，或大于最大页码数说明无效
        return
    }
    // 进行跳转
    changePage(totalPage, num);
};
```

2. changePage：具体进行跳转
    * total: 总页面数，
      * cur： 跳转后所在页码

```ts
const changePage = (total: number, cur: number) => {
	// 设置当前页码
    setCurrent(cur);
    
    // 设置显示的所有页码（绘制新的页码表）
    setNums(drawPage(total, cur));
    
    // 执行传入的回调函数
    handleSearch(cur);
};
```

3. drawPage：重新设置需要显示的所有页码
   * total: 总页面数，
    * cur： 跳转后所在页码

```ts
const drawPage = (total: number, cur: number) => {
    // 首页和尾页无论何时都会显示
    // 可显示页码数 =  页码个数 - 首页 - 尾页
    const temp = MAX_PAGE - 2;

    let pagesNum = []; // 显示页码数组
    
    // 如果当前总页数 <= MAX_PAGE，则直接将当前总页数转成数组
    // 比如 当前总页数=5，需要返回[1，2，3，4，5]
    if (total <= MAX_PAGE) {
        pagesNum = [...Array(total).keys()].map(item => item + 1);
    }

    // 如果当前总页数 > MAX_PAGE，则需要分为三种情况
    // 1. 当前页码离首页稍近的时候，尾部显示省略号
    // 比如 当前总页数=9，当前显示页数为3，需要返回[1，2，3，4，5，"..."，9]
    else if (cur <= Math.ceil(temp / 2)) {
        pagesNum = [...Array(temp).keys()].map(item => item + 1); // 除省略号和尾页之外的数字
        pagesNum = [...pagesNum, MORETXT, total];
    }

    // 2.当前页码离尾页稍近的时候，头部显示省略号
    // 比如 当前总页数=9，当前显示页数为7，需要返回[1，"..."，5，6，7，8，9]
    else if (cur >= total - Math.floor(temp / 2)) {
        pagesNum = [...Array(temp).keys()].map(item => total - item); // 除省略号和首页之外的数字
        pagesNum = [1, MORETXT, ...pagesNum.reverse()]; // 上一步拿到的pagesNum是倒序的，所以需要反转一下
    }

    // 3. 以上情况都不成立，则显示两个省略号
    // 比如 当前总页数=9，当前显示页数为4，需要返回[1，"..."，4，5，6，"..."，9]
    else{
        // 5 = 首 + 省略号 + curPage + 省略号 + 尾
        // 因此推荐设置MAX_PAGE为奇数
        const side = (MAX_PAGE - 5) / 2;
        const leftArr = [...Array(cur).keys()].reverse().slice(0, side); // cur左边的数组
        const rightArr = [...Array(total).keys()].slice(cur + 1, cur + side + 1); // cur右边的数组

        pagesNum = [1, MORETXT, ...leftArr, cur, ...rightArr, MORETXT, totalPage];
	}
    return pagesNum;
};
```

## 使用

```tsx
import React from 'react'
import Pagination from '../../UI/Pagination/Pagination'

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,31,32,33]

const TestPain = () => {
    return (
        <div>
            <Pagination totle={list.length} count={4} handleSearch={(num: number) => console.log}></Pagination>
        </div>
    )
}

export default TestPain
```

![](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/pagination/pagin.gif)

## 结束

> [GitHub源码地址](https://github.com/MTTQ123/ReactGallery)
>
> 也欢迎到 [我的博客 ](https://home.shuihua.cc)查看

