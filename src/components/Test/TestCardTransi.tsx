import React, { useRef } from 'react'
import { useCardTransition } from '../../UI/CardTransition/CardTransition';

const style = {
    marginTop: 40,
    height: 260,
    backgroundColor: "#999",
}
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

const TestCardTransi = () => {
    const rootRef = useRef(null);
    useCardTransition(rootRef, { });
    return (
        <div ref={rootRef}>
            {
                list.map(num =>
                    <div key={num} style={style}>
                        {num}
                    </div>)
            }
        </div>
    )
}

export default TestCardTransi