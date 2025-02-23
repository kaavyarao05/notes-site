import React from 'react'
import Image from 'next/image'
import Trash from '@/public/trash.svg'

const Card = ({title,preview,color,id,deleteFunc}) => {
  console.log(color)
  return (
    <div className={'cardDiv'} style={{backgroundColor:color}}>
    <a href={"./notes/"+id}>
       <div>
            <h2>{title}</h2>
            <p>{preview}</p>
        </div> 
    </a>
    <button
    onClick={()=>deleteFunc(id)}
    className='bg-black absolute right-0 bottom-0 m-3 text-white p-1 hover:-translate-y-1 rounded-lg duration-200'
    >
      <Image src={Trash} alt="trash" className='invert'/>
    </button>
    </div>
    
    
  )
}

export default Card