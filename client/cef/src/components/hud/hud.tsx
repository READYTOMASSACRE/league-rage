import React from 'react'
import * as styles from './hud.module.sass'
import cls from 'classnames'

export const Hud = ({ children }: Children) => (
  <section className={cls(styles.hud, styles.grid)} role='hud'>{children}</section>
)

export const Top = ({ children }: Children) => (
  <section className={styles.grid} role='top'>{children}</section>
)

export const Center = ({ children }: Children) => (
  <section className={styles.grid}  role='center'>{children}</section>
)

export const Bottom = ({ children }: Children) => (
  <section className={styles.grid}  role='bottom'>{children}</section>
)

export const Absolute = ({ children }: Children) => (
  <section className={styles.absolute} role='absolute'>{children}</section>
)