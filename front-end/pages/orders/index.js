import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Get request
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:10000/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred");
      }
    };

    fetchOrders();
  }, []);

  // Post request to create order
  const handleCreateOrder = async () => {
    if (!userId || !totalAmount || !status) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:10000/createOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
          total_amount: parseFloat(totalAmount),
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Reset form fields
      setUserId("");
      setTotalAmount("");
      setStatus("");
      setError(null);

      // Refresh orders list
      const fetchResponse = await fetch("http://localhost:10000/orders");
      const data = await fetchResponse.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Error creating order");
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "shipped":
        return "text-blue-500";
      case "delivered":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Orders
        </h1>

        <div>
          <div className="gap-10">
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
              className="w-full h-12 bg-white text-black rounded border border-gray-300 outline-none"
            />
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Total Amount"
              className="w-full h-12 bg-white text-black rounded border border-gray-300 outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 mt-4 bg-white text-black rounded border border-gray-300 outline-none"
          >
            <option value="">Select Order Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

          <button
            onClick={handleCreateOrder}
            className="w-full mt-4 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Order</span>
          </button>
        </div>

        {/* Orders List */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Existing Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found</div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-lg p-5 shadow-md border border-gray-300"
              >
                <div className="space-y-2">
                  <p className="text-black">
                    <span className="text-gray-600">User ID:</span>{" "}
                    {order.user_id}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Total: ${order.total_amount}
                  </p>
                  <p className={`${getStatusColor(order.status)} font-medium`}>
                    Status: {order.status}
                  </p>
                  <div className="text-sm text-gray-600">
                    {new Date(order.order_date).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
