import AdminUserSidebar from "@/app/components/AdminUserSidebar";

export default function UserEditing() {
  return (
    <div className="flex min-h-screen">
      <AdminUserSidebar />
      <div className="mt-32 flex-1 flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold text-blue-900">✏️ User Creation & Editing</h1>
          <p className="mt-4 text-lg text-gray-700">
            Admins can add, edit, activate, or deactivate users.
          </p>
        </div>
      </div>
    </div>
  );
}
