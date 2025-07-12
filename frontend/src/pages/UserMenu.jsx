import React, { useState } from 'react';
const UserMenu = () => {
    return (
        <div className="flex items-center">
            <span className="mr-2">{user.name}</span>
            <div className="relative group">
                <button className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center">
                    {user.name.charAt(0)}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-700">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <hr />
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                </div>
            </div>
        </div>
)
}

export default UserMenu;