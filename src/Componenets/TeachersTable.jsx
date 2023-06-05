import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const TeachersTable = () => {
  let link;
  let dialog = useRef();
  let deleteDialog = useRef();
  let [search, setSearch] = useState();
  let [teachers, setTeachers] = useState();
  let [courses, setCourses] = useState();
  let [deleteId, setDeleteId] = useState();
  let [teacherData, setTeacherData] = useState();
  let [refresh, setRefresh] = useState(false);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      let { data:teachers } = await axios.post("/teachers");
      let {data:courses} = await axios.post('/allCourses')
      setTeachers(teachers);
      setCourses(courses);
    }
    getData();
  }, [refresh]);

  useEffect(()=>{
    setTimeout(async() => {
      let {data}= await axios.post("/teachers",{name:search})
      setTeachers(data)
    }, 0);
  },[search])

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let { name, phone, course, image } = e.target;
    if (image.files) {
      let file = new FormData();
      file.append("file", image.files[0]);
      file.append("upload_preset", "start21");
      await fetch("https://api.cloudinary.com/v1_1/dcypqxeyl/image/upload", {
        method: "POST",
        body: file,
      })
        .then((res) => res.json())
        .then((res) => {
          link = res;
          return res;
        });
    }

    await axios
      .post("/addTeacher", {
        name: name.value,
        phone: phone.value,
        course: course.value,
        image: link?.secure_url,
      })
      .catch((error) => {
        if (error) {setLoading(false); return toast(error?.response?.data,{type:"error"});}
      })
      .then((res) => {setLoading(false); return toast(res?.data, { type: "success" })});

      e.target.reset()
      setRefresh(!refresh)
  }

    async function deleteTeacher(){
      await axios.delete(`/teachers/${deleteId}`).catch(error=>{if(error)return toast("Something went wrong!",{type:"error"})}).then(res=>toast(res?.data, {type:"info"}))
      setRefresh(!refresh)
      deleteDialog.current.close()
    }

  async function handleUpdate(e) {
    e.preventDefault();
    let { name, phone, course } = e.target;

    let res = await axios.put(`/teachers/${teacherData?.id}`,{name:name.value, phone:phone.value, course:course.value}).catch(error=>{if(error)return toast(error?.response?.data, { type: "error" });})

    toast(res?.data, {type:"success"})
    dialog.current.close()
    setRefresh(!refresh)
  }

  return (
    <>
      <div className=" px-4 py-5">
        <h2 className="text-4xl font-semibold pb-2 pl-1">Add Teacher :</h2>
        <form
          className="grid grid-cols-3 grid-rows-2 gap-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <TextField
            required
            size="small"
            id="name"
            type="text"
            key="name"
            label="Name"
            name="name"
          />
          <TextField
            required
            size="small"
            id="phone"
            type="text"
            key="phone"
            label="Phone"
            name="phone"
          />
          <input
            id="image"
            type="file"
            name="image"
            className="p-1 border border-gray-400 rounded-md file:bg-gray-200 file:h-full file:rounded-md file:border-none"
          />
          <select
            size="small"
            key="course"
            name="course"
            required
            className="p-1 border border-gray-400 rounded-md"
          >
            <option selected disabled value="">
              Select a course *
            </option>
            {courses?.map?.((c) => (
              <option key={c?.id} value={c?.id}>
                {c?.title}
              </option>
            ))}
          </select>

          <Button type="submit" disabled={loading} variant="contained">
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
          key="teacher"
          label="Teacher name"
          name="teacher"
          onChange={async (e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <table className="w-full text-center rounded-lg">
        <thead className="bg-slate-300 text-lg">
          <tr>
            <th className="py-4">#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers !== undefined
            ? teachers?.map?.((teacher, ind) => {
                return (
                  <tr
                    key={teacher?.id}
                    className="border-b border-gray-300 hover:bg-slate-100"
                  >
                    <td>{ind + 1}</td>
                    <td className="py-2">
                      <img
                        src={
                          teacher?.image?.length > 10
                            ? teacher?.image
                            : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                        }
                        alt="teacher image"
                        className="w-14 mx-auto object-cover aspect-square rounded-full border"
                      />
                    </td>
                    <td>{teacher?.name}</td>
                    <td>{teacher?.phone}</td>
                    <td>{teacher?.course}</td>
                    <td>
                      <i
                        onClick={() => {
                          deleteDialog.current.showModal();
                          setDeleteId(teacher?.id);
                        }}
                        className="fa-solid fa-trash cursor-pointer bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"
                      ></i>
                      <i
                        onClick={() => {
                          setTeacherData(teacher);
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
                    <td className="border-x-4 bg-gray-400 bg-opacity-70 w-16 p-1 animate-pulse">
                      <span></span>
                    </td>
                    <td className="border-x-4 bg-gray-400 bg-opacity-70 w-10 p-1 animate-pulse">
                      <span></span>
                    </td>
                    <td className="border-x-4 bg-gray-400 bg-opacity-70 w-5 p-1 animate-pulse">
                      <span> </span>
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
      <dialog
        ref={deleteDialog}
        className="scroll backdrop:bg-black backdrop:bg-opacity-50 border rounded-xl"
      >
        <h3 className="text-2xl font-bold">
          Do you want to delete this teacher?
        </h3>
        <p className="text-center pb-4">
          All groups and students of this teacher
          <br /> will be deleted!
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
              onClick={() => deleteTeacher()}
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
          <h2 className="text-center text-2xl font-semibold">Edit Teacher</h2>
          <label htmlFor="name">Teacher name:</label>
          <input
            defaultValue={teacherData?.name}
            type="text"
            name="name"
            id="name"
            className="w-72 -mt-3 rounded-lg border border-blue-400 p-1 outline-blue-400 shadow-lg"
          />
          <label htmlFor="phone">Phone number:</label>
          <input
            defaultValue={teacherData?.phone}
            type="text"
            name="phone"
            id="phone"
            className="w-72 -mt-3 rounded-lg border border-blue-400 p-1 outline-blue-400 shadow-lg"
          />
          <label htmlFor="course">
            Course:{" "}
            <span className="text-xs">
              (Do not select unless you want to change)
            </span>
          </label>
          <select
            size="small"
            key="course"
            id="course"
            name="course"
            defaultValue={teacherData?.course}
            className="p-1 border -mt-3 border-gray-400 rounded-md"
          >
            <option selected value="">
              Select a course
            </option>
            {courses?.map?.((c) => (
              <option key={c?.id} value={c?.id}>
                {c?.title}
              </option>
            ))}
          </select>

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

export default TeachersTable;
