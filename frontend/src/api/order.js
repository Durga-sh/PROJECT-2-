const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class OrderAPI {
  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create order API error:", error);
      throw error;
    }
  }

  async getCustomerOrders(page = 1, limit = 10, status = null) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) params.append("status", status);

      const response = await fetch(`${API_BASE_URL}/order/customer?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get customer orders API error:", error);
      throw error;
    }
  }

  async getChefOrders(page = 1, limit = 10, status = null, date = null) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) params.append("status", status);
      if (date) params.append("date", date);

      const response = await fetch(`${API_BASE_URL}/order/chef?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get chef orders API error:", error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get order by ID API error:", error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status, chefNotes = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status, chefNotes }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update order status API error:", error);
      throw error;
    }
  }

  async cancelOrder(orderId, reason = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Cancel order API error:", error);
      throw error;
    }
  }

  async addRating(orderId, rating, feedback = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${orderId}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ rating, feedback }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Add rating API error:", error);
      throw error;
    }
  }

  async getChefOrderStats(period = "week") {
    try {
      const response = await fetch(
        `${API_BASE_URL}/order/chef/stats?period=${period}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get chef order stats API error:", error);
      throw error;
    }
  }
}

export default new OrderAPI();
