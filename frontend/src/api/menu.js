const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class MenuAPI {
  async createMenu(menuData) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(menuData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create menu API error:", error);
      throw error;
    }
  }

  async getChefMenus(page = 1, limit = 10, date = null, status = null) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (date) params.append("date", date);
      if (status) params.append("status", status);

      const response = await fetch(
        `${API_BASE_URL}/menu/chef/my-menus?${params}`,
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
      console.error("Get chef menus API error:", error);
      throw error;
    }
  }

  async getAvailableMenus(
    page = 1,
    limit = 10,
    date = null,
    area = null,
    cuisine = null
  ) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (date) params.append("date", date);
      if (area) params.append("area", area);
      if (cuisine) params.append("cuisine", cuisine);

      const response = await fetch(`${API_BASE_URL}/menu/available?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get available menus API error:", error);
      throw error;
    }
  }

  async getMenuById(menuId) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${menuId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get menu by ID API error:", error);
      throw error;
    }
  }

  async updateMenu(menuId, menuData) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${menuId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(menuData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update menu API error:", error);
      throw error;
    }
  }

  async deleteMenu(menuId) {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${menuId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Delete menu API error:", error);
      throw error;
    }
  }
}

export default new MenuAPI();
