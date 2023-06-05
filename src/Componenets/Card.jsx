import React from 'react'

const Card = (props) => {
  return (
    <div className='border rounded-xl p-5 flex items-end justify-between shadow-lg transition-all hover:scale-105 hover:bg-slate-100'>
        <div>
            <span className="text-3xl font-semibold">{props.title}</span><br />
            <span className="text-2xl">{props.num}</span>
        </div>
        <div>
            <img src="/vite.svg" alt="image" />
        </div>
    </div>
  )
}

export default Card
