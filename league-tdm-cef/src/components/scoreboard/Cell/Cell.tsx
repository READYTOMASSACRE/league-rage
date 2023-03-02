import React, { FC } from 'react'

interface Props {
  value?: string | number;
  width?: string;
  height?: string;
  padding?: string;
  marging?: string;
  display?: string;
  ai?: string;
  jc?: string;
  fg?: string | number;
}

const styleCell = (width?: string, padding?: string, marging?: string, display?: string, ai?: string, jc?: string, fg?: string | number, height?: string) => {
    const style = {
      width: width,
      padding: padding,
      marging: marging, 
      display: display,
      alignItems: ai,
      justifyContent: jc,
      flexGrow: fg,
      height: height,
    }
    return style;
}

const Cell: FC<Props> = ({ value, width, padding, marging, display, ai, jc, fg, height }) => {
  return (
    <div style={styleCell(width, padding, marging, display, ai, jc, fg, height)}>
      {value}
    </div>
  )
}

export default Cell