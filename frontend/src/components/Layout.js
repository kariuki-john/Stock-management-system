// Layout.jsx
import React from 'react';
import Sidebar from './Sidebar/sidebarComponent';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="ml-64 flex-1 p-6">{children}</main>
        </div>
    );
};

export default Layout;
