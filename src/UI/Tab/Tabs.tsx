import { useState } from 'react'
import styles from './Tabs.module.scss'

type Props = {
  items: any[]
  hasAll?: boolean
  seletTab: (tab: string) => void
}

const Tabs = ({ items, hasAll = true, seletTab }: Props) => {
  const list = hasAll ? ['全部', ...items] : [...items]
  const [current, setCurrent] = useState(list[0])
  // 标签改变时执行
  const onChangeTab = (tab: string) => {
    setCurrent(tab)
    // 选择全部为“”
    if (tab === '全部') {
      tab = ''
    }
    seletTab(tab)
  }
  return (
    <div className={styles.tabs}>
      <input type="checkbox" id="extend" />
      <label htmlFor="extend">展开</label>
      <div className={styles.all}>
        {list.map((ele, index) => (
          <div
            key={index}
            className={`${styles.tab} ${current === ele ? styles.active : ''}`}
            onClick={() => onChangeTab(ele)}
          >
            {ele}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabs
