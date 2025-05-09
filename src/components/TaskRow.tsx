import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Task {
  id: number;
  title: string;
  createdAt: string;
  status: string;
  dueDate: string;
  priority: string;
  assignee: string;
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
}

interface Member {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  role: string; // UserRole trong ProjectMembers
}
interface TaskRowProps {
  task: Task;
  projectId: number;
  members: Member[];
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
}

const priorityColors: { [key: string]: string } = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-green-500 text-white",
};

const statusColors: { [key: string]: string } = {
  "In Progress": "bg-blue-500 text-white",
  Pending: "bg-orange-500 text-white",
  "Not Started": "bg-gray-500 text-white",
  Completed: "bg-green-500 text-white",
};
const TaskRow: React.FC<TaskRowProps> = ({
  task,
  projectId,
  members,
  handleEditTitle,
  handleEditDueDate,
  updateTaskStatus,
  updateTaskPriority,
  handleAssignMemberToTask,
  deleteTask,
}) => {
  const [isEditing, setIsEditing] = useState<{
    field: "title" | "dueDate" | null;
  }>({ field: null });
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDueDate, setEditedDueDate] = useState<Date | null>(
    task.dueDate ? new Date(task.dueDate) : null
  );
  return (
    <tr className="hover:bg-gray-100 text-center items-center">
      <td className="border-b px-6 py-4">
        {isEditing.field === "title" ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditTitle(projectId, task.id, editedTitle);
                setIsEditing({ field: null });
              }
            }}
            onBlur={() => {
              handleEditTitle(projectId, task.id, editedTitle);
              setIsEditing({ field: null });
            }}
            className="border px-2 py-1 rounded w-full"
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditing({ field: "title" })}
            className="cursor-pointer"
          >
            {task.title}
          </span>
        )}
      </td>
      <td className="border-b px-6 py-4">
        {new Date(task.createdAt).toLocaleString()}
      </td>
      <td className="border-b px-6 py-4">
        <select
          value={task.status}
          onChange={(e) => updateTaskStatus(projectId, task.id, e.target.value)}
          className={`${statusColors[task.status]}`}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </td>
      <td className="border-b px-6 py-4">
        {isEditing.field === "dueDate" ? (
          <ReactDatePicker
            selected={editedDueDate}
            onChange={(date) => setEditedDueDate(date as Date)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditDueDate(
                  projectId,
                  task.id,
                  editedDueDate ? editedDueDate.toISOString().split("T")[0] : ""
                );
                setIsEditing({ field: null });
              }
            }}
            onBlur={() => {
              handleEditDueDate(
                projectId,
                task.id,
                editedDueDate ? editedDueDate.toISOString().split("T")[0] : ""
              );
              setIsEditing({ field: null });
            }}
            className="border px-2 py-1 rounded w-full"
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditing({ field: "dueDate" })}
            className="cursor-pointer"
          >
            {task.dueDate}
          </span>
        )}
      </td>
      <td className="border-b px-6 py-4">
        <select
          value={task.priority}
          onChange={(e) =>
            updateTaskPriority(projectId, task.id, e.target.value)
          }
          className={`${priorityColors[task.priority]}`}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </td>
      <td className="border-b px-6 py-4">
        <select
          value={task.assignee || ""}
          onChange={(e) =>
            handleAssignMemberToTask(projectId, task.id, e.target.value)
          }
          className="border px-2 py-1 rounded w-full"
        >
          <option value="" disabled>
            Select Member
          </option>
          {members.map((member) => (
            <option key={member.id} value={member.fullname}>
              {member.fullname}
            </option>
          ))}
        </select>
      </td>
      <td className="border-b px-6 py-4">
        <button
          onClick={() => deleteTask(projectId, task.id)}
          className="text-red-500 hover:text-red-700"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default TaskRow;
