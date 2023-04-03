import React from 'react'
import { createUseStyles } from 'react-jss'
import cls from 'classnames'

export interface AnimatedLetterProps {
  content: string
  offset: string
  offsetTo: string
  delay: string
  duration: string
  className: string
  char: string
  animation: string
  color: string
}

const useStyles = (props: AnimatedLetterProps) => createUseStyles<any, AnimatedLetterProps>({
  [`@keyframes ${props.animation}`]: {
    from: {
      marginTop: props.offset,
    },
    to: {
      marginTop: props.offsetTo,
    },
  },
  letter: {
    '&:before': {
      color: props.color,
      content: `"${props.content}"`,
      marginTop: props.offset,
      animationName: `$${props.animation}`,
      animationDuration: props.duration,
      animationDelay: props.delay,
      animationFillMode: 'forwards',
    },
  },
})

export default (props: AnimatedLetterProps) => {
  const classes = useStyles(props)()

  return (
    <span className={cls(props.className, classes.letter)}>{props.char}</span>
  )
}