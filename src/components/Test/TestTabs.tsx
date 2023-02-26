import React from 'react'
import Tabs from '../../UI/Tab/Tabs'

const list = [
  '标签1',
  '标签2',
  '标签3',
  '标签4',
  '标签5',
  '标签6',
  '标签7',
  '标签8',
  '标签9',
  '标签10',
  '标签11',
  '标签12',
]

const TestTabs = () => {
  return (
    <div>
      <Tabs items={list} seletTab={console.log}></Tabs>
    </div>
  )
}

export default TestTabs
