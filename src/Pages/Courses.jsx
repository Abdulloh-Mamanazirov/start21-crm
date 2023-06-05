import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../Componenets/Navbar";

const Courses = () => {
  let dialog = useRef();
  let deleteDialog = useRef();
  let [search, setSearch] = useState();
  let [deleteId, setDeleteId] = useState();
  let [loading, setLoading] = useState(false);
  let [refresh, setRefresh] = useState(false);
  let [courses, setCourses] = useState();
  let [courseData, setCourseData] = useState()
  useEffect(() => {
    async function getData() {
      let { data } = await axios.post("/allCourses");
      setCourses(data)
    }
    getData()
  }, [refresh]);

  useEffect(() => {
    setTimeout(async ()=>{
      let { data } = await axios.post("/allCourses",{title:search});
      setCourses(data)
    },0)
  }, [search]);
  
  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    let res = await axios.post('/createCourse',{title:e.target.title.value}).catch(error=>{setLoading(false); if(error)return toast(error?.response?.data, {type:'warning'})})
    toast(res?.data, {type:"success"})
    setLoading(false)
    setRefresh(!refresh)
    e.target.reset()
  }

  async function deleteCourse() {
    await axios
      .delete(`/courses/${deleteId}`)
      .catch((error) => {
        if (error) return toast("Something went wrong!", { type: "error" });
      })
      .then((res) => toast(res?.data, { type: "info" }));
    setRefresh(!refresh);
    deleteDialog.current.close();
  }

  async function handleUpdate(e) {
    e.preventDefault();
    let { title } = e.target;

    let res = await axios
      .put(`/courses/${courseData?.id}`, {
        title: title.value
      })
      .catch((error) => {
        if (error) return toast("Something went wrong!", { type: "error" });
      });

    toast(res?.data, { type: "success" });
    dialog.current.close();
    setRefresh(!refresh);
  }

  return (
    <>
      <Navbar title="Courses" />
      <div>
        <div className=" px-4 py-5">
          <h2 className="text-4xl font-semibold pb-2 pl-1">Add Course :</h2>
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <TextField
              required
              className="w-1/3"
              size="small"
              id="title"
              type="text"
              key="title"
              label="Title"
              name="title"
            />
            <Button
              type="submit"
              className="w-1/4"
              disabled={loading}
              variant="contained"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin-pulse fa-xl"></i>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
        <div className="bg-slate-300 w-1/4 ml-auto p-2 rounded-t-lg">
          <TextField
            fullWidth
            size="small"
            className="bg-white rounded-md"
            type="search"
            key="course"
            label="Course title"
            name="course"
            onChange={async (e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <table className="w-full text-center rounded-lg">
          <thead className="bg-slate-300 text-lg">
            <tr>
              <th className="py-4">#</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses !== undefined
              ? courses?.map?.((course, ind) => {
                  return (
                    <tr
                      key={course?.id}
                      className="border-b border-gray-300 hover:bg-slate-100"
                    >
                      <td className="py-4">{ind + 1}</td>

                      <td>{course?.title}</td>
                      <td>
                        <i
                          onClick={() => {
                            deleteDialog.current.showModal();
                            setDeleteId(course?.id);
                          }}
                          className="fa-solid fa-trash cursor-pointer bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"
                        ></i>
                        <i
                          onClick={() => {
                            setCourseData(course);
                            dialog.current.showModal();
                          }}
                          className="fa-solid fa-pen ml-2 cursor-pointer bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 active:bg-blue-400"
                        ></i>
                      </td>
                    </tr>
                  );
                })
              : new Array(5).fill(1).map((a) => {
                  return (
                    <tr key={crypto.randomUUID()} className="border-y-4 ">
                      <td className="border-x-4 bg-gray-400 bg-opacity-70 w-3 p-1 animate-pulse">
                        <span></span>
                      </td>
                      <td className="border-x-4 bg-gray-400 bg-opacity-70 w-5 p-1 animate-pulse">
                        <span> </span>
                      </td>
                      <td className="border-x-4 bg-gray-400 bg-opacity-70 w-5 p-1 animate-pulse">
                        <span> </span>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
      <dialog
        ref={deleteDialog}
        className="scroll backdrop:bg-black backdrop:bg-opacity-50 border rounded-xl"
      >
        <h3 className="text-2xl font-bold">
          Do you want to delete this course?
        </h3>
        <p className="text-center pb-4">
          All groups, students and teachers related to this
          <br /> course will be deleted!
        </p>
        <div>
          <div className="grid grid-cols-2 gap-5">
            <button
              className="border bg-blue-600 text-white rounded-md py-1"
              formMethod="dialog"
              type="reset"
              onClick={() => deleteDialog.current.close()}
            >
              Cancel
            </button>
            <button
              className="border bg-red-500 text-white rounded-md py-1"
              type="submit"
              onClick={() => deleteCourse()}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={dialog}
        className="scroll backdrop:bg-black backdrop:bg-opacity-40 border rounded-xl"
      >
        <form onSubmit={(e) => handleUpdate(e)} className="flex flex-col gap-3">
          <h2 className="text-center text-2xl font-semibold">Edit Course</h2>
          <label htmlFor="name">Course title:</label>
          <input
            defaultValue={courseData?.title}
            type="text"
            name="title"
            id="name"
            className="w-72 -mt-3 rounded-lg border border-blue-400 p-1 outline-blue-400 shadow-lg"
          />

          <div>
            <button
              className="border bg-red-500 text-white rounded-md px-3 py-1"
              formMethod="dialog"
              type="reset"
              onClick={() => dialog.current.close()}
            >
              Cancel
            </button>
            <button
              className="border bg-blue-600 text-white rounded-md px-3 py-1 ml-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default Courses;
