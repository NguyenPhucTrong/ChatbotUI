import React, { useState } from 'react';
import { MdSearch } from 'react-icons/md';

interface Task {
    id: number;
    title: string;
    status: string;
    dueDate: string;
    priority: string;
}

const priorityColors: { [key: string]: string } = {
    High: 'bg-red-500 text-white',
    Medium: 'bg-yellow-500 text-white',
    Low: 'bg-green-500 text-white',
};

const statusColors: { [key: string]: string } = {
    'In Progress': 'bg-blue-500 text-white',
    Pending: 'bg-orange-500 text-white',
    'Not Started': 'bg-gray-500 text-white',
    Completed: 'bg-green-500 text-white',
};

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: 'Design UI', status: 'In Progress', dueDate: '10/01/2024', priority: 'Low' },
        { id: 2, title: 'Develop Backend', status: 'Pending', dueDate: '15/01/2024', priority: 'High' },
        { id: 3, title: 'Test Application', status: 'Not Started', dueDate: '20/01/2024', priority: 'Medium' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [columns, setColumns] = useState<string[]>(['Task', 'Status', 'Due Date', 'Priority']);

    const updateTaskStatus = (id: number) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const statuses = ['Not Started', 'In Progress', 'Pending', 'Completed'];
                const currentIndex = statuses.indexOf(task.status);
                const nextIndex = (currentIndex + 1) % statuses.length;
                return { ...task, status: statuses[nextIndex] };
            }
            return task;
        }));
    };

    const updateTaskPriority = (id: number) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const priorities = ['Low', 'Medium', 'High'];
                const currentIndex = priorities.indexOf(task.priority);
                const nextIndex = (currentIndex + 1) % priorities.length;
                return { ...task, priority: priorities[nextIndex] };
            }
            return task;
        }));
    };

    const addTask = () => {
        const newTask: Task = {
            id: tasks.length + 1,
            title: 'New Task',
            status: 'Not Started',
            dueDate: '01/01/2025',
            priority: 'Low',
        };
        setTasks([...tasks, newTask]);
    };

    const addColumn = () => {
        const newColumn = prompt('Enter column name:');
        if (newColumn) {
            setColumns([...columns, newColumn]);
        }
    };

    const filteredTasks = tasks.filter(task => {
        return (filterStatus === 'All' || task.status === filterStatus) &&
            (filterPriority === 'All' || task.priority === filterPriority) &&
            task.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="p-6 flex-1 max-w-[1632px] mx-auto overflow-hidden">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Task Management</h1>

            {/* Search Input and Filter Options */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <MdSearch size={24} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <div className="flex flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full appearance-none pl-3 pr-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
                        >
                            <option value="All">All Statuses</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                            <option value="Not Started">Not Started</option>
                            <option value="Completed">Completed</option>
                        </select>
                        {/* Custom arrow icon */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            ▼
                        </div>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="w-full appearance-none pl-3 pr-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        {/* Custom arrow icon */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            ▼
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Task Button */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={addTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Add Task
                </button>

                {/* Add Column Button */}
                <button
                    onClick={addColumn}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Add Column
                </button>
            </div>

            {/* Task Table */}
            <div className="w-full overflow-x-auto mx-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className="border px-4 py-2 min-w-[300px]">{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2 min-w-[300px]">{task.title}</td>
                                <td
                                    className={`border px-4 py-2 cursor-pointer min-w-[300px] ${statusColors[task.status]}`}
                                    onClick={() => updateTaskStatus(task.id)}
                                >
                                    {task.status}
                                </td>
                                <td className="border px-4 py-2 min-w-[300px]">{task.dueDate}</td>
                                <td
                                    className={`border px-4 py-2 cursor-pointer min-w-[300px] ${priorityColors[task.priority]}`}
                                    onClick={() => updateTaskPriority(task.id)}
                                >
                                    {task.priority}
                                </td>
                                {columns.slice(4).map((column, index) => (
                                    <td key={index} className="border px-4 py-2 min-w-[300px]">
                                        -
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
            </div>
        </div>
    );
}
