import React from "react";

export interface MenuItem {
  id: string;
  name: string;
  url?: string;
  icon?: string | React.ReactNode;
  requiredPrivilege?: string;
  parentId: string | number;
  order?: number;
  children?: MenuItem[]; 
}

export interface MenuResponse {
  items: MenuItem[];
  version: string;
}

export interface CreateMenuProps {
  onCreate: (item: MenuItem) => void;
  onCancel?: () => void;
  parentId?: string | number;
}