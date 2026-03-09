import React, { useState } from "react";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const users = [
    { id: 1, name: "John Doe", role: "Admin", status: true },
    { id: 2, name: "Jane Smith", role: "User", status: false },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    alert("Toggle user status for ID: " + id);
  };

  const saveChanges = () => {
    alert("Changes saved!");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🔐 User Management</h2>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", flex: 1 }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>

        <button onClick={() => setShowModal(true)}>➕ Add User</button>
      </div>

      {/* User Table */}
      <div style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
        <table width="100%" cellPadding="10">
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th align="left">Name</th>
              <th align="left">Role</th>
              <th align="left">Status</th>
              <th align="left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{user.name}</td>
                <td>
                  <span
                    style={{
                      background: "#eee",
                      padding: "4px 8px",
                      borderRadius: "5px",
                    }}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  <input
                    type="checkbox"
                    checked={user.status}
                    onChange={() => toggleStatus(user.id)}
                  />
                </td>

                <td>
                  <button onClick={() => alert("Edit user " + user.id)}>
                    ✏ Edit
                  </button>

                  <button
                    onClick={() => alert("Delete user " + user.id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={saveChanges}>💾 Save Changes</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>Add New User</h3>

            <input
              type="text"
              placeholder="Full Name"
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <select
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            >
              <option>Admin</option>
              <option>User</option>
            </select>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => alert("User added!")}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}