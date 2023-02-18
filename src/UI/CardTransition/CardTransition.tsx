import { MutableRefObject, useCallback, useEffect } from 'react'
import styles from './CardTransition.module.scss'

type config = {
    bothInOut?: boolean
}
export const useCardTransition = (
    rootRef: MutableRefObject<Element | null>,
    { bothInOut = false }: config) => {
    const ob = useCallback(() => new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(styles.active);
            }
            else if (bothInOut) {
                entry.target.classList.remove(styles.active);
            }
        })
    }), [])
    useEffect(() => {
        if (!rootRef.current) {
            return console.log("容器错误");
        }
        const children = rootRef.current?.children;
        for (const ele of children) {
            ob().observe(ele);
        }

        return () => {
            ob().disconnect();
        }
    }, [rootRef])
}