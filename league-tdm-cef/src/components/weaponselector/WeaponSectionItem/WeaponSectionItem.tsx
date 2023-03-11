import React, { FC} from 'react'
import * as s from './WeaponSectionItem.module.sass'

interface Props {
  title?: string
  value?: string | number
  barmaxvalue?: number
}

const WeaponSectionItem: FC<Props> = ({ title, value, barmaxvalue }) => {

  const dashWidth = () => {
    if(barmaxvalue && value && typeof(value) === 'number') {
      return {
        width: 100 / barmaxvalue * value + '%'
      }
    }
  }

  return (
    <div className={s.container}>
      <div>
        {title}
      </div>
      <div>
        {value}
      </div>
      {barmaxvalue && (
        <div>
          <div style={dashWidth()} className={s.barline} />
        </div>
      )}
    </div>
  )
}

export default WeaponSectionItem
