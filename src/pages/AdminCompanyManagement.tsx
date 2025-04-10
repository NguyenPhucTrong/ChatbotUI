import React, { useEffect, useState } from 'react';
import { MdSearch, MdEdit, MdDelete } from 'react-icons/md';

interface Company {
    id: string;
    name: string;
    tenants: number;
    createdDate: string;
}

const AdminCompanyManagement = () => {
    const [companies, setCompanies] = useState<Company[]>([
        { id: 'COMP_01', name: 'ABC Corporation', tenants: 12, createdDate: '01/01/2024' },
        { id: 'COMP_02', name: 'XYZ Enterprise', tenants: 8, createdDate: '15/01/2024' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showOptions, setShowOptions] = useState<{ companyId: string | null }>({ companyId: null });

    useEffect(() => {
        if (showOptions.companyId !== null) {
            const timer = setTimeout(() => { setShowOptions({ companyId: null }) }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showOptions]);

    const addCompany = () => {
        const newCompany: Company = {
            id: `COMP_${companies.length + 1}`,
            name: 'New Company',
            tenants: 0,
            createdDate: new Date().toLocaleDateString(),
        };
        setCompanies([...companies, newCompany]);
    };

    const deleteCompany = (companyId: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this company?');
        if (confirmDelete) {
            setCompanies(companies.filter(company => company.id !== companyId));
        }
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOptions = (companyId: string) => {
        setShowOptions(prev => (prev.companyId === companyId ? { companyId: null } : { companyId }));
    };

    return (
        <div className="container mx-auto mt-8 p-6">
            <h1 className="text-3xl font-semibold my-6 text-gray-800">Company Management</h1>

            {/* Search Input and Add Company Button */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <MdSearch size={24} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <button
                    onClick={addCompany}
                    className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >
                    Add New Company
                </button>
            </div>

            {/* Company Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded shadow border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Company ID</th>
                            <th className="py-2 px-4 border-b">Company Name</th>
                            <th className="py-2 px-4 border-b">Tenants</th>
                            <th className="py-2 px-4 border-b">Created Date</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCompanies.map(company => (
                            <tr key={company.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-center">{company.id}</td>
                                <td className="py-2 px-4 border-b text-center">{company.name}</td>
                                <td className="py-2 px-4 border-b text-center">{company.tenants}</td>
                                <td className="py-2 px-4 border-b text-center">{company.createdDate}</td>
                                <td className="py-2 px-4 border-b text-center relative">
                                    <div className="flex items-center justify-center">
                                        <span 
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-300 cursor-pointer leading-none"
                                            onClick={() => toggleOptions(company.id)}
                                        >
                                            ...
                                        </span>
                                        {showOptions.companyId === company.id && (
                                            <div className="absolute top-full right-0 w-32 bg-white text-black shadow-lg rounded-lg z-50">
                                                <ul className="divide-y divide-gray-200">
                                                    <li className="p-3 hover:bg-gray-100 cursor-pointer flex items-center">
                                                        <MdEdit className="mr-2" /> Edit
                                                    </li>
                                                    <li 
                                                        className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                                                        onClick={() => deleteCompany(company.id)}
                                                    >
                                                        <MdDelete className="mr-2" /> Delete
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <span>Showing 1 to {filteredCompanies.length} of {companies.length} total records</span>
                <div className="flex justify-end">
                    <button className="border border-gray-300 text-gray-500 px-3 py-1 rounded-md bg-white hover:bg-gray-100">
                        {"<"}
                    </button>
                    <button className="border border-gray-300 text-white px-3 py-1 rounded-md bg-black">
                        1
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md bg-white hover:bg-gray-100">
                        2
                    </button>
                    <button className="border border-gray-300 text-gray-500 px-3 py-1 rounded-md bg-white hover:bg-gray-100">
                        {">"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCompanyManagement;
