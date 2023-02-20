import { createRoot } from 'react-dom/client'
import styles from './Loading.module.scss'

export const Load = (function () {
  let containerRoot: any = null

  // 创建根容器
  const createContainer = () => {
    if (containerRoot) {
      return containerRoot
    }
    const div = document.createElement('div')
    document.body.appendChild(div)
    const container = createRoot(div)

    return container
  }

  // 渲染Loading动画
  const render = (status: boolean) => {
    containerRoot.render(<Loading status={status}></Loading>)
  }

  return {
    open: () => {
      containerRoot = createContainer()
      render(true)
    },
    close: () => {
      if (!containerRoot) {
        throw new Error('您应该先开启一个后才可以关闭')
      }
      render(false)
    },
  }
})()

const Loading = ({ status = false }: { status: boolean }) => {
  return (
    <div className={styles.loading}>
      {status ? (
        <>
          <div className={styles.txt}>LOADING</div>
          <div className={styles.ring}></div>
        </>
      ) : null}
    </div>
  )
}
