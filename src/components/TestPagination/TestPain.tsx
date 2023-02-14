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