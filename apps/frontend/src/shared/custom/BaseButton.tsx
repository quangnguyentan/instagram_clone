import { Button } from "antd";
import React from "react";

interface BaseButtonProps {
  className?: string;
  handleClick: () => void;
  children: React.ReactNode;
  type?: "primary" | "dashed" | "link" | "text" | "default";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconAlignment?: "start" | "end";
  shape?: "round" | "circle";
  size?: "small" | "large" | "lg";
}

const BaseButton = ({
  className,
  handleClick,
  children,
  type,
  disabled,
  loading,
  icon,
  iconAlignment,
  shape,
  size,
}: BaseButtonProps) => {
  return (
    <Button
      type={type}
      onClick={handleClick}
      className={className}
      disabled={disabled}
      loading={loading}
      icon={icon}
      shape={shape}
      size={size === "lg" ? "large" : size}
    >
      {icon && iconAlignment === "start" && icon}
      {children}
      {icon && iconAlignment === "end" && icon}
    </Button>
  );
};

export default BaseButton;
