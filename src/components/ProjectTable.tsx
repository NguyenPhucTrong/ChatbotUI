import React from "react";
import TaskRow from "./TaskRow";

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
    handleEditTitle: (projectId: number, taskId: number, newTitle: string) => void;
    handleEditDueDate: (projectId: number, taskId: number, newDueDate: string) => void;
    updateTaskStatus: (projectId: number, taskId: number, newStatus: string) => void;
    updateTaskPriority: (projectId: number, taskId: number, newPriority: string) => void;
    handleAssignMemberToTask: (projectId: number, taskId: number, assignee: string) => void;
    deleteTask: (projectId: number, taskId: number) => void;
    addTask: (projectId: number) => void;
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
}) => {
    return (
        <div className="w-full overflow-x-auto mx-auto mt-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                <thead>
                    <tr>
                        <th className="px-4 py-2 bg-gray-200">Task</th>
                        <th className="px-4 py-2 bg-gray-200">Created At</th>
                        <th className="px-4 py-2 bg-gray-200">Status</th>
                        <th className="px-4 py-2 bg-gray-200">Due Date</th>
                        <th className="px-4 py-2 bg-gray-200">Priority</th>
                        <th className="px-4 py-2 bg-gray-200">Assignee</th>
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
                        />
                    ))}
                    <tr>
                        <td
                            colSpan={7}
                            className="border px-4 py-2 text-center bg-gray-200 hover:bg-gray-300 cursor-pointer"
                            onClick={() => addTask(project.id)}
                        >
                            ➕ Add Task
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTable;