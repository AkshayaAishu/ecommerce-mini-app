import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👑 Admin Dashboard</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h4>Order ID: {order.id}</h4>
          <p>Status: {order.status}</p>
          <p>Total: ₹ {order.total_amount}</p>

          {order.status === "Pending" && (
            <>
              <button onClick={() => updateStatus(order.id, "Confirmed")}>
                ✅ Confirm
              </button>

              <button
                onClick={() => updateStatus(order.id, "Cancelled")}
                style={{ marginLeft: "10px" }}
              >
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;