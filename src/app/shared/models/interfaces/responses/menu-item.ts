export interface MenuItem {
  link: string;
  icon: string;
  label: string;
  children?: Array<MenuItemChildren>
}

export interface MenuItemChildren {
  link: string;
  icon: string;
  label: string;
}
