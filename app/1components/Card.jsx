import React from 'react'

const Card = ({title,preview,color,id}) => {
  return (
    <a href={"./notes/"+id}>
       <div className={'cardDiv'} style={{backgroundColor:color}}>
            <h2>{title}</h2>
            <p>{preview}</p>
        </div> 
    </a>
    
  )
}

export default Card