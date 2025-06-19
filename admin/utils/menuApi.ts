import axios from 'axios';
import { MenuItem, MenuItemApiResponse, CreateMenuItem, UpdateMenuItemPayload } from "@/types/menuTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
if (!API_BASE_URL) {
  console.error("NEXT_PUBLIC_BASE_API_URL is not defined. Please check your .env.local file.");
}


/*Fetches all menu items from the API.*/
export const fetchAllMenus = async (): Promise<MenuItem[]> => {
  try {
    const response = await axios.get<MenuItemApiResponse>(`${API_BASE_URL}/api/Menu/all`);

    
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      return [response.data.data];
    }
  } catch (error) {
    console.error("Error fetching all menus:", error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to fetch menus. Please check your network or API server."
        : "Failed to fetch menus. An unexpected error occurred."
    );
  }
};

export const fetchMenuById = async (id: number): Promise<MenuItem> => {
  try {
    const response = await axios.get<MenuItemApiResponse>(
      `${API_BASE_URL}/api/Menu/${id}`
    );

    

    let menuData: MenuItem;

    if (Array.isArray(response.data.data)) {
      
      menuData = response.data.data[0];
    } else {
      menuData = response.data.data;
    }
    return {
      ...menuData,
      url: menuData.url === '' ? null : menuData.url,
      icon: menuData.icon === '' ? null : menuData.icon,
      requiredPermission: menuData.requiredPermission === '' ? null : menuData.requiredPermission,
      order: menuData.order ?? null,
      parentId: menuData.parentId ?? null,
      children: menuData.children || [],
    };

  } catch (error) {
    console.error(`Error fetching menu item by ID ${id}:`, error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || `Failed to fetch menu item ${id}`
        : `Failed to fetch menu item ${id}. Please try again later.`
    );
  }
};

/* Creates a new menu item. */
export const createMenuItem = async (menuData: CreateMenuItem): Promise<void> => {
  try {
    const payloadToSend = {
        ...menuData,
        Url: menuData.Url === '' ? null : menuData.Url,
        Icon: menuData.Icon === '' ? null : menuData.Icon,
        RequiredPrivilege: menuData.RequiredPrivilege === '' ? null : menuData.RequiredPrivilege,
    };

    const response = await axios.post<MenuItemApiResponse>(`${API_BASE_URL}/api/Menu`, payloadToSend);
    
  } catch (error) {
    console.error("Error creating menu:", error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to create menu."
        : "Failed to create menu. Please try again later."
    );
  }
};

/* Updates an existing menu item. */
export const updateMenu = async (id: number, menuData: UpdateMenuItemPayload): Promise<void> => {
  try {
    const payloadToSend: UpdateMenuItemPayload = {
        Id: id,
        Name: menuData.Name === '' ? null : menuData.Name,
        Url: menuData.Url === '' ? null : menuData.Url,
        Icon: menuData.Icon === '' ? null : menuData.Icon,
        RequiredPrivilege: menuData.RequiredPrivilege === '' ? null : menuData.RequiredPrivilege,
        ParentId: menuData.ParentId,
        Order: menuData.Order,    
    };

    const response = await axios.put<MenuItemApiResponse>(`${API_BASE_URL}/api/Menu/${id}`, payloadToSend);
    
  } catch (error) {
    console.error(`Error updating menu ${id}:`, error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || `Failed to update menu ${id}.`
        : `Failed to update menu ${id}. Please try again later.`
    );
  }
};


/* Deletes a menu item by its ID. */
export const deleteMenuItem = async (id: number): Promise<void> => {
  try {
    const response = await axios.delete<MenuItemApiResponse>(`${API_BASE_URL}/api/Menu/${id}`);

    
  } catch (error) {
    console.error(`Error deleting menu ${id}:`, error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || `Failed to delete menu ${id}. Please check your network or API server.`
        : `Failed to delete menu ${id}. An unexpected error occurred.`
    );
  }
};