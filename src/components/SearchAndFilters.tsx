import React from "react";

interface SearchAndFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterStatus: string;
    setFilterStatus: (value: string) => void;
    filterPriority: string;
    setFilterPriority: (value: string) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm"
            >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Not Started">Not Started</option>
                <option value="Completed">Completed</option>
            </select>
            <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm"
            >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
        </div>
    );
};

export default SearchAndFilters;