import React, { useEffect, useState } from 'react';
import styles from './Pagination.module.scss'

type Props = {
    className?: string

    totle: number
    count?: number
    currentPage?: number

    handleSearch: Function
}

const MORETXT = '...';
const MAX_PAGE = 7; // 最多展示的分页器个数，建议为奇数，保证分页器的对称

const Pagination = ({
    className = "",
    totle,
    count = 8,
    currentPage = 1,
    handleSearch }: Props) => {

    const totalPage = Math.ceil(totle / count)

    const [nums, setNums] = useState<any[]>([]); // 显示的页码数组
    const [current, setCurrent] = useState(currentPage);

    useEffect(() => {
        changePage(totalPage, currentPage);
    }, [totalPage, currentPage]);

    const changePage = (total: number, cur: number) => {
        setCurrent(cur);
        setNums(drawPage(total, cur));
        handleSearch(cur);
    };

    /**
     * 改变分页器中的内容
     * @param {number} total
     * @param {number} cur
     */
const drawPage = (total: number, cur: number) => {
        const temp = MAX_PAGE - 2; // 可显示页码数 =  页码个数 - 首页 - 尾页

        let pagesNum = []; // 显示页码数组
        if (total <= MAX_PAGE) { // 如果当前总页数 <= MAX_PAGE，则直接将当前总页数转成数组
            pagesNum = [...Array(total).keys()].map(item => item + 1);
            return pagesNum;
        }

        // 如果当前总页数 > MAX_PAGE，则需要分为三种情况
        // 1. 当前页码离首页稍近的时候，尾部显示省略号
        else if (cur <= Math.ceil(temp / 2)) {
            pagesNum = [...Array(temp).keys()].map(item => item + 1); // 除省略号和尾页之外的数字
            pagesNum = [...pagesNum, MORETXT, total];
            return pagesNum;
        }

        // 2.当前页码离尾页稍近的时候，头部显示省略号
        else if (cur >= total - Math.floor(temp / 2)) {
            pagesNum = [...Array(temp).keys()].map(item => total - item); // 除省略号和首页之外的数字
            pagesNum = [1, MORETXT, ...pagesNum.reverse()]; // 上一步拿到的pagesNum是倒序的，所以需要反转一下
            
            return pagesNum;
        }

        // 3. 以上情况都不成立，则显示两个省略号
        else {
            const side = (MAX_PAGE - 5) / 2; // 5 = 首 + 省略号 + curPage + 省略号 + 尾
            const leftArr = [...Array(cur).keys()].reverse().slice(0, side); // curPage左边的数组
            const rightArr = [...Array(total).keys()].slice(cur + 1, cur + side + 1); // curPage右边的数组
    
            pagesNum = [1, MORETXT, ...leftArr, cur, ...rightArr, MORETXT, totalPage];
        }

        return pagesNum;
};

    /**
     * 处理两边都有省略号的情况
     * @param {array} total
     * @param {number} curPage
     */
    const around = (total: number, curPage: number) => {
        const side = (MAX_PAGE - 5) / 2; // 5 = 首 + 省略号 + curPage + 省略号 + 尾
        const leftArr = [...Array(curPage).keys()].reverse().slice(0, side); // curPage左边的数组
        const rightArr = [...Array(total).keys()].slice(curPage + 1, curPage + side + 1); // curPage右边的数组

        const pagesNum = [1, MORETXT, ...leftArr, curPage, ...rightArr, MORETXT, totalPage];
        return pagesNum;
    };

    const handleClick = (item: any) => {

        const isMoreTxt = item === MORETXT;
        let num = isMoreTxt ? 0 : parseInt(item, 10);
        if (num < 1 || num > totalPage) {
            return
        }
        changePage(totalPage, num);
    };

    return (
        <ul className={`${styles.pagination} ${className}`}>
            <div className={styles.extr} onClick={() => handleClick(current - 1)}>&lt;</div>
            {
                nums.map((item, index) => {
                    const isChoosed = item === current;
                    return <li key={index}
                        className={isChoosed ? styles.active : ""}
                        onClick={() => handleClick(item)}>
                        {item}
                    </li>;
                })
            }
            <div className={styles.extr} onClick={() => handleClick(current + 1)}>&gt;</div>
        </ul>
    );
};

export default Pagination