import { ChangeEvent, MouseEventHandler, useState } from 'react'
import { useDebounce } from '../../hooks/debounce'
import styles from './Search.module.scss'

type Props = {
  className?: string
  style?: object

  type?: string
  placeholder?: string
  disabled?: boolean

  onChange?: (str: string) => void
}

const Search = ({
  className = '',
  style = {},

  type = 'text',
  placeholder = '请输入值：',
  disabled = false,

  onChange = (str) => {},
}: Props) => {
  // 存储值（受控组件）
  const [value, setValue] = useState<string>('')
  // 设为防抖函数
  const afterChange = useDebounce(onChange, 400)
  // 改变存储的值
  const change = (e: ChangeEvent) => {
    const val = (e.currentTarget as HTMLInputElement).value
    setValue(val)
    afterChange(val)
  }
  return (
    <div className={`${styles.search}`} style={style}>
      <input
        className={`${styles.ipt} ${className}`}
        style={style}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={change}
      />
    </div>
  )
}

export default Search
