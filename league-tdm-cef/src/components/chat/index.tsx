import React, { useEffect, useRef, useState } from 'react'
import * as styles from './chat.module.sass'
import cls from 'classnames'
import { Enviroment, Events } from '../../../../league-core/src/types'

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
        mp.events.add(Events['tdm.chat.toggle'], (t: boolean) => setToggle(t))
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

    useEffect(() => {
        if (inputRef.current && toggle) inputRef.current.focus()
        if (toggle) setInput('')
    }, [toggle])

    return (
        <div>
            <div className={styles.history} tabIndex={-1}>
                {history.map((msg, i) => <p className={styles.item} key={i}>{msg}</p>)}
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
                ref={inputRef}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        const msg = input.trim().slice(0, MAX_CHAR_SIZE)

                        if (msg.length) {
                            mp.trigger(Events['tdm.chat.push'], input, Enviroment.cef)
                        }

                        mp.trigger(Events['tdm.chat.toggle'], false, FORCE_CHAT_TOGGLE)
                        setInput('')
                    }
                    if (e.key === 'Escape') {
                        mp.trigger(Events['tdm.chat.toggle'], false, FORCE_CHAT_TOGGLE)
                        setInput('')
                    }
                }}
            />
        </div>
    )
}

export default Chat