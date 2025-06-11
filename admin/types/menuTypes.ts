// components/Menu/types/menuTypes.ts
// types/menuTypes.ts
export interface MenuItem {
  id: string;
  name: string;
  url?: string;
  icon?: string | React.ReactNode;
  requiredPrivilege?: string;
  parentId: string | number;
  order?: number;
  children?: MenuItem[]; // Now properly typed as optional array
}

export interface MenuResponse {
  items: MenuItem[];
  version: string;
}