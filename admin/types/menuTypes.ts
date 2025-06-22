export interface MenuItem {
  id: number;
  name: string;
  url: string;
  icon: string;
  order: number;
  parentId: number;
  children: MenuItem[];
  requiredPrivilege: string;
  content: string;
}

export interface CreateMenuItem {
  Name: string;
  Url: string;
  Icon: string;
  requiredPrivilege: string;
  ParentId: number;
  Order: number;
}

export interface UpdateMenuItemPayload {
  Id: number;
  Name: string;
  Url: string;
  Icon: string;
  RequiredPrivilege: string;
  ParentId: number;
  Order: number;

  url?: string;
  icon?: string | React.ReactNode;
  requiredPrivilege?: string;
  order?: number;
  children?: MenuItem[];
}

export interface MenuItemApiResponse {
  success: string;
  data: MenuItem[];
}

export interface CreateMenuProps {
  onCreate: (item: MenuItem) => void;
  onCancel?: () => void;
  parentId?: string | number;
}

export interface payloadToSend {
  Id: number;
  Name: string;
  Url: string;
  Icon: string;
  RequiredPrivilege: string;
  ParentId: number;
  Order: number;
  url?: string;
  icon?: string | React.ReactNode;
  requiredPrivilege?: string;
  parentId: string | number;
  order?: number;
  children?: MenuItem[];
}
