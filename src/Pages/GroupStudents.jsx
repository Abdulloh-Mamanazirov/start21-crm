import { TextField, Button, Checkbox } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GroupCard from "../Componenets/GroupCard";
import GroupCardPlaceholder from "../Componenets/GroupCardPlaceholder";
import Navbar from "../Componenets/Navbar";

const GroupStudents = () => {
  let navigate = useNavigate();
  let dialog = useRef();
  let deleteDialog = useRef();
  let attendanceDialog = useRef();
  let { id } = useParams();
  let [loading, setLoading] = useState(false);
  let [refresh, setRefresh] = useState(false);
  let [deleteId, setDeleteId] = useState();
  let [students, setStudents] = useState();
  let [group, setGroup] = useState();

  useEffect(() => {
    async function getData() {
      let { data: students } = await axios.get(`/students/${id}`);
      let { data: group } = await axios.get(`/groups/${id}`);
      setStudents(students);
      setGroup(group[0]);
    }
    getData();
  }, [refresh]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let { name, phone } = e.target;
    let res = await axios
      .post("/addStudent", {
        name: name.value,
        phone: phone.value,
        group_id: id,
      })
      .catch((error) => {
        setLoading(false);
        if (error) return toast(error?.response?.data, { type: "error" });
      });
    toast(res?.data, { type: "success" });
    setLoading(false);
    setRefresh(!refresh);
    e.target.reset();
  }

  async function handleUpdate(e) {
    e.preventDefault();
    let { days, start, end } = e.target;

    let res = await axios
      .put(`/groups/${id}`, {
        days: days.value,
        start: start.value,
        end: end.value,
      })
      .catch((error) => {
        if (error) return toast(error?.response?.data, { type: "error" });
      });

    toast(res?.data, { type: "success" });
    dialog.current.close();
    setRefresh(!refresh);
  }

  async function deleteGroup() {
    let res = await axios.delete(`/groups/${deleteId}`).catch((error) => {
      if (error) return toast(error?.response?.data, { type: "error" });
    });

    toast(res?.data, { type: "info" });
    deleteDialog.current.close();
    setRefresh(!refresh);
    navigate("/groups");
  }

  return (
    <>
      <Navbar title="Group" />
      <div className=" px-4 py-5">
        <h2 className="text-4xl font-semibold pb-2 pl-1">
          Add students to this group :
        </h2>
        <form className="grid grid-cols-3 gap-2" onSubmit={handleSubmit}>
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
            required
            size="small"
            id="phone"
            type="text"
            key="phone"
            label="Phone"
            name="phone"
          />
          <Button type="submit" disabled={loading} variant="contained">
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin-pulse fa-xl"></i>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
      <div className="flex gap-5 p-3 items-start">
        <div className="grid grid-cols-1">
          {group !== undefined ? (
            <>
              <GroupCard
                key={group?.group_id}
                course={group?.title}
                image={
                  group?.image?.length > 10
                    ? group?.image
                    : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                teacher={group?.teacher}
                phone={group?.phone}
                days={group?.days}
                time={group?.start_time + " - " + group?.end_time}
                number_of_students={students?.length}
                delete={
                  <span
                    title="Delete"
                    onClick={() => {
                      deleteDialog.current.showModal();
                      setDeleteId(group?.group_id);
                    }}
                    className="flex-1 text-center py-1 cursor-pointer border border-red-600 text-red-600 rounded-bl-xl transition-all hover:bg-red-500 hover:text-white active:bg-red-400"
                  >
                    Delete
                  </span>
                }
                edit={
                  <span
                    title="Edit"
                    onClick={() => {
                      dialog.current.showModal();
                    }}
                    className="flex-1 text-center py-1 cursor-pointer border border-blue-600 text-blue-600 rounded-br-xl transition-all hover:bg-blue-500 hover:text-white active:bg-blue-400"
                  >
                    Edit
                  </span>
                }
              />
              <button
                onClick={() => attendanceDialog.current.showModal()}
                className="bg-green-500 text-white py-1 px-2 rounded-lg mt-5 shadow-xl border transition-all hover:scale-[1.02]"
              >
                Attendance
              </button>
            </>
          ) : (
            <div className="w-64">
              <GroupCardPlaceholder />
            </div>
          )}
        </div>
        <table className="flex-1 text-center rounded-lg">
          <thead className="bg-slate-300 text-lg">
            <tr>
              <th className="py-4">#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Attendance</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {students !== undefined
              ? students?.map?.((student, ind) => {
                  return (
                    <tr
                      key={student?.id}
                      className="border-b border-gray-300 hover:bg-slate-100"
                    >
                      <td className="py-4">{ind + 1}</td>

                      <td>{student?.name}</td>
                      <td>{student?.phone}</td>
                      <td>
                        {student?.present === true ? (
                          <i className="fa-solid fa-check text-green-500 text-2xl"></i>
                        ) : (
                          <i className="fa-solid fa-xmark text-red-500 text-2xl"></i>
                        )}
                      </td>
                      {/* <td>
                        <i
                          onClick={() => {
                            deleteDialog.current.showModal();
                            setDeleteId(student?.id);
                          }}
                          className="fa-solid fa-trash cursor-pointer bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"
                        ></i>
                        <i
                          onClick={() => {
                            setCourseData(student);
                            dialog.current.showModal();
                          }}
                          className="fa-solid fa-pen ml-2 cursor-pointer bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 active:bg-blue-400"
                        ></i>
                      </td> */}
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
        ref={attendanceDialog}
        className="scroll relative backdrop:bg-black backdrop:bg-opacity-50 border rounded-xl"
      >
        <h3 className="text-3xl sticky  z-10 bg-white -top-5 inset-x-0 text-center pt-2 font-semibold pb-4">
          Students list
        </h3>
        <div>
          <table className="text-center">
            <thead>
              <tr>
                <th className="border border-gray-400 px-10">Student</th>
                <th className="border border-gray-400 px-10">Is present?</th>
              </tr>
            </thead>
            <tbody>
              {students?.map?.((s) => {
                return (
                  <tr key={s?.id}>
                    <td className="border border-gray-400">{s?.name}</td>
                    <td className="border border-gray-400">
                      <Checkbox
                        onChange={async (e) => {
                          await axios
                            .post("/attendance/update", {
                              student_id: s?.id,
                              group_id: s?.group_id,
                              date: new Date().toLocaleDateString(),
                              present: e.target.checked,
                            })
                            .catch((error) => {
                              if (error)
                                toast("Something went wrong!", {
                                  type: "error",
                                });
                            });
                        }}
                        defaultChecked={s?.present === true && true}
                        type="checkbox"
                        name="yes"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="grid grid-cols-2 gap-5 mt-2">
            <span />
            <button
              className="border bg-green-600 text-white rounded-md py-1"
              formMethod="dialog"
              type="reset"
              onClick={() => {
                setRefresh(!refresh);
                attendanceDialog.current.close();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={deleteDialog}
        className="scroll backdrop:bg-black backdrop:bg-opacity-50 border rounded-xl"
      >
        <h3 className="text-2xl font-bold">
          Do you want to delete this group?
        </h3>
        <p className="text-center pb-4">
          All students related to this group
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
              onClick={() => deleteGroup()}
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
          <h2 className="text-center text-2xl font-semibold">Edit Group</h2>
          <p className="text-center text-sm">
            Do not change any input unless you want <br /> to update this group!
          </p>
          <select
            key="days"
            name="days"
            className="p-1 border border-gray-400 rounded-md"
          >
            <option selected disabled value="">
              Select days *
            </option>
            <option value="even">Even days</option>
            <option value="odd">Odd days</option>
            <option value="everyday">Everyday</option>
          </select>
          <label htmlFor="start">Start time:</label>
          <input
            className="-mt-3 flex-1 border border-gray-400 rounded-md p-1"
            type="time"
            name="start"
            id="start"
          />
          <label htmlFor="end">End time:</label>
          <input
            className="-mt-3 flex-1 border border-gray-400 rounded-md p-1"
            type="time"
            name="end"
            id="end"
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

export default GroupStudents;
