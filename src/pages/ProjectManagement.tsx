import React, { useEffect, useState } from 'react';
import { MdSearch, MdEdit, MdDelete } from 'react-icons/md';

interface Task {
    id: number;
    title: string;
    status: string;
    dueDate: string;
    priority: string;
    assignee: string;

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
    { id: 1, title: 'Design UI', status: 'In Progress', dueDate: '10/01/2024', priority: 'Low', assignee: 'John Doe' },
    { id: 2, title: 'Develop Backend', status: 'Pending', dueDate: '15/01/2024', priority: 'High', assignee: 'Jane Smith' },
    { id: 3, title: 'Test Application', status: 'Not Started', dueDate: '20/01/2024', priority: 'Medium', assignee: 'Alice Johnson' },

];
export default function ProjectManagement() {
    const [tables, setTables] = useState<Table[]>([
        {
            id: 1,
            name: 'Default Table',
            tasks: defaultTasks,
            columns: ['Task', 'Status', 'Due Date', 'Priority', 'Assignee'],
        },
    ]);

    const [isEditing, setIsEditing] = useState<{ tableId: number | null, taskId: number | null }>();
    const [editAssignee, setEditAssignee] = useState('');


    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [showOptions, setShowOptions] = useState<{ tableId: number | null, taskId: number | null }>({ tableId: null, taskId: null });



    const startEditing = (tableId: number, taskId: number, currentAssignee: string) => {
        setIsEditing({ tableId, taskId });
        setEditAssignee(currentAssignee);
    }

    const handleEditAssignee = (tableId: number, taskId: number, newAssignee: string) => {
        setTables(tables.map(table => {
            if (table.id === tableId) {
                return {
                    ...table,
                    tasks: table.tasks.map(task => {
                        if (task.id === taskId) {
                            return { ...task, assignee: newAssignee };
                        }
                        return task;
                    }),
                };
            }
            return table;
        }));
        setIsEditing({ tableId: null, taskId: null });
    };


    useEffect(() => {
        if (showOptions !== null) {
            const timber = setTimeout(() => { setShowOptions({ tableId: null, taskId: null }) }, 2000);
            return () => clearTimeout(timber);
        }

    }, [showOptions]);


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
                    assignee: 'Unassigned',

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

    const toggleOptions = (tableId: number, taskId: number) => {
        setShowOptions(prev => (prev.tableId === tableId && prev.taskId === taskId ? { tableId: null, taskId: null } : { tableId, taskId })); // Nếu đang mở thì đóng, nếu chưa mở thì mở
    }

    return (
        <div className="  p-6 flex-1 max-w-[1493px] mx-auto overflow-hidden">
            <h1 className="text-3xl font-semibold my-6 text-gray-800">Task Management</h1>

            {/* Search Input and Filter Options */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="flex gap-4 ">


                    {/* Create New Table Button */}
                    <button
                        onClick={createNewTable}
                        className=" bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Create New Table
                    </button>
                </div>
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




            {/* Task Table */}
            {tables.map((table) => (
                <div key={table.id} className="w-full overflow-x-auto mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">{table.name}</h2>

                    <table className="min-w-full bg-white border border-gray-300 rounded shadow border-collapse">
                        <thead>
                            <tr>
                                {table.columns.map((column, index) => (
                                    <th key={index} className=" px-4 py-2 min-w-[333px] bg-gray-200">{column}</th>
                                ))}
                                {/* Thêm cột Add Column */}
                                <th className="border  px-4 py-2 min-w-[200px] bg-gray-300 text-center cursor-pointer hover:bg-gray-400"
                                    onClick={() => addColumn(table.id)}>
                                    ➕ Add Column
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks(table.tasks).map(task => (
                                <tr key={task.id} className="hover:bg-gray-100">
                                    <td className=" border-b px-6 py-4  text-center min-w-[333px]">{task.title}</td>
                                    <td className=" border-b px-6 py-4 text-center cursor-pointer " onClick={() => updateTaskStatus(table.id, task.id)}>
                                        <span className={`px-4 py-2 rounded-full ${statusColors[task.status]}`}>{task.status}</span>
                                    </td>
                                    <td className=" border-b px-6 py-4 text-center min-w-[333px]">{task.dueDate}</td>
                                    <td className=" border-b px-6 py-4 cursor-pointer text-center" onClick={() => updateTaskPriority(table.id, task.id)}>
                                        <span className={`px-4 py-2 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
                                    </td>
                                    {
                                        isEditing?.tableId === table.id && isEditing?.taskId === task.id ? (
                                            <td className=' border-b px-6 py-4 text-center min-w-[333px]'>
                                                <input
                                                    type="text"
                                                    value={editAssignee}
                                                    onChange={(e) => setEditAssignee(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleEditAssignee(table.id, task.id, e.currentTarget.value);
                                                            setIsEditing({ tableId: null, taskId: null });
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        handleEditAssignee(table.id, task.id, editAssignee);
                                                    }
                                                    }
                                                    className="border  px-2 py-1 rounded "
                                                />
                                            </td>
                                        ) : (
                                            <td className=' border-b px-6 py-4 text-center min-w-[333px] cursor-pointer'
                                                onClick={() => startEditing(table.id, task.id, task.assignee)}>
                                                {task.assignee}
                                            </td>
                                        )
                                    }
                                    {/* <td className=' border-b px-6 py-4 text-center min-w-[333px]'> {task.assignee} </td> */}


                                    {
                                        table.columns.slice(5).map((column, index) => (

                                            <td key={index} className="border-b px-6 py-4 text-center min-w-[333px]">
                                                -
                                            </td>
                                        ))
                                    }
                                    <td className="border px-4 py-2 text-center relative">
                                        <div className="flex items-center justify-center">
                                            <span className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-300 cursor-pointer leading-none"
                                                onClick={() => toggleOptions(table.id, task.id)}
                                            >
                                                ...
                                            </span>
                                            {showOptions.tableId === table.id && showOptions.taskId === task.id && (
                                                <div className="absolute -top-20 right-0 w-32 bg-white text-black shadow-lg rounded-lg z-10">
                                                    <ul>
                                                        <li className="p-3 hover:bg-gray-100 cursor-pointer flex items-center">
                                                            <MdEdit className="mr-2" /> Edit
                                                        </li>
                                                        <li className="p-3 hover:bg-gray-100 cursor-pointer flex items-center">
                                                            <MdDelete className="mr-2" /> Delete
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </td>



                                </tr >
                            ))
                            }

                            {/* Thêm hàng Add Task */}
                            <tr className="hover:bg-gray-100 cursor-pointer">
                                <td colSpan={table.columns.length + 1} className="border px-4 py-2 text-center bg-gray-200 hover:bg-gray-300"
                                    onClick={() => addTask(table.id)}>
                                    ➕ Add Task
                                </td>
                            </tr>
                        </tbody >
                    </table >
                    <br />
                </div >
            ))
            }
        </div >

    );
}
