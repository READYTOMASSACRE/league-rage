import React from 'react'
import * as styles from '../../styles/panel.module.sass'
import RageAPI from '../../../../helpers/RageAPI'
import { Lang } from '../../../../../../league-lang/language'

export default () => {
  return (
    <div className={styles.about}>
      <h1>{RageAPI.lang.get(Lang["cef.panel.about_title"])}</h1>
      <span className={styles.aboutDesc}>{RageAPI.lang.get(Lang["cef.panel.about_description"])}</span>
      <div className={styles.aboutContributors}>
      <div className={styles.dev}>
          <span>Contributors:</span>
          <ul>
            <li>readytomassacre</li>
            <li>sabgrad</li>
          </ul>
        </div>
        <div className={styles.qa}>
          <span>Testers:</span>
          <ul>
            <li>sabgrad</li>
            <li>Young</li>
            <li>sofly</li>
            <li>Max_Burg</li>
            <li>Alex_Dev</li>
            <li>PATRIOT</li>
          </ul>
        </div>
      </div>
    </div>
  )
}