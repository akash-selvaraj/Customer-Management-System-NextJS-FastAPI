"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Direction = "asc" | "desc" | "none";

interface SortIconProps {
  direction: Direction;
}

const SortIcon: React.FC<SortIconProps> = ({ direction }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={{
        fill: "rgba(0, 0, 0, 1)",
        transform: direction === "desc" ? "rotate(180deg)" : "",
        msFilter: "",
      }}
    >
      <path d="M8 16H4l6 6V2H8zm6-11v17h2V8h4l-6-6z"></path>
    </svg>
  );
};

interface Customer {
  name: string;
  email: string;
  fav_number: string;
  active: boolean;
}

const Page: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<Customer>({
    name: "",
    email: "",
    fav_number: "",
    active: true,
  });
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: Direction }>({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/customers");
      setCustomers(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
        toast.error("Error fetching customers: " + ((error.response?.data as any).message || "Unknown error"));
      } else {
        console.error("Error message:", (error as Error).message);
        toast.error("Error fetching customers");
      }
    }
  };

  const isAxiosError = (error: unknown): error is AxiosError => {
    return axios.isAxiosError(error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        customer.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        customer.fav_number.toString().toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/customers", formData);
      fetchCustomers();
      setFormData({
        name: "",
        email: "",
        fav_number: "",
        active: true,
      });
      toast.success("Customer added successfully!");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Error adding customer: Duplicate customer email.");
        } else {
          toast.error(`Error adding customer: ${(error.response?.data as any).message || "Unknown error"}`);
        }
      } else {
        console.error("Error message:", (error as Error).message);
        toast.error("Error adding customer");
      }
    }
  };

  const deleteCustomer = async (email: string) => {
    try {
      await axios.delete(`http://localhost:8000/customers/${email}`);
      fetchCustomers();
      toast.success("Customer deleted successfully!");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`Error deleting customer: ${(error.response?.data as any).message || "Unknown error"}`);
      } else {
        console.error("Error message:", (error as Error).message);
        toast.error("Error deleting customer");
      }
    }
  };

  const editCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      fav_number: customer.fav_number,
      active: customer.active,
    });
  };

  const updateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/customers/${editingCustomer?.email}`, formData);
      fetchCustomers();
      setFormData({
        name: "",
        email: "",
        fav_number: "",
        active: true,
      });
      setEditingCustomer(null);
      toast.success("Customer updated successfully!");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`Error updating customer: ${(error.response?.data as any).message || "Unknown error"}`);
      } else {
        console.error("Error message:", (error as Error).message);
        toast.error("Error updating customer");
      }
    }
  };

  const toggleCustomerStatus = async (email: string, currentStatus: boolean) => {
    try {
      await axios.put(`http://localhost:8000/customers/toggle/${email}`);
      fetchCustomers();
      toast.success(`Customer status updated to ${!currentStatus ? "active" : "inactive"}`);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`Error toggling customer status: ${(error.response?.data as any).message || "Unknown error"}`);
      } else {
        console.error("Error message:", (error as Error).message);
        toast.error("Error toggling customer status");
      }
    }
  };

  const sortCustomers = (key: keyof Customer) => {
    let direction: Direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCustomers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCustomers(sorted);
  };

  return (
    <div>
      <div className="navbar bg-base-300">
        <button className="btn btn-ghost text-xl">Customer Management</button>
      </div>
      <div className="container mx-auto p-2 mt-8">
        <div className="flex flex-wrap justify-between items-center">
          <form
            className="flex flex-wrap items-center"
            onSubmit={editingCustomer ? updateCustomer : addCustomer}
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-4 py-2 mb-2 mr-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-4 py-2 mb-2 mr-2"
            />
            <input
              type="text"
              name="fav_number"
              placeholder="Favorite Number"
              value={formData.fav_number}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-4 py-2 mb-2 mr-2"
            />
            <button
              type="submit"
              className="btn btn-primary text-white px-4 py-2 mb-2 rounded-md"
            >
              {editingCustomer ? "Update Customer" : "Add Customer"}
            </button>
          </form>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-4 py-2 mb-2"
          />
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th></th>
                <th onClick={() => sortCustomers("name")} className="cursor-pointer">
                  <div className="flex items-center">
                    <p>Name</p>
                    <SortIcon direction={sortConfig.key === "name" ? sortConfig.direction : "asc"} />
                  </div>
                </th>
                <th onClick={() => sortCustomers("email")} className="cursor-pointer">
                  <div className="flex items-center">
                    <p>Email</p>
                    <SortIcon direction={sortConfig.key === "email" ? sortConfig.direction : "asc"} />
                  </div>
                </th>
                <th onClick={() => sortCustomers("fav_number")} className="cursor-pointer">
                  <div className="flex items-center">
                    <p>Favorite Number</p>
                    <SortIcon
                      direction={sortConfig.key === "fav_number" ? sortConfig.direction : "asc"}
                    />
                  </div>
                </th>
                <th onClick={() => sortCustomers("active")} className="cursor-pointer">
                  <div className="flex items-center">
                    <p>Active</p>
                    <SortIcon direction={sortConfig.key === "active" ? sortConfig.direction : "asc"} />
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.email}>
                  <th>{index + 1}</th>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.fav_number}</td>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={customer.active}
                        onChange={() => toggleCustomerStatus(customer.email, customer.active)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td>
                    <button
                      onClick={() => editCustomer(customer)}
                      className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer.email)}
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Page;

