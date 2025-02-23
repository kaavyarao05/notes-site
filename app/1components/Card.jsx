import React from 'react'
import Image from 'next/image'
import Trash from '@/public/trash.svg'

const colourSelect=(choices,selectColorFunc,id)=>
  <div className='absolute bottom-3 left-3 flex bg-black border-4 border-white w-fit rounded-md selectCol'>
    <div className='ml-1 flex'>
    {choices.map((col)=>
      <button onClick={()=>selectColorFunc(col,id)} style={{backgroundColor:col}} className="h-8 w-8 border-black -ml-1 border-2 hover:rounded-br-xl hover:rounded-tl-2xl duration-500" key={col}/>
      )}
    </div>
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