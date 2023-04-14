import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as styles from './chat.module.sass'
import cls from 'classnames'
import { Events } from '../../../../league-core/src/types'
import RageAPI from '../../helpers/RageAPI'
import { ChatItem, ChatMessage } from '../../../../league-core/src/types/cef'
import { toColor } from '../../../../league-core/src/helpers'
import cefLog from '../../helpers/cefLog'
import { Lang } from '../../../../league-lang/language'

const MAX_CHAT_SIZE = 50
const MAX_CHAR_SIZE = 128
const FORCE_CHAT_TOGGLE = true
const MAX_CHAT_ALIVE = 15000

const Chat = () => {
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<ChatMessage[]>([])
    const [toggle, setToggle] = useState(false)
    const [active, setActive] = useState<number | undefined>()

    const ref = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        RageAPI.subscribe(Events['tdm.chat.toggle'], 'chat', (t: boolean) => {
            setToggle(t)
            if (t) setActive(MAX_CHAT_ALIVE)
        })

        RageAPI.subscribe(Events['tdm.chat.push'], 'chat', (msg: string) => {
            try {
                const chatItem: ChatItem = JSON.parse(msg)

                if (chatItem.message) {
                    setHistory((prev) => {
                        if (prev.length > MAX_CHAT_SIZE) prev.shift()
        
                        return [...prev, chatItem.message]
                    })
                }
            } catch (err) {
                cefLog(err)
            }
        })

        return () => {
            RageAPI.unsubscribe(Events['tdm.chat.toggle'], 'chat')
            RageAPI.unsubscribe(Events['tdm.chat.push'], 'chat')
        }
    }, [])

    useEffect(() => {
        if (ref.current) ref.current?.scrollIntoView()
        setActive(MAX_CHAT_ALIVE)
    }, [history])

    useEffect(() => {
        let timeout = 0

        if (active) {
            timeout = setTimeout(() => {
                if (!toggle) setActive(undefined)
            }, active)
        }

        return () => clearTimeout(timeout)
    }, [history, active, toggle])

    useEffect(() => {
        if (inputRef.current && toggle) inputRef.current.focus()
        if (toggle) setInput('')
    }, [toggle])

    const historyElements = useMemo(() => {
        return history.map((message, index) => (
            <span key={index}>
                {message.map(([message, color = '#fff'], i) => (
                    <p key={i} style={{color: toColor(color)}} className={styles.item}>{message.trim() + ' '}</p>
                ))}
            </span>
        ))
    }, [history])

    if (!active) return <></>

    return (
        <div className={styles.container}>
            <div className={cls(styles.history, toggle && styles.historyActive)}>
                {historyElements}
                <div ref={ref} />
            </div>
            <input
                name="input"
                autoFocus={true}
                type="text"
                value={input}
                placeholder={RageAPI.lang.get(Lang['cef.chat.input'])}
                onChange={e => setInput(e.target.value)}
                maxLength={MAX_CHAR_SIZE}
                disabled={!toggle}
                className={toggle ? cls(styles.input, styles.active) : styles.input}
                ref={inputRef}
                onBlur={() => inputRef.current && inputRef.current.focus()}
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