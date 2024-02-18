import LazyLoaderPill from "../LazyLoaderPill";
import { ColumnConfig } from "../TableDrawerRow";
import { BadgeSize, BadgeLayout } from "../../enums";
import React from "react";
import Badge from "../Badge";

export type TableBadgeProps<T, K extends string> = {
  column: ColumnConfig<T>;
  isLoading: boolean;
  textColorMapping: Record<K, BadgeColor>;
  text: K;
  notification?: boolean;
};

const TableBadge = <T, K extends string>({
  column,
  isLoading,
  textColorMapping,
  text,
  notification = false,
}: TableBadgeProps<T, K>) => {
  function getBadge() {
    if (isLoading) {
      return <LazyLoaderPill height="16px" width="100px" animate />;
    } else {
      let color: BadgeColor = textColorMapping[text];

      return (
        <Badge
          size={BadgeSize.medium}
          color={color}
          layout={BadgeLayout.text}
          text={text}
          notification={notification}
        />
      );
    }
  }
  return (
    <div
      className={`flex h-[52px] ${column?.width} flex-shrink-0 flex-col items-start justify-center overflow-hidden px-3`}
    >
      <div className="flex h-max w-full items-center gap-2 overflow-hidden">
        {getBadge()}
      </div>
    </div>
  );
};

export default TableBadge;
