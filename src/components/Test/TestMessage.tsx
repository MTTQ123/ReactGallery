import Message from '../../UI/Message/Message'

const TestMessage = () => {
    const add: any = (pos: string) => {
        Message.notice("测试文字啧啧啧！", { position: pos });
    }

    return (
        <>
            <button onClick={() => add("R_T")} style={{ width: 100, height: 66, backgroundColor: "whitesmoke" }}>
                右上
            </button>
            <button onClick={() => add("C_T")} style={{ width: 100, height: 66, backgroundColor: "whitesmoke" }}>
                中上
            </button>
        </>
    )
}

export default TestMessage