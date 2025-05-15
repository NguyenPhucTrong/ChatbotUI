import React, { useEffect, useRef, useState } from "react";
import TaskRow from "./TaskRow";
import { updateProject } from "../services/ProjectsServices";
import { toast } from "react-toastify";

export interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  priority: string;
  assignee: string;
  createdAt: string;
  projectId: number; // Đảm bảo tất cả các file sử dụng cùng định nghĩa này
}

export interface Project {
  id: number;
  name: string;
  status: string;
  priority: string;
  manager: any;
  tasks: Task[];
}

export interface Member {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface ProjectTableProps {
  project: Project;
  members: Member[];
  filteredTasks: (tasks: Task[]) => Task[];
  handleEditTitle: (
    projectId: number,
    taskId: number,
    newTitle: string
  ) => void;
  handleEditDueDate: (
    projectId: number,
    taskId: number,
    newDueDate: string
  ) => void;
  updateTaskStatus: (
    projectId: number,
    taskId: number,
    newStatus: string
  ) => void;
  updateTaskPriority: (
    projectId: number,
    taskId: number,
    newPriority: string
  ) => void;
  handleAssignMemberToTask: (
    projectId: number,
    taskId: number,
    assignee: string
  ) => void;
  deleteTask: (projectId: number, taskId: number) => void;
  addTask: (projectId: number) => void;
  permissionsList: string[];
  listManager: any[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  project,
  members,
  filteredTasks,
  handleEditTitle,
  handleEditDueDate,
  updateTaskStatus,
  updateTaskPriority,
  handleAssignMemberToTask,
  deleteTask,
  addTask,
  permissionsList,
  listManager,
}) => {
  // console.log("permissionsList", permissionsList);

  const [manager, setManager] = useState(project.manager);
  const [status, setStatus] = useState(project.status);
  const [priority, setPriority] = useState(project.priority);
  async function handleUpdateProject(prop: any) {
    let data = {
      ProjectName: project.name,
      Manager: manager,
      Status: status,
      Priority: priority,
    };
    data[Object.keys(prop)[0]] = prop[Object.keys(prop)[0]];
    try {
      const response = await updateProject(project.id, data);
      toast.success("Cập nhật thành công!");
      if (Object.keys(prop)[0] === "Manager") {
        setManager(prop[Object.keys(prop)[0]]);
      } else if (Object.keys(prop)[0] === "Status") {
        setStatus(prop[Object.keys(prop)[0]]);
      } else {
        setPriority(prop[Object.keys(prop)[0]]);
      }
    } catch (err) {
      console.log(err);
      toast.error("có lỗi!");
    }
  }
  return (
    <div className="w-full overflow-x-auto mx-auto mt-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
      {localStorage.getItem("userRole") === "Super Admin" ? (
        <>
          <span>Assigned: </span>
          <select
            value={manager}
            className="mb-4 mr-8 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleUpdateProject({ Manager: e.target.value })}
          >
            {manager === null ? (
              <option value="null">No Assigned</option>
            ) : (
              <></>
            )}
            {listManager?.map((manager) => (
              <option key={manager.IdUser} value={manager.IdUser}>
                {manager.Fullname}
              </option>
            ))}
          </select>
          <span>Status: </span>
          <select
            value={status}
            className="mb-4 mr-8 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleUpdateProject({ Status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <span>Priority: </span>
          <select
            value={priority}
            className="mb-4 mr-8 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleUpdateProject({ Priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </>
      ) : (
        <span></span>
      )}
      <table className="min-w-full bg-white border border-gray-300 rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-200">Task</th>
            <th className="px-4 py-2 bg-gray-200">Created At</th>
            <th className="px-4 py-2 bg-gray-200">Status</th>
            <th className="px-4 py-2 bg-gray-200">Due Date</th>
            <th className="px-4 py-2 bg-gray-200">Priority</th>
            <th className="px-4 py-2 bg-gray-200">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks(project.tasks).map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              projectId={project.id}
              members={members}
              handleEditTitle={handleEditTitle}
              handleEditDueDate={handleEditDueDate}
              updateTaskStatus={updateTaskStatus}
              updateTaskPriority={updateTaskPriority}
              handleAssignMemberToTask={handleAssignMemberToTask}
              deleteTask={deleteTask}
              listManager={listManager}
            />
          ))}
          {localStorage.getItem("userRole") === "User" ? (
            <></>
          ) : (
            <tr>
              <td
                colSpan={7}
                className="border px-4 py-2 text-center bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => addTask(project.id)}
              >
                ➕ Add Task
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
