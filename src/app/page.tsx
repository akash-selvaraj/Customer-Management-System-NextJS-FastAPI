'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SortIcon = ({ direction }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{
                fill: 'rgba(0, 0, 0, 1)',
                transform: direction === 'desc' ? 'rotate(180deg)' : '',
                msFilter: ''
            }}
        >
            <path d="M8 16H4l6 6V2H8zm6-11v17h2V8h4l-6-6z"></path>
        </svg>
    );
};

const Page = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        fav_number: ''
    });
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        setFilteredCustomers(customers);
    }, [customers]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        const filtered = customers.filter(customer => 
            customer.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            customer.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
            customer.fav_number.toString().toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredCustomers(filtered);
    };

    const addCustomer = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/customers', formData);
            fetchCustomers();
            setFormData({
                name: '',
                email: '',
                fav_number: ''
            });
            toast.success('Customer added successfully!');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error('Error adding customer: Duplicate customer email.');
            } else {
                console.error('Error adding customer:', error.message);
            }
        }
    };

    const deleteCustomer = async (email) => {
        try {
            await axios.delete(`http://localhost:8000/customers/${email}`);
            fetchCustomers();
            toast.success('Customer deleted successfully!');
        } catch (error) {
            console.error('Error deleting customer:', error.message);
        }
    };

    const editCustomer = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            fav_number: customer.fav_number
        });
    };

    const updateCustomer = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/customers/${editingCustomer.email}`, formData);
            fetchCustomers();
            setFormData({
                name: '',
                email: '',
                fav_number: ''
            });
            setEditingCustomer(null);
            toast.success('Customer updated successfully!');
        } catch (error) {
            console.error('Error updating customer:', error.message);
        }
    };

    const sortCustomers = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...filteredCustomers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredCustomers(sorted);
    };

    return (
        <div className="container mx-auto p-10 mt-8">
            <h1 className="text-3xl font-semibold mb-4">Customer Manager</h1>
            <form className="p-2 mb-4" onSubmit={editingCustomer ? updateCustomer : addCustomer}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-4 py-2 p-2 ml-2 mb-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-4 py-2 ml-2 mb-2"
                />
                <input
                    type="text"
                    name="fav_number"
                    placeholder="Favorite Number"
                    value={formData.fav_number}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-4 py-2 ml-2 mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md">{editingCustomer ? 'Update Customer' : 'Add Customer'}</button>
            </form>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border w-full border-gray-300 rounded-md px-4 py-2 mb-4"
            />
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th onClick={() => sortCustomers('name')} className="px-4 py-2 cursor-pointer">
                            <div className="flex items-center">
                                <p>Name</p> 
                                <SortIcon direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'} />
                            </div>
                        </th>
                        <th onClick={() => sortCustomers('email')} className="px-4 py-2 cursor-pointer">
                            <div className="flex items-center">
                                <p>Email</p> 
                                <SortIcon direction={sortConfig.key === 'email' ? sortConfig.direction : 'asc'} />
                            </div>
                        </th>
                        <th onClick={() => sortCustomers('fav_number')} className="px-4 py-2 cursor-pointer">
                            <div className="flex items-center">
                                <p>Favorite Number</p> 
                                <SortIcon direction={sortConfig.key === 'fav_number' ? sortConfig.direction : 'asc'} />
                            </div>
                        </th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map(customer => (
                        <tr key={customer.email}>
                            <td className="border px-4 py-2">{customer.name}</td>
                            <td className="border px-4 py-2">{customer.email}</td>
                            <td className="border px-4 py-2">{customer.fav_number}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => editCustomer(customer)} className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-md">Edit</button>
                                <button onClick={() => deleteCustomer(customer.email)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default Page;
