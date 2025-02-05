import React, { useState } from 'react';
import { MdSearch } from 'react-icons/md';

interface Task {
    id: number;
    title: string;
    status: string;
    dueDate: string;
    priority: string;
}

interface Table {
    id: number;
    name: string;
    tasks: Task[];
    columns: string[];
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
const defaultTasks: Task[] = [
    { id: 1, title: 'Design UI', status: 'In Progress', dueDate: '10/01/2024', priority: 'Low' },
    { id: 2, title: 'Develop Backend', status: 'Pending', dueDate: '15/01/2024', priority: 'High' },
    { id: 3, title: 'Test Application', status: 'Not Started', dueDate: '20/01/2024', priority: 'Medium' },
];
export default function ProjectManagement() {
    const [tables, setTables] = useState<Table[]>([
        {
            id: 1,
            name: 'Default Table',
            tasks: defaultTasks,
            columns: ['Task', 'Status', 'Due Date', 'Priority'],
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');

    const updateTaskStatus = (tableId: number, taskId: number) => {
        setTables(tables.map(table => {
            if (table.id === tableId) {
                return {
                    ...table,
                    tasks: table.tasks.map(task => {
                        if (task.id === taskId) {
                            const statuses = ['Not Started', 'In Progress', 'Pending', 'Completed'];
                            const currentIndex = statuses.indexOf(task.status);
                            const nextIndex = (currentIndex + 1) % statuses.length;
                            return { ...task, status: statuses[nextIndex] };
                        }
                        return task;
                    }),
                };
            }
            return table;
        }));
    };

    const updateTaskPriority = (tableId: number, taskId: number) => {
        setTables(tables.map(table => {
            if (table.id === tableId) {
                return {
                    ...table,
                    tasks: table.tasks.map(task => {
                        if (task.id === taskId) {
                            const priorities = ['Low', 'Medium', 'High'];
                            const currentIndex = priorities.indexOf(task.priority);
                            const nextIndex = (currentIndex + 1) % priorities.length;
                            return { ...task, priority: priorities[nextIndex] };
                        }
                        return task;
                    }),
                };
            }
            return table;
        }));
    };

    const addTask = (tableId: number) => {
        setTables(tables.map(table => {
            if (table.id === tableId) {
                const newTask: Task = {
                    id: table.tasks.length + 1,
                    title: 'New Task',
                    status: 'Not Started',
                    dueDate: '01/01/2025',
                    priority: 'Low',
                };
                return { ...table, tasks: [...table.tasks, newTask] };
            }
            return table;
        }));
    };

    const addColumn = (tableId: number) => {
        const newColumn = prompt('Enter column name:');
        if (newColumn) {
            setTables(tables.map(table => {
                if (table.id === tableId) {
                    return { ...table, columns: [...table.columns, newColumn] };
                }
                return table;
            }));
        }
    };

    const createNewTable = () => {
        const tableName = prompt('Enter table name:');
        if (tableName) {
            setTables([...tables, { id: tables.length + 1, name: tableName, tasks: [...defaultTasks], columns: ['Task', 'Status', 'Due Date', 'Priority'] }]);
        }
    };

    const filteredTasks = (tasks: Task[]) => {
        return tasks.filter(task => {
            return (filterStatus === 'All' || task.status === filterStatus) &&
                (filterPriority === 'All' || task.priority === filterPriority) &&
                task.title.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    return (
        <div className="  p-6 flex-1 max-w-[1632px] mx-auto overflow-hidden">
            <h1 className="text-3xl font-semibold my-6 text-gray-800">Task Management</h1>

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


                {/* Create New Table Button */}
                <button
                    onClick={createNewTable}
                    className="bg-purple-500 text-white px-6 py-4 rounded-lg hover:bg-purple-700"
                >
                    Create New Table
                </button>
            </div>

            {/* Task Table */}
            {tables.map((table) => (
                <div key={table.id} className="w-full overflow-x-auto mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">{table.name}</h2>
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => addTask(table.id)}
                            className="bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-700"
                        >
                            Add Task
                        </button>
                        <button
                            onClick={() => addColumn(table.id)}
                            className="bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-700"
                        >
                            Add Column
                        </button>
                    </div>
                    <table className="min-w-full bg-white border border-gray-300 rounded shadow border-collapse">
                        <thead>
                            <tr>
                                {table.columns.map((column, index) => (
                                    <th key={index} className=" px-4 py-2 min-w-[333px] bg-gray-300">{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks(table.tasks).map(task => (
                                <tr key={task.id} className="hover:bg-gray-100">
                                    <td className=" border-b px-4 py-2 text-center min-w-[333px]">{task.title}</td>
                                    <td className=" border-b px-6 py-4 text-center cursor-pointer " onClick={() => updateTaskStatus(table.id,task.id)}>
                                        <span className={`px-4 py-2 rounded-full ${statusColors[task.status]}`}>{task.status}</span>
                                    </td>
                                    <td className=" border-b px-6 py-4 text-center min-w-[333px]">{task.dueDate}</td>
                                    <td className=" border-b px-6 py-4 cursor-pointer text-center" onClick={() => updateTaskPriority(table.id,task.id)}>
                                        <span className={`px-4 py-2 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
                                    </td>
                                    {table.columns.slice(4).map((column, index) => (
                                        <td key={index} className="border px-6 py-4 text-center min-w-[333px]">
                                            -
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                </div>
            ))}
        </div>
    );
}
