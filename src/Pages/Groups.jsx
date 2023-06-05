import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GroupCard from "../Componenets/GroupCard";
import GroupCardPlaceholder from "../Componenets/GroupCardPlaceholder";
import Navbar from "../Componenets/Navbar";

function Groups() {
  let dialog = useRef();
  let deleteDialog = useRef();
  let timeErr = useRef();
  let [groupData, setGroupData] = useState();
  let [deleteId, setDeleteId] = useState();
  let [courses, setCourses] = useState();
  let [groups, setGroups] = useState();
  let [teachers, setTeachers] = useState();
  let [loading, setLoading] = useState();
  let [refresh, setRefresh] = useState();

  useEffect(() => {
    async function getData() {
      let { data: courses } = await axios.post("/allCourses");
      let { data: groups } = await axios.post("/groups");
      setCourses(courses);
      setGroups(groups);
    }
    getData();
  }, [refresh]);

  async function getTeachers(e) {
    let { data } = await axios
      .get(`/teachers/${e.target.value}`)
      .catch((error) => {
        if (error) return toast("Something went wrong!", { type: "error" });
      });
    setTeachers(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let { course, days, teacher, start, end } = e.target;
    if (start.value >= end.value === true)
      return (timeErr.current.textContent =
        "Ending time must be greater than the starting time!");
    else timeErr.current.textContent = "";
    setLoading(true);
    let res = await axios
      .post("/createGroup", {
        course: course.value,
        days: days.value,
        teacher: teacher.value,
        start: start.value,
        end: end.value,
      })
      .catch((error) => {
        setLoading(false);
        if (error) return toast(error?.response?.data, {type:"error"});
      });

    toast(res?.data, { type: "success" });
    setRefresh(!refresh);
    timeErr.current.textContent = "";
    return setLoading(false);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    let { course, days, teacher, start, end } = e.target;

    let res = await axios
      .put(`/groups/${groupData?.group_id}`, {
        course: course.value,
        days: days.value,
        teacher: teacher.value,
        start: start.value,
        end: end.value,
      })
      .catch((error) => {
        if (error) return toast(error?.response?.data, {type:"error"});
      });

    toast(res?.data, { type: "success" });
    dialog.current.close();
    setRefresh(!refresh);
  }

  async function deleteGroup() {
    let res = await axios.delete(`/groups/${deleteId}`).catch((error) => {
      if (error) return toast(error?.response?.data, {type:"error"});
    });

    toast(res?.data, { type: "info" });
    deleteDialog.current.close();
    setRefresh(!refresh);
  }

  return (
    <>
      <Navbar title="Groups" />
      <div className=" px-4 py-5">
        <h2 className="text-4xl font-semibold pb-2 pl-1">Add Group :</h2>
        <form
          className="grid grid-cols-3 grid-rows-2 gap-2"
          onSubmit={handleSubmit}
        >
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
            key="days"
            name="days"
            required
            className="p-1 border border-gray-400 rounded-md"
          >
            <option selected disabled value="">
              Select days *
            </option>
            <option value="even">Even days</option>
            <option value="odd">Odd days</option>
            <option value="everyday">Everyday</option>
          </select>
          <select
            key="teachers"
            name="teacher"
            required
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
          <div className="flex items-center gap-3">
            <label htmlFor="start">Start time * :</label>
            <input
              required
              className="flex-1 border border-gray-400 rounded-md p-1"
              type="time"
              name="start"
              id="start"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="end">End time * :</label>
            <input
              required
              className="flex-1 border border-gray-400 rounded-md p-1"
              type="time"
              name="end"
              id="end"
            />
          </div>

          <Button type="submit" disabled={loading} variant="contained">
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin-pulse fa-xl"></i>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
        <p className="text-center text-red-500" ref={timeErr}></p>
      </div>
      <FormControl sx={{ml:4}} className="w-1/4">
        <InputLabel id="label-filter-group">Filter Groups</InputLabel>
        <Select labelId="label-filter-group" id="filter-group" label="Filter Groups" onChange={async(e)=>{
          let {data} = await axios.post("/groups",{course:e.target.value})
          setGroups(data)
        }}>
          <MenuItem value={""}>All Groups</MenuItem>
          {courses?.map?.((c) => (
            <MenuItem value={c?.title} key={c?.id}>{c?.title}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="grid grid-cols-4 gap-5 p-3">
        {groups !== undefined
          ? groups?.map?.((g) => {
              return (
                <GroupCard
                  link={g?.group_id}
                  key={g?.group_id}
                  course={g?.title}
                  image={
                    g?.image?.length > 10
                      ? g?.image
                      : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                  }
                  teacher={g?.teacher}
                  phone={g?.phone}
                  days={g?.days}
                  time={g?.start_time + " - " + g?.end_time}
                  number_of_students={g?.number_of_students}
                  delete={
                    <span
                      title="Delete"
                      onClick={() => {
                        deleteDialog.current.showModal();
                        setDeleteId(g?.group_id);
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
                        setGroupData(g);
                        dialog.current.showModal();
                      }}
                      className="flex-1 text-center py-1 cursor-pointer border border-blue-600 text-blue-600 rounded-br-xl transition-all hover:bg-blue-500 hover:text-white active:bg-blue-400"
                    >
                      Edit
                    </span>
                  }
                />
              );
            })
          : new Array(4).fill(1).map((a) => {
              return <GroupCardPlaceholder key={crypto.randomUUID()} />;
            })}
      </div>
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
            key="course"
            name="course"
            onChange={getTeachers}
            className="p-1 border border-gray-400 rounded-md"
          >
            <option selected disabled value="">
              Select a course
            </option>
            {courses?.map?.((c) => (
              <option key={c?.id} value={c?.id}>
                {c?.title}
              </option>
            ))}
          </select>
          <select
            key="days"
            name="days"
            className="p-1 border border-gray-400 rounded-md"
          >
            <option selected disabled value="">
              Select days
            </option>
            <option value="even">Even days</option>
            <option value="odd">Odd days</option>
            <option value="everyday">Everyday</option>
          </select>
          <select
            key="teachers"
            name="teacher"
            className="p-1 border border-gray-400 rounded-md"
          >
            <option selected disabled value="">
              Select a teacher
            </option>
            {teachers?.map?.((t) => (
              <option key={t?.id} value={t?.id}>
                {t?.name}
              </option>
            ))}
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
}

export default Groups;
