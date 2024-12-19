import { useState, useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:10000/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      setUsers(await response.json());
      setError(null);
    } catch (err) {
      setError(err.message || "Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    if (Object.values(form).some((field) => !field)) {
      setError("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:10000/createUsers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to create user");
      setForm({ name: "", email: "", password: "" });
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Error creating user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>
        <div>
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              type={key === "password" ? "password" : "text"}
              value={form[key]}
              onChange={handleFormChange}
              className="w-full p-2 mb-2 bg-white rounded border border-black text-black"
            />
          ))}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            onClick={handleCreateUser}
            disabled={isLoading}
            className="w-full bg-blue-600 p-2 rounded text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Create User"}
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center"></h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          <ul>
            {users.map(({ user_id, username, email }) => (
              <li
                key={user_id}
                className="bg-gray-100 p-4 mb-2 rounded border border-gray-300"
              >
                <h3 className="text-lg">{username}</h3>
                <p className="text-gray-600">{email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
