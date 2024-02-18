import Checkbox, { CheckboxType } from "../Checkbox";
import React from "react";

export type TableHeaderCheckboxProps<T> = {
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
};

const TableHeaderCheckbox = <T,>({
  isSelected,
  setIsSelected,
}: TableHeaderCheckboxProps<T>) => {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        setIsSelected(!isSelected);
      }}
      className={`flex h-full w-max flex-shrink-0 cursor-pointer flex-col items-center justify-end overflow-hidden border-neutral-200 px-3 pb-2`}
    >
      <Checkbox
        onClick={() => {}}
        type={CheckboxType.blue}
        checked={isSelected}
      />
    </div>
  );
};

export default TableHeaderCheckbox;
