import { StyleOverride } from "../../types";
import React from "react";
import LazyLoadingText from "../LazyLoadingText";
import { ColumnConfig } from "../TableDrawerRow";

export enum TableCellState {
  default,
  disabled,
  expanded,
}

const ReadOnlyTableCell = <T,>({
  data,
  isLoading,
  state = TableCellState.default,
  overrideStyles,
  column,
}: {
  data: string | null | undefined;
  state?: TableCellState;
  overrideStyles?: {
    container?: StyleOverride;
  };
  isLoading: boolean;
  column: ColumnConfig<T>;
}) => {
  const getBGColor = () => {
    switch (state) {
      case TableCellState.disabled:
        return "opacity-30";
      case TableCellState.expanded:
        return "bg-[#EFF0F2]";
      case TableCellState.default:
        return "bg-[#ffffff]";
      default:
        return "bg-[#ffffff]";
    }
  };

  const containerStyleOverride = overrideStyles?.container;
  return (
    <div
      className={`flex h-full ${
        column?.width ?? ""
      } shrink-0 grow-0 flex-col items-start justify-center gap-2.5 overflow-hidden px-3 py-2 ${getBGColor()} ${
        containerStyleOverride?.styles ?? ""
      }`}
    >
      <div className="flex h-max w-full flex-col items-start justify-center gap-0 overflow-hidden">
        <LazyLoadingText
          isLoading={isLoading}
          className="truncate-left h-max w-full overflow-ellipsis text-left text-[14px] font-[500] leading-[20px] text-[#1a1a1a]"
        >
          {data === "" || data === null || data === undefined ? "-" : data}
        </LazyLoadingText>
      </div>
    </div>
  );
};

export default ReadOnlyTableCell;
