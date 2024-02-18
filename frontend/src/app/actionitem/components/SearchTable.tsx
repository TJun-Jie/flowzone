"use client";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ColumnConfig } from "@/components/Table/ColumnConfig";
import TableHeaderRow from "@/components/Table/TableHeaderRow";
import { Checkbox, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import debounce from "lodash.debounce";

const initialColumnConfig: ColumnConfig<Doc<"actionItems">>[] = [
  {
    key: "name",
    title: "Name",
    isVisible: true,
    width: "w-[150px]",
  },
  {
    key: "priority",
    title: "Priority",
    isVisible: true,
    width: "w-[150px]",
  },
  {
    key: "isDone",
    title: "Is Done",
    isVisible: true,
    width: "w-[100px]",
  },
  {
    key: "startTime",
    title: "Start Time",
    isVisible: true,
    width: "w-[220px]",
  },
  {
    key: "endTime",
    title: "End Time",
    isVisible: true,
    width: "w-[220px]",
  },
  {
    key: "projects",
    title: "Projects",
    isVisible: true,
    width: "w-[150px]",
  },
];

const SearchTable = ({ searchInput }: { searchInput: string }) => {
  // Helper function to create an editable cell
  const actionItems =
    useQuery(api.actionItems.search, { query: searchInput }) || [];

  const mutateName = useMutation(api.actionItems.updateActionItemName);
  const mutateStartTime = useMutation(
    api.actionItems.updateActionItemStartTime
  );
  const mutateEndTime = useMutation(api.actionItems.updateActionItemEndTimes);
  const mutateIsDone = useMutation(api.actionItems.updateCheckbox);

  const [data, setData] = useState<Doc<"actionItems">[]>();

  useEffect(() => {
    if (actionItems) {
      setData(actionItems);
    }
  }, [actionItems]);

  const debouncedMutateName = debounce(mutateName, 1000);

  const renderEditableCell = (value: any, record: any, column: any) => {
    const handleInputChange = (e: any) => {
      if (column === "name") {
        debouncedMutateName({
          id: record._id,
          name: e.target.value,
        });
      }

      const newData = data?.map((item) => {
        if (item._id === record._id) {
          return { ...item, [column]: e.target.value };
        }
        return item;
      });
      // You would have a state setter here to update your state
      setData(newData);
    };

    return (
      <input
        value={value}
        onChange={handleInputChange}
        placeholder="Type '/' for commands"
        className="p-2 h-full w-full bg-transparent outline-none placeholder-gray-400 resize-none  text-black"
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col   bg-white w-[70%] h-full">
        {/* Add other headers */}
        <OverlayScrollbarsComponent className="w-full h-full" defer>
          <div className=" w-full h-[400px] ">
            <TableHeaderRow
              columns={initialColumnConfig}
              height="h-[44px]"
              overrideStyles="w-max"
            />
            {data?.map((item: Doc<"actionItems">) => (
              <div
                key={item._id}
                className="flex flex-row h-[80px] h w-max border-b-[1px]"
              >
                <div className="h-full w-[150px]">
                  {renderEditableCell(
                    item.name,
                    item,
                    initialColumnConfig[0].key
                  )}
                </div>
                <div className="h-full w-[150px] border-l-[1px] ml-2 pl-2">
                  {renderEditableCell(item.priority, item, "priority")}
                </div>
                <div className="h-full w-[100px] flex justify-start items-center border-l-[1px] ml-2 pl-2">
                  <Checkbox
                    checked={item.isDone}
                    onChange={(e) => {
                      mutateIsDone({
                        id: item._id,
                        isDone: e.target.checked,
                      });
                      const newData = data?.map((i) => {
                        if (i._id === item._id) {
                          return { ...i, isDone: e.target.checked };
                        }
                        return i;
                      });

                      setData(newData);
                    }}
                  />
                </div>
                <div className="h-full w-[220px] flex justify-start items-center border-l-[1px] ml-2 pl-2">
                  <DateTimePicker
                    value={dayjs(item.startTime)}
                    onChange={(dayJSObject) => {
                      // convert dayjs object to iso string
                      if (!dayJSObject) return;
                      const isoString = dayJSObject?.toISOString();
                      if (!isoString) return;
                      // call the mutation
                      mutateStartTime({
                        id: item?._id,
                        startTime: isoString,
                      });
                      // update state on FE
                      const newData = data?.map((i) => {
                        if (i._id === item._id) {
                          return { ...i, startTime: isoString };
                        }
                        return i;
                      });

                      setData(newData);
                    }}
                    renderInput={(props) => (
                      <TextField {...props} size="small" helperText={null} />
                    )}
                  />
                  {/* {renderEditableCell(formatDate(item.startTime), item, "startTime")} */}
                </div>
                <div className="h-full w-[220px] flex justify-start items-center border-l-[1px] ml-2 pl-2">
                  <DateTimePicker
                    value={dayjs(item.endTime)}
                    onChange={(dayJSObject) => {
                      // convert dayjs object to iso string
                      if (!dayJSObject) return;
                      const isoString = dayJSObject?.toISOString();
                      if (!isoString) return;
                      // call the mutation
                      mutateEndTime({
                        id: item?._id,
                        endTime: isoString,
                      });
                      // update state on FE
                      const newData = data?.map((i) => {
                        if (i._id === item._id) {
                          return { ...i, endTime: isoString };
                        }
                        return i;
                      });

                      setData(newData);
                    }}
                    renderInput={(props) => (
                      <TextField {...props} size="small" helperText={null} />
                    )}
                  />
                </div>
                <div className="h-full w-[150px] border-l-[1px] ml-2 pl-2">
                  {renderEditableCell(item.projects, item, "projects")}
                </div>

                {/* Add other cells */}
              </div>
            ))}
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </LocalizationProvider>
  );
};

export default SearchTable;
