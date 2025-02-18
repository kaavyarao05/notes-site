import React from 'react'

const Card = ({title,preview,className}) => {
  return (
    <div className={'cardDiv '+className}>
        <h2>{title}</h2>
        <p>{preview}</p>
    </div>
  )
}

export default Card