import React from "react";
import { ColumnConfig } from "./ColumnConfig";

export type TableHeaderCellProps<T> = {
  column: ColumnConfig<T>;
};

const TableHeaderCell = <T,>({ column }: TableHeaderCellProps<T>) => {
  return (
    <div
      className={`flex h-full ${column?.width} flex-shrink-0 flex-col items-start justify-end overflow-hidden  pb-2 ml-2 pl-2 border-l-[1px] first:border-l-0 border-neutral-200 first:ml-0`}
    >
      <div className="flex h-max w-max items-end gap-2 overflow-hidden">
        <p className="truncate-left h-max w-max text-left text-[14px] font-[500] text-neutral-600">
          {column?.title}
        </p>
      </div>
    </div>
  );
};

export default TableHeaderCell;
