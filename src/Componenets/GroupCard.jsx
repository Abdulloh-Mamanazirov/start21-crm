import React from 'react'
import { Link } from 'react-router-dom';

const GroupCard = (props) => {
  return (
    <div className="relative border border-gray-300 rounded-xl p-3 pt-14 pb-12 shadow-lg transition-all hover:scale-[1.02] hover:shadow-gray-500">
      <div className="bg-[#0e86e9] py-2 text-white text-xl font-semibold text-center absolute top-0 inset-x-0 rounded-t-xl">
        {props.course}
      </div>
      <Link to={props.link}>
        <div className="flex items-center gap-5">
          <img
            src={props.image}
            alt="teacher image"
            className="w-16 object-cover aspect-square rounded-full border"
          />
          <div className="flex flex-col gap-2">
            <span>
              Teacher :<span className="font-semibold"> {props.teacher}</span>
            </span>
            <span>
              Phone : <span className="font-semibold">{props.phone}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <span className="flex items-center gap-3">
            <span className="font-semibold">Lesson days :</span>
            {(props.days === "even" && "Even") ||
              (props.days === "odd" && "Odd") ||
              (props.days === "everyday" && "Everyday")}
          </span>
          <span className="flex items-center gap-3">
            <span className="font-semibold">Lesson hours :</span>
            {props.time}
          </span>
          <span className="flex items-center gap-3">
            <span className="font-semibold">Number of students :</span>
            {props.number_of_students}
          </span>
        </div>
      </Link>
      <div className="rounded-b-xl absolute bottom-0 inset-x-0 flex">
        {props.delete}
        {props.edit}
      </div>
    </div>
  );
}

export default GroupCard
