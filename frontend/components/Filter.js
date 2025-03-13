import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
const sortOptions = [
  { value: "", label: "Select" },
  { value: "lowToHigh", label: "Price: Low to High" },
  { value: "highToLow", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const Filter = ({ state, dispatch }) => {
  const handleSearch = (e) => {
    dispatch({ type: "SET_SEARCH", payload: e.target.value });
  };

  const handleSort = (e) => {
    dispatch({ type: "SET_SORT", payload: e.target.value });
  };
  return (
    <div className="h-[8vh] px-16 shadow-md border flex justify-between items-center rounded-md text-black text-lg">
      <div className="text-gray-600 flex items-center">
        <input
          type="text"
          placeholder="Search your products..."
          className="px-10 py-2 border rounded-lg absolute "
          value={state.search}
          onChange={handleSearch}
        />
        <AiOutlineSearch
          className="text-gray-600 cursor-pointer p-2 relative top-[0px] left-0"
          size={45}
        />
      </div>
      <div className="flex items-center justify-center gap-5">
        <h1>Sort By: </h1>
        <select className="p-2" value={state.sort} onChange={handleSort}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
