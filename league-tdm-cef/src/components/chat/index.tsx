import React, { useEffect, useRef, useState } from 'react'
import * as styles from './chat.module.sass'
import cls from 'classnames'
import { Events } from '../../../../league-core/src/types'
import RageAPI from '../../helpers/RageAPI'

const MAX_CHAT_SIZE = 50
const MAX_CHAR_SIZE = 128
const FORCE_CHAT_TOGGLE = true

const Chat = () => {
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<string[]>([])
    const [toggle, setToggle] = useState(false)

    const ref = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        RageAPI.subscribe(Events['tdm.chat.toggle'], 'chat', (t: boolean) => setToggle(t))
        RageAPI.subscribe(Events['tdm.chat.push'], 'chat', (msg: string) => {
            setHistory(prev => {
                if (prev.length > MAX_CHAT_SIZE) prev.shift()

                return [...prev, msg]
            })
        })

        return () => {
            RageAPI.unsubscribe(Events['tdm.chat.toggle'], 'chat')
            RageAPI.unsubscribe(Events['tdm.chat.push'], 'chat')
        }
    }, [])

    useEffect(() => {
        if (ref.current) ref.current?.scrollIntoView()
    }, [history])

    useEffect(() => {
        if (inputRef.current && toggle) inputRef.current.focus()
        if (toggle) setInput('')
    }, [toggle])

    return (
        <div className={styles.container}>
            <div className={styles.history} tabIndex={-1}>
                {history.map((msg, i) => <p className={styles.item} key={i}>{msg}</p>)}
                <div ref={ref} />
            </div>
            <input
                tabIndex={-1}
                name="input"
                type="text"
                value={input}
                placeholder="Type to chat"
                onChange={e => setInput(e.target.value)}
                maxLength={MAX_CHAR_SIZE}
                disabled={!toggle}
                className={toggle ? cls(styles.input, styles.active) : styles.input}
                ref={inputRef}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        const message = input.trim().slice(0, MAX_CHAR_SIZE)

                        if (message.length) {
                            RageAPI.chatPush(input)
                        }

                        RageAPI.chatToggle(false, FORCE_CHAT_TOGGLE)
                        setInput('')
                    }
                    if (e.key === 'Escape') {
                        RageAPI.chatToggle(false, FORCE_CHAT_TOGGLE)
                        setInput('')
                    }
                }}
            />
        </div>
    )
}

export default Chat