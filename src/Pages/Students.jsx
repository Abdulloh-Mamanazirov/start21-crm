import {
  Button,
  FormControlLabel,
  Pagination,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import * as validatePhone from "phone";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../Componenets/Navbar";

const Students = () => {
  let dialog = useRef();
  let deleteDialog = useRef();
  let [phoneCheck, setPhoneCheck] = useState(true);
  let [search, setSearch] = useState();
  let [loading, setLoading] = useState();
  let [refresh, setRefresh] = useState(false);
  let [deleteId, setDeleteId] = useState();
  let [studentData, setStudentData] = useState();
  let [students, setStudents] = useState();
  let [teachers, setTeachers] = useState();
  let [groups, setGroups] = useState();
  let [courses, setCourses] = useState();
  let [pagination, setPagination] = useState(1);
  let [arrayNum, setArrayNum] = useState(0);

  useEffect(() => {
    async function getData() {
      let { data: students } = await axios.post("/students").catch((error) => {
        if (error) return toast("Something went wrong!", { type: "error" });
      });
      let { data: courses } = await axios.get("/courses").catch((error) => {
        if (error) return toast("Something went wrong!", { type: "error" });
      });
      setStudents(students);
      setCourses(courses);
      setArrayNum(Math.ceil(students?.length / 10));
    }
    getData();
  }, [refresh]);

  useEffect(() => {
    setTimeout(async () => {
      let { data } = await axios.post("/students", { name: search });
      setStudents(data);
      setArrayNum(Math.ceil(data?.length / 10));
    }, 500);
  }, [search]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let { name, phone, group } = e.target;
    let phoneCheck = validatePhone.phone(phone.value, { country: "uzb" });
    if(!phoneCheck.isValid) {setLoading(false); return setPhoneCheck(false);}

    let res = await axios
      .post("/addStudent", {
        name: name.value,
        phone: phone.value,
        group_id: group.value,
      })
      .catch((error) => {
        setLoading(false);
        if (error) return toast(error?.response?.data, { type: "error" });
      });

    toast(res?.data, { type: "success" });
    setRefresh(!refresh);
    setLoading(false);
    setPhoneCheck(true);
    e.target.reset();
    group.value = "";
  }

  async function getTeachers(e) {
    let { data } = await axios
      .get(`/teachers/${e.target.value}`)
      .catch((error) => {
        if (error) return toast("Something went wrong!", { type: "error" });
      });
    setTeachers(data);
  }

  async function getGroups(e) {
    let { data } = await axios
      .get(`/groups/teacher/${e.target.value}`)
      .catch((error) => {
        if (error) return toast("Something went wrong!", { type: "error" });
      });
    setGroups(data);
  }

  async function deleteStudent() {
    let res = await axios.delete(`/students/${deleteId}`).catch((error) => {
      if (error) return toast("Something went wrong!", { type: "error" });
    });
    deleteDialog.current.close();
    toast(res?.data, { type: "info" });
    setRefresh(!refresh);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    let {name,phone,group} = e.target
    let res = await axios.put(`/students/${studentData?.student_id}`,{
      name:name.value,
      phone:phone.value,
      group_id:group.value
    }).catch(error=>{if(error)return toast(error?.response?.data, {type:"error"})})
    setRefresh(!refresh)
    dialog.current.close()
    return toast(res?.data, {type:"success"})
  }

  function handlePagination(_, page) {
    setPagination(page);
  }

  return (
    <>
      <Navbar title="Students" />
      <div className=" px-4 py-5">
        <h2 className="text-4xl font-semibold pb-2 pl-1">Add Student :</h2>
        <form
          className="grid grid-cols-3 grid-rows-2 gap-2"
          onSubmit={handleSubmit}
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
            defaultValue={"+998"}
            error={!phoneCheck}
            required
            size="small"
            id="phone"
            type="text"
            key="phone"
            label="Phone"
            name="phone"
          />
          <select
            key="course"
            name="course"
            required
            onChange={getTeachers}
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
          <select
            key="teacher"
            name="teacher"
            required
            onChange={getGroups}
            className="p-1 border border-gray-400 rounded-md"
          >
            <option selected disabled value="">
              Select a teacher *
            </option>
            {teachers?.map?.((t) => (
              <option key={t?.id} value={t?.id}>
                {t?.name}
              </option>
            ))}
          </select>
          <select
            key="group"
            name="group"
            required
            className="p-1 border border-gray-400 rounded-md"
          >
            <option selected disabled value="">
              Select a group *
            </option>
            {groups?.map?.((g) => (
              <option key={g?.id} value={g?.id}>
                {g?.days} {g?.start_time + " - " + g?.end_time}
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
          key="student"
          label="Student name"
          name="student"
          onChange={async (e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <table className="w-full text-center rounded-lg">
        <thead className="bg-slate-300 text-lg">
          <tr>
            <th className="py-4">#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Group</th>
            <th>Teacher Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students !== undefined
            ? students
                ?.slice((pagination - 1) * 10, pagination * 10)
                ?.map?.((student, ind) => {
                  return (
                    <tr
                      key={student?.student_id}
                      className="border-b border-gray-300 hover:bg-slate-100"
                    >
                      <td className="py-4">{ind + 1}</td>

                      <td>{student?.name}</td>
                      <td>{student?.phone}</td>
                      <td>{student?.course}</td>
                      <td>
                        {student?.days}{" "}
                        {student?.start_time + " - " + student?.end_time}
                      </td>
                      <td>{student?.teacher}</td>
                      <td>
                        <i
                          onClick={() => {
                            deleteDialog.current.showModal();
                            setDeleteId(student?.student_id);
                          }}
                          className="fa-solid fa-trash cursor-pointer bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"
                        ></i>
                        <i
                          onClick={() => {
                            setStudentData(student);
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
                    <td className="border-x-4 bg-gray-400 bg-opacity-70 w-3 p-1 animate-pulse">
                      <span></span>
                    </td>
                    <td className="border-x-4 bg-gray-400 bg-opacity-70 w-16 p-1 animate-pulse">
                      <span></span>
                    </td>
                    <td className="border-x-4 bg-gray-400 bg-opacity-70 w-10 p-1 animate-pulse">
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
                  </tr>
                );
              })}
          {students?.length === 0 && "No students!"}
        </tbody>
      </table>
      <div className="flex justify-end my-2 mr-8">
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          defaultValue={1}
          onChange={handlePagination}
        >
          {new Array(arrayNum).fill(0).map((_, ind) => {
            return (
              <FormControlLabel
              key={crypto.randomUUID()}
                sx={
                  +pagination === ind + 1
                    ? { bgcolor: "#0077ff" }
                    : { border: "1px solid #0077ff" }
                }
                className="rounded-md px-4 py-1 text-[#0077ff]"
                value={ind + 1}
                control={<Radio sx={{ display: "none" }} />}
                disabled={+pagination === ind + 1}
                label={ind + 1}
              />
            );
          })}
        </RadioGroup>
      </div>
      <div>
        <dialog
          ref={deleteDialog}
          className="scroll backdrop:bg-black backdrop:bg-opacity-50 border rounded-xl"
        >
          <h3 className="text-2xl font-bold pb-4">
            Do you want to delete this student?
          </h3>
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
                onClick={() => deleteStudent()}
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
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <h2 className="text-center text-2xl font-semibold">
              Edit Student Details
            </h2>
            <p className="text-center text-sm">
              Do not change any input unless you want <br /> to edit this
              student's details!
            </p>
            <label htmlFor="name">Student name:</label>
            <input
              defaultValue={studentData?.name}
              type="text"
              name="name"
              id="name"
              className="w-72 -mt-3 rounded-lg border border-blue-400 p-1 outline-blue-400 shadow-md"
            />
            <label htmlFor="phone" className="-mt-2">Phone number:</label>
            <input
              defaultValue={studentData?.phone}
              type="text"
              name="phone"
              id="phone"
              className="w-72 -mt-3 rounded-lg border border-blue-400 p-1 outline-blue-400 shadow-md"
            />
            <select
              key="course"
              name="course"
              className="p-1 border border-gray-400 rounded-md"
              onChange={getTeachers}
            >
              <option selected value="">
                Select a new course
              </option>
              {courses?.map?.((c) => (
                <option key={c?.id} value={c?.id}>
                  {c?.title}
                </option>
              ))}
            </select>
            <select
              key="teacher"
              name="teacher"
              className="p-1 border border-gray-400 rounded-md"
              onChange={getGroups}
            >
              <option selected value="">
                Select a new teacher
              </option>
              {teachers?.map?.((t) => (
                <option key={t?.id} value={t?.id}>
                  {t?.name}
                </option>
              ))}
            </select>
            <select
              key="group"
              name="group"
              className="p-1 border border-gray-400 rounded-md"
            >
              <option selected value="">
                Select a new group
              </option>
              {groups?.map?.((g) => (
                <option key={g?.group_id} value={g?.id}>
                  {g?.days} {g?.start_time + " - " + g?.end_time}
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
      </div>
    </>
  );
};

export default Students;
