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
  
  url?: string;
  icon?: string | React.ReactNode;
  requiredPrivilege?: string;
  order?: number;
  children?: MenuItem[]; 
}

export interface MenuItemApiResponse {
  success: string;
  data: MenuItem[]
}

export interface CreateMenuProps {
  onCreate: (item: MenuItem) => void;
  onCancel?: () => void;
  parentId?: string | number;
}


export interface payloadToSend{
   Id: number; 
  Name: string | null; 
  Url: string | null;
  Icon: string | null;
  RequiredPrivilege: string | null;
  ParentId: number | null;
  Order: number | null;
  url?: string;
  icon?: string | React.ReactNode;
  requiredPrivilege?: string;
  parentId: string | number;
  order?: number;
  children?: MenuItem[]; 
}