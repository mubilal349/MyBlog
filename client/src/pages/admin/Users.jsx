import React, { useState } from "react";

const UsersPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Bilal", role: "admin" },
    { id: 2, name: "Ali", role: "editor" },
  ]);

  const deleteUser = (id) => setUsers(users.filter((u) => u.id !== id));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="p-3">Name</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
