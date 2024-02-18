import DefaultTableHeaderCell from "./DefaultTableHeaderCell";
import TableCheckbox from "./TableCheckbox";
import React from "react";
import TableHeaderCheckbox from "./TableHeaderCheckbox";
import { ColumnConfig, ColumnType } from "./ColumnConfig";

type TableHeaderRowProps<T> = {
  columns: ColumnConfig<T>[];
  isAllSelected?: boolean;
  setIsAllSelected?: (isSelected: boolean) => void;
  height: string;
  overrideStyles?: string;
};

export default function TableHeaderRow<T>({
  columns,
  isAllSelected = false,
  setIsAllSelected = () => {},
  height = "w-[44px]",
  overrideStyles = "",
}: TableHeaderRowProps<T>) {
  function getColumns() {
    return columns.map((column) => {
      switch (column?.type) {
        case ColumnType.checkbox:
          return (
            <TableHeaderCheckbox
              isSelected={isAllSelected}
              setIsSelected={setIsAllSelected}
            />
          );

        default:
          return getDefaultColumn(column);
      }
    });
  }

  function getDefaultColumn(column: ColumnConfig<T>) {
    return <DefaultTableHeaderCell column={column} />;
  }

  return (
    <div
      className={` flex ${height} w-full flex-shrink-0 justify-start overflow-hidden border-b-[1px] border-neutral-200 ${overrideStyles}`}
    >
      {getColumns()}
    </div>
  );
}
