# React消息通知

## 说明

> 查看 antd 的示例后，通知提示框与对话框这两个其实相差并不大。对于我个人，想要的无非  就是一个全局提醒组件，所以我最终实现的效果类似与 antd 中的通知提示框，无非是加了一个可以手动关闭的按钮。

​		从动图中可以看出，在首次指定位置后，后面位置均以固定，不会再发生改变，父容器也是同一个。

​	 ![](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/message/finalEffect.gif)

## 设计

- ❌：返回 jsx，在使用时以标签名的方式使用
- ✔：以函数形式调用（函数内部会在 document 中渲染出），要使用弹窗，就调用一次函数

### Api

|   参数    |       说明       |  类型  | 默认值 |
| :-------: | :--------------: | :----: | :----: |
|  message  |   弹窗展示信息   | string |   -    |
|     -     |        -         |   -    |   -    |
| duration  |   弹窗展示时间   | number | 3000ms |
| className | 自定义弹窗的类名 | string |   ""   |
| position  |     弹窗位置     | string | "C_T"  |

### 代码

1. 以 antd 为模板，我们也把调用函数名称为 notice；

   ```ts
   // 传入弹窗模板中的参数
   interface Base {
       className?: string
       position?: string
   }
   
   //调用弹窗函数时 第二个参数
   interface AProps extends Base {
       duration?: number
   }
   
   // 传入 位置 的正确值
   const posList = ["L_T", "L_C", "L_B", "C_T", "C_C", "C_B", "R_T", "R_C", "R_B"]
   
   // 所有弹窗的父容器
   let containerRoot: any;
   // 存储所有弹窗的列表
   let list: string[] = [];
   // 存储所有弹窗自动销毁的计时器列表
   let timerList: any = [];
   
   function notice(message: string, { duration = 3000, ...args }: AProps) {
       ...
   }
   ```
   
   
   
2. 弹窗模板

   - 通过 usecallback（，[ ]），确保每个弹窗的位置都以第一次调用为准，不会反复横跳
   - getPosition：如果传入错误的位置直接报错提醒
   - list.map：遍历全局 list ，来生成每一条消息

   ```tsx
   const MessageTemplate = ({ args }: { args: Base }) => {
       // 如果没有传入参数，设置默认值
       const { className = "", position = "C_T" } = args
   
       const getPosition = useCallback(() => {
           // 传入正确的位置 或 没有传
           if (posList.includes(position)) {
               return styles[position]
           }
           // 传入错误的位置
           throw new Error("位置错误");
   
       }, [])
   
       // 点击关闭按钮时执行
       const quit = (index: number) => {
           removeMsg(args, index);
       }
   
       return (
           <div className={`${styles.fix} ${getPosition()}`}>
               {
                   list.length ?
                       list.map((item, index) =>
                           <div className={`${styles.message} ${className}`} key={index}>
                               {item}
                               <span onClick={() => quit(index)}></span>
                           </div>
                       ) : null
               }
           </div>
       )
   }
   ```

   

3. notice思路

   ​	每次调用 notice( )

   - 我们需要把消息存储在全局中，然后对其渲染。
   - 同时添加一个计时器，用以在结束时自动将这条信息销毁。
   - 将计时器存储到全局，用以按钮手动关闭
   
   这里是 message 是必填项，单独取出，其余三项均为选填，而 duration 在当下就要使用，因此设置默认值。
   
   ```ts
   function notice(message: string, { duration = 3000, ...args }:    AProps) {
       // 将该条消息存入全局并渲染
       addMsg(args, message);
          
       // 在计时结束后
       const timer = setTimeout(() => {
           // 删去该条消息并重新渲染
           removeMsg(args);
       }, duration);
          
       // 计时器也存储到全局
       timerList.push(timer);
   }
   ```
   
   

4. addMsg方法

   - 存储信息
   - 渲染

   ```ts
   const addMsg = (args: Base, msg: string) => {
       list.push(msg);
   
       renderMsgList(args);
   }
   ```

   

5. remove方法

   - 删除信息
   - 渲染

   无论是自动删除还是按钮删除都是调用这个方法

   	- 自动删除：id传0，（每次新增时使用的是push，新增的在列表后面，所以每次自动删除1时都是老的、最前面的）
   	- 手动点击：传入id

   ```ts
   const removeMsg = (args: Base, id: number) => {
       list.splice(id, 1);
       
       // 先把要删除的计时器清空
       clearTimeout(timerList[id]);
       // 再从全局删除
       timerList.splice(id, 1);
   
       renderMsgList(args);
   }
   ```

   

6. renderMsgList 方法

   ```tsx
   const renderMsgList = (args: Base) => {
       containerRoot = createContainer();
       containerRoot.render(<MessageTemplate args={args}/>);
   }
   ```

   

7. createContainer 方法

   由于是在全局存储的容器，先判断有没有，有了直接用，没有再创建（第一次没有，后面就有了）

   ```ts
   const createContainer = () => {
       if (containerRoot) {
           return containerRoot
       }
       const div = document.createElement("div");
       document.body.appendChild(div);
       const container = createRoot(div);
   
       return container;
   }
   ```

## 使用

```tsx
import Message from '../../UI/Message/Message'

const TestMessage = () => {
    const add: any = (pos: string) => {
        Message.notice("测试文字啧啧啧！", { position: pos });
    }

    return (
        <button onClick={() => add("R_T")} style={{ width: 100, height: 66, backgroundColor: "whitesmoke" }}>
            右上
        </button>
    )
}

export default TestMessage
```

## 问题

在第一次使用后位置就固定了，我觉得这既是一个优点也是一个缺点吧。

大多数应用，只需要在固定一个地方显示即可，不会说一会再这一会在哪。。。

> 我也尝试着去解决：
>
> 1. 我先将 模板中的 useCallback 中的依赖项设为 (position)，结果是：
>
>    ![](https://shuihuaphoto.oss-cn-beijing.aliyuncs.com/components/react/message/err1.gif)
>
> 2. 不是让根据 list 生成子元素的父容器固定，而是直接让生成的每一个消息项固定，但是这样又出现在同一位置不同消息叠加在一起
>
> 3. 将不同元素直接根据位置分类，父容器下有9个子容器，分别固定在不同的位置，根据传入消息的位置生成在相对应的容器中，但是测试发现我在点击按钮后过了一段时间才生成相对应的节点，不太清楚为什么

目前就做到这里吧，因为做出来也满足了我平日里的需求



> [GitHub源码地址](https://github.com/MTTQ123/ReactGallery)
>
> 也欢迎到 [我的网站 ](https://home.shuihua.cc)查看
