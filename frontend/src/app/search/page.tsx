"use client";
import { Input } from "@mui/material";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import SearchTable from "../actionitem/components/SearchTable";

export type SearchPageProps = {};

const SearchPage: React.FC<SearchPageProps> = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="flex flex-col w-full h-full items-center">
        <div className="flex flex-col w-[200px] h-max">
          <div>Search for your action items</div>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="w-full h-max flex justify-center">
          <SearchTable searchInput={searchInput} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
