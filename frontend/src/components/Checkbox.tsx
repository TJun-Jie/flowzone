import React, { useState, useEffect, CSSProperties, useRef } from "react";

export enum CheckboxType {
  blue = "blue",
  black = "black",
}

export type CheckboxValue = true | false | "mixed";
export interface CheckboxProps {
  label?: string;
  checked: CheckboxValue;
  type: CheckboxType;
  onClick: () => void;
  disabled?: boolean;
  overrideStyles?: string;
  sizeOverride?: { width: string | null; height: string | null };
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const {
      label,
      checked,
      type,
      disabled,
      onClick,
      overrideStyles = "",
      sizeOverride,
    } = props;

    const elementRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
      const element = elementRef.current;

      const handleMouseOver = () => {
        setIsHovered(true);
      };

      const handleMouseOut = () => {
        setIsHovered(false);
      };

      const handleMouseDown = () => {
        setIsPressed(true);
      };

      const handleMouseUp = () => {
        setIsPressed(false);
      };

      if (element) {
        element.addEventListener("mouseover", handleMouseOver);
        element.addEventListener("mouseout", handleMouseOut);
        element.addEventListener("mousedown", handleMouseDown);
        element.addEventListener("mouseup", handleMouseUp);

        return () => {
          element.removeEventListener("mouseover", handleMouseOver);
          element.removeEventListener("mouseout", handleMouseOut);
          element.removeEventListener("mousedown", handleMouseDown);
          element.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, []);

    const handleOnClick = () => {
      onClick();
    };

    const getColorMap = (type: CheckboxType) => {
      if (type === CheckboxType.black) {
        return {
          clickedColor: "#333333", // Example hex for neutral-600
          disabledColor: "#666666", // Example hex for neutral-500
          defaultColor: "#000000", // Example hex for neutral-1000
          hoverColor: "#1a1a1a", // Example hex for neutral-800
        };
      } else {
        return {
          clickedColor: "#005cbf", // Example hex for blue-600
          disabledColor: "#b3d9ff", // Example hex for blue-200
          defaultColor: "#007bff", // Example hex for blue-400
          hoverColor: "#3399ff", // Example hex for blue-500
        };
      }
    };

    const getFillColor = () => {
      const colors = getColorMap(type);

      if (disabled) {
        return colors.disabledColor;
      }

      if (isPressed) {
        return colors.clickedColor;
      }

      if (isHovered) {
        return colors.hoverColor;
      }

      return colors.defaultColor;
    };

    const cursorStyle = disabled ? "cursor-not-allowed" : "cursor-pointer";

    const styleOverrides: CSSProperties = {};

    if (sizeOverride?.width) {
      styleOverrides.width = sizeOverride.width;
    }

    if (sizeOverride?.height) {
      styleOverrides.height = sizeOverride.height;
    }

    return (
      <div
        className={`flex items-center ${cursorStyle} ${overrideStyles}`}
        onClick={disabled ? undefined : handleOnClick}
        style={styleOverrides}
        ref={ref}
      >
        <div
          ref={elementRef}
          className={`rounded flex items-center justify-center`}
        >
          {checked === true ? (
            <div className="flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="16" height="16" rx="2" fill={getFillColor()} />
                <path
                  d="M4 7.72222L6.85714 10.5L12 5.5"
                  stroke="var(--neutral-0)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : checked === "mixed" ? (
            <div className="flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="16" height="16" rx="2" fill={getFillColor()} />
                <mask
                  id="mask0_2909_29041"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="2"
                  y="7"
                  width="12"
                  height="2"
                >
                  <path
                    d="M12 9H4.00005C2.66567 9 2.66567 7 4.00005 7H12C13.3344 7 13.3344 9 12 9Z"
                    fill="var(--neutral-0)"
                  />
                </mask>
                <g mask="url(#mask0_2909_29041)">
                  <rect width="16" height="16" fill="var(--neutral-0)" />
                </g>
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.6"
                  y="0.6"
                  width="14.8"
                  height="14.8"
                  rx="1.4"
                  fill="var(--neutral-0)"
                  stroke={
                    isPressed
                      ? "var(--neutral-800)"
                      : isHovered
                      ? "var(--neutral-600)"
                      : "var(--neutral-500)"
                  }
                  strokeWidth="1.2"
                />
              </svg>
            </div>
          )}
        </div>
        {label && (
          <div
            className={`ml-2 text-sm font-medium leading-5  ${
              disabled ? "text-neutral-500 " : "text-neutral-1000"
            }`}
          >
            {label}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
