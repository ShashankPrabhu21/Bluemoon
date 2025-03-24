 "use client";
import { useState, useEffect } from "react";
import CustomerUserSidebar from "@/app/components/customersidebar";

// Usage:
<CustomerUserSidebar />


// Define TypeScript type for roles
type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export default function RolesPermissions() {
  // Explicitly define roles as an array of Role objects
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState<Role>({
    id: "",
    name: "",
    description: "",
    permissions: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRoleId, setEditRoleId] = useState<string | null>(null);

  // Fetch roles from the database
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/customerrole");
      const data: Role[] = await res.json(); // Explicitly specify data type
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleSaveRole = async () => {
    if (!newRole.name) return;
  
    const method = isEditMode ? "PUT" : "POST";
    const body = isEditMode
      ? { ...newRole, id: editRoleId, user_type: "Customer" } // Include user_type when editing
      : { ...newRole, user_type: "Customer" }; // Include user_type when creating
  
    try {
      const res = await fetch("/api/customerrole", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (res.ok) {
        fetchRoles(); // Refresh the roles list
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const res = await fetch("/api/customerrole", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchRoles();
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const openModal = () => {
    setNewRole({ id: "", name: "", description: "", permissions: [] });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditRoleId(null);
  };

  return (
    <div className="flex min-h-screen">
      <CustomerUserSidebar />
      <div className="mt-32 flex-1 p-8">
        <h1 className="text-4xl font-bold text-blue-900 text-center">🔐 Customer Roles & Permissions</h1>

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
                <th className="p-3">Permissions</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-t">
                  <td className="p-3 text-center">{role.name}</td>
                  <td className="p-3 text-center">{role.description}</td>
                  <td className="p-3 text-center">{role.permissions.join(", ")}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setNewRole(role);
                        setEditRoleId(role.id);
                        setIsEditMode(true);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600"
                    >
                      ✏ Edit
                    </button>
                    {role.name !== "Admin" && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
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
              />
              <input
                type="text"
                placeholder="Enter permissions (comma-separated)"
                className="w-full mt-2 p-2 border border-gray-300 rounded"
                value={newRole.permissions.join(", ")}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    permissions: e.target.value.split(",").map((p) => p.trim()),
                  })
                }
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