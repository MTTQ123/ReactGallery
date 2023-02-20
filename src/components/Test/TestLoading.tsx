import React from 'react'
import { Load } from '../../UI/Loading/Loading'

const TestLoading = () => {
  return (
    <div>
      <button onClick={Load.open}>开启动画</button>
      <button onClick={Load.close}>关闭动画</button>
    </div>
  )
}

export default TestLoading
