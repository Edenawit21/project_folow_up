export interface MenuItem {
  id: number;
  name: string;
  url: string | null;
  icon: string | null;
  order: number | null;
  parentId: number | null;
  children: MenuItem[];
  requiredPermission: string | null; 
  content: string | null;
}


export interface CreateMenuItem {
  Name: string | null;
  Url: string | null;
  Icon: string | null;
  RequiredPrivilege: string | null; 
  ParentId: number | null;
  Order: number | null;
}


export interface UpdateMenuItemPayload {
  Id: number; 
  Name: string | null; 
  Url: string | null;
  Icon: string | null;
  RequiredPrivilege: string | null;
  ParentId: number | null;
  Order: number | null;
  
}

export interface MenuItemApiResponse {
  success: boolean;
  message: string;
  data: MenuItem[] | MenuItem;
}

export interface MenuListProps {
  onAddMenu: () => void; // A function that takes no arguments and returns nothing
  onEditMenu: (id: number) => void;
}