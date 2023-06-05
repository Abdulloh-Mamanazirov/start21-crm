import React from 'react'
import Navbar from '../Componenets/Navbar';
import { Button, TextField } from '@mui/material';
import NewsCard from '../Componenets/NewsCard';
import { useState } from 'react';
import { CameraAlt } from '@mui/icons-material';

const News = () => {
  let [title, setTitle] = useState("")
  let [image, setImage] = useState(null)
    let thisYear = new Date().getFullYear()
    let thisMonth =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    let thisDay =
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    let today = `${thisYear}-${thisMonth}-${thisDay}`

  function handleSubmit(e){
    e.preventDefault()
  }

  return (
    <>
      
        <Navbar title="News"/>
          <div className='flex gap-6 mt-3 justify-center'>
           <form onSubmit={handleSubmit} className='w-7/12 flex flex-col gap-5 border-r-2 pr-6'>
            <h2 className='text-center text-3xl font-semibold text-blue-500'>Create News</h2>
             <div className="flex gap-3">
                 <TextField onChange={(e)=>{setTitle(e.target.value)}} fullWidth id='title' type="text" size='small' key="title" label="Title" name="title"/>
                 <TextField className='w-1/3' id='date' defaultValue={today} type="date" size='small' key="date" name="date"/>
             </div>
             <div className="flex gap-3">
               <TextField fullWidth multiline={true} rows={4} id='desc' type="text" key="desc" label="Write news..." name="desc"/>
               <Button variant="outlined" component="label">
                <CameraAlt/>
                <input onChange={(e)=>setImage(URL.createObjectURL(e.target.files[0]))} hidden accept="image/*" multiple type="file" />
              </Button>
             </div>
             <Button variant='contained' type="submit">Submit</Button>
           </form> 
           <div>
              <div hidden={title.length > 0 || image ? false : true}>
                <p className='pb-2 font-semibold opacity-70'>Preview of a card in the main website.</p>
                <NewsCard image={image} name={title} seen={0} />
              </div>
            </div>
          </div>
          
          <h2 className='text-5xl font-semibold font-mono text-center mt-10'>News</h2>
          <div className='px-5 py-5 flex items-center flex-wrap'>
            <NewsCard image={"/android.jpg"} name={"title is nothing"} seen={0} />
            <NewsCard image={image} name={"lucky cow"} seen={0} />
            <NewsCard image={"/vite.svg"} name={"www world wide web"} seen={0} />
          </div>
      
    </>
  );
}

export default News
