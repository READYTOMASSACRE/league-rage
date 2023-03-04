import React, { useEffect, useRef, useState } from 'react'
import classes from './chat.module.sass'
import cls from 'classnames'

const MAX_CHAT_SIZE = 50

const Chat = () => {
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<string[]>([])
    const [toggle, setToggle] = useState(true)

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) ref.current?.scrollIntoView()
    }, [history])

    return (
        <div className={toggle ? cls(classes.chat, classes.active) : classes.chat}>
            <div className={classes.history}>
                {history.map((msg, i) => <div className={classes.item} key={i}>{msg}</div>)}
                <div ref={ref} />
            </div>
            <input
                name="input"
                type="text"
                value={input}
                placeholder="Type to chat"
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        setHistory(prev => {
                            if (prev.length > MAX_CHAT_SIZE) prev.shift()
            
                            return [...prev, input]
                        })
                        setInput('')
                    }
                }}
            />
        </div>
    )
}

export { Chat }