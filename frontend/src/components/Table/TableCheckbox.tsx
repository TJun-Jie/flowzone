import Checkbox, { CheckboxType } from "../Checkbox";
import React from "react";
import { ColumnConfig } from "./ColumnConfig";

export type TableCheckboxProps<T> = {
  column: ColumnConfig<T>;
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
};

const TableCheckbox = <T,>({
  column,
  isSelected,
  setIsSelected,
}: TableCheckboxProps<T>) => {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        setIsSelected(!isSelected);
      }}
      className={`flex h-full w-max flex-shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden border-neutral-200 px-3`}
    >
      <Checkbox
        onClick={() => {}}
        type={CheckboxType.blue}
        checked={isSelected}
      />
    </div>
  );
};

export default TableCheckbox;
