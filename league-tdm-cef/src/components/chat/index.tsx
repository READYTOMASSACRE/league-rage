import React, { useEffect, useRef, useState } from 'react'
import * as styles from './chat.module.sass'
import cls from 'classnames'
import { Events } from '../../../../league-core/src/types'

const MAX_CHAT_SIZE = 50
const MAX_CHAR_SIZE = 128
const FROM_CEF = true

const Chat = () => {
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<string[]>([])
    const [toggle, setToggle] = useState(true)

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        mp.events.add(Events['tdm.chat.toggle'], () => setToggle(!toggle))
        mp.events.add(Events['tdm.chat.push'], (msg: string) => {
            setHistory(prev => {
                if (prev.length > MAX_CHAT_SIZE) prev.shift()

                return [...prev, msg]
            })
        })
    }, [])

    useEffect(() => {
        if (ref.current) ref.current?.scrollIntoView()
    }, [history])

    return (
        <div>
            <div className={styles.history}>
                {history.map((msg, i) => <div className={styles.item} key={i}>{msg}</div>)}
                <div ref={ref} />
            </div>
            <input
                name="input"
                type="text"
                value={input}
                placeholder="Type to chat"
                onChange={e => setInput(e.target.value)}
                maxLength={MAX_CHAR_SIZE}
                disabled={!toggle}
                className={toggle ? cls(styles.input, styles.active) : styles.input}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        const msg = input.trim().slice(0, MAX_CHAR_SIZE)

                        if (msg.length) {
                            mp.trigger(Events['tdm.chat.push'], input, FROM_CEF)
                        }

                        setInput('')
                    }
                }}
            />
        </div>
    )
}

export { Chat }