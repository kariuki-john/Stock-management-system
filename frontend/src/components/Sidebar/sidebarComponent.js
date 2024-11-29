import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink allows highlighting active links

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white shadow-md h-full fixed">
            <div className="p-6 text-xl font-bold border-b">Dashboard</div>
            <nav>
                <ul>
                    {/* Dashboard Link */}
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-4 py-3 block ${
                                    isActive
                                        ? 'bg-purple-500 text-white font-semibold'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    {/* Other Links */}
                    <li>
                        
                    </li>
                    <li>
                        <NavLink
                            to="/add-product"
                            className={({ isActive }) =>
                                `px-4 py-3 block ${
                                    isActive
                                        ? 'bg-purple-500 text-white font-semibold'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`
                            }
                        >
                            Add Product
                        </NavLink>
                    </li>
                    <li>
                        
                    </li>
                    <li>
                        <NavLink
                            to="/add-payment"
                            className={({ isActive }) =>
                                `px-4 py-3 block ${
                                    isActive
                                        ? 'bg-purple-500 text-white font-semibold'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`
                            }
                        >
                            Record Payment
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/sales"
                            className={({ isActive }) =>
                                `px-4 py-3 block ${
                                    isActive
                                        ? 'bg-purple-500 text-white font-semibold'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`
                            }
                        >
                            Make Sale
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
