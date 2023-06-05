import React from 'react'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import { KeyboardArrowRight, RemoveRedEye } from '@mui/icons-material';

const NewsCard = (props) => {
  return (
    <Card
      className="newsCard hoverCard"
      sx={{
        maxWidth: 250,
        background: "#252525",
        color: "white",
        transition: ".3s",
        marginRight: "14px",
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{ height: "220px" }}
          image={props.image}
          alt="news image"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {props.name}
          </Typography>
          <div className="text-sm flex items-center justify-between pt-3 opacity-80">
            <span className='flex items-center gap-2'>
              <RemoveRedEye fontSize='small'/>
              {props.seen}
            </span>
            <Link
              to="/news"
              className="flex items-center hover:text-sky-500 hover:decoration-sky-400 hover:underline"
            >
              Read More <KeyboardArrowRight />
            </Link>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>

  );
}

export default NewsCard
