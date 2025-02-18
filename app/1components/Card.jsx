import React from 'react'

const Card = ({title,preview}) => {
  return (
    <div className='cardDiv'>
        <h2>{title}</h2>
        <p>{preview}</p>
    </div>
  )
}

export default Card