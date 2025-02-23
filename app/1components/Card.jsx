import React from 'react'
import Image from 'next/image'
import Trash from '@/public/trash.svg'

const colourSelect=(choices,selectColorFunc,id)=>
  <div className='absolute bottom-3 left-3 flex p-1 bg-white w-fit rounded-md selectCol'>
    {choices.map((col)=>
      <button onClick={()=>selectColorFunc(col,id)} style={{backgroundColor:col}} className="h-8 w-8 border-black rounded-sm border-2" key={col}/>
      )}
  </div>

const Card = (
  {
    title,
    preview,
    color,
    id,
    deleteFunc,
    colorChoices,
    selectColorFunc
  }
) => {
  console.log(color)
  return (
    <div className={'cardDiv'} style={{backgroundColor:color}}>
    <a href={"./notes/"+id}>
       <div>
            <h2>{title}</h2>
            <p>{preview}</p>
        </div> 
    </a>
    {colourSelect(colorChoices,selectColorFunc,id)}
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