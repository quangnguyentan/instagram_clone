import React from "react";

import type { MenuProps, DropdownProps } from "antd";
import { Dropdown, Space } from "antd";

interface BaseDropdownProps {
  items: MenuProps["items"];
  trigger: ["click"];
  children: React.ReactNode;
  className?: string;
  placement?: DropdownProps["placement"];
  icon?: React.ReactNode;
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  items,
  trigger,
  children,
  className,
  placement = "top",
  icon,
}) => (
  <Dropdown
    menu={{ items, className: "flex flex-col" }}
    trigger={trigger}
    className={className}
    placement={placement}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        {icon && icon}
        <>{children}</>
        {icon && icon}
      </Space>
    </a>
  </Dropdown>
);

export default BaseDropdown;
