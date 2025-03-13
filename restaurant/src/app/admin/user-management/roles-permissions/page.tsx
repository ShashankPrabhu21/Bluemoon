"use client";
import { useState, useEffect } from "react";
import AdminUserSidebar from "@/app/components/AdminUserSidebar";

export default function RolesPermissions() {
  const LOCAL_STORAGE_KEY = "user_roles";

  // Load roles from local storage
  const loadRoles = () => {
    const storedRoles = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedRoles ? JSON.parse(storedRoles) : [];
  };

  const [roles, setRoles] = useState<{ name: string; description: string; permissions: string[] }[]>(loadRoles());
  
  const [newRole, setNewRole] = useState<{ name: string; description: string; permissions: string[] }>({
    name: "",
    description: "",
    permissions: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Save roles to local storage whenever roles change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roles));
  }, [roles]);

  // Open Create Role Modal
  const openModal = () => {
    setNewRole({ name: "", description: "", permissions: [] });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditIndex(null);
  };

  // Create or Update Role
  const handleSaveRole = () => {
    if (!newRole.name) return;

    if (isEditMode && editIndex !== null) {
      const updatedRoles = [...roles];
      updatedRoles[editIndex] = newRole;
      setRoles(updatedRoles);
    } else {
      setRoles([...roles, newRole]);
    }

    closeModal();
  };

  // Open Edit Modal
  const handleEditRole = (index: number) => {
    setNewRole(roles[index]); // Preserve permissions
    setEditIndex(index);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Delete Role
  const handleDeleteRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen">
      <AdminUserSidebar />
      <div className="mt-32 flex-1 p-8">
        <h1 className="text-4xl font-bold text-blue-900 text-center">🔐 User Roles & Permissions</h1>
        <p className="mt-4 text-lg text-gray-700 text-center">
          Manage role-based access control for Admin, Manager, Staff, and Customers.
        </p>

        {/* Create Role Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={openModal}
            className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition"
          >
            + Create Role
          </button>
        </div>

        {/* Roles Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="p-3">Role Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Permissions Assigned</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 text-center">{role.name}</td>
                  <td className="p-3 text-center">{role.description}</td>
                  <td className="p-3 text-center">{role.permissions.join(", ")}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleEditRole(index)} className="text-blue-600">
                      ✏ Edit
                    </button>
                    {role.name !== "Admin" && (
                      <button
                        onClick={() => handleDeleteRole(index)}
                        className="text-red-600 ml-4"
                      >
                        ❌ Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create/Edit Role Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-2xl font-bold">{isEditMode ? "Edit Role" : "Create Role"}</h2>
              <input
                type="text"
                placeholder="Role Name"
                className="w-full mt-4 p-2 border border-gray-300 rounded"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              ></textarea>
              
              {/* Permissions Input */}
              <input
                type="text"
                placeholder="Enter permissions (comma-separated)"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={newRole.permissions.join(", ")}
                onChange={(e) => setNewRole({ ...newRole, permissions: e.target.value.split(",").map(p => p.trim()) })}
              />

              <div className="flex justify-end mt-4">
                <button onClick={closeModal} className="mr-2 px-4 py-2 bg-gray-400 rounded">
                  Cancel
                </button>
                <button onClick={handleSaveRole} className="px-4 py-2 bg-blue-800 text-white rounded">
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
