import Filter from "@/components/Filter";
import ProductCard from "@/components/ProductCard";
import React, { useEffect, useReducer } from "react";
import { useFetchAllProductsQuery } from "@/store/slices/api/productApiSlice";

const initialState = {
  currentPage: 1,
  products: [],
  totalPages: 1,
  search: "",
  sort: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    default:
      return state;
  }
};

const Products = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data } = useFetchAllProductsQuery({
    limit: 25,
    page: state.currentPage,
    search: state.search,
    sort: state.sort,
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_PRODUCTS", payload: data.data });
      dispatch({ type: "SET_TOTAL_PAGES", payload: data.totalPages });
    }
  }, [data]);

  const handlePageChange = (newPage) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
  };

  const nextPage = () => {
    handlePageChange(state.currentPage + 1);
  };

  const prevPage = () => {
    handlePageChange(state.currentPage - 1);
  };

  return (
    <>
      <div className="w-[100%] mx-auto text-center py-10">
        <div className="text-black">
          <h1 className="text-3xl font-semibold">
            Discover Your Dream Products
          </h1>
          <p className="text-lg p-3">
            Turning Aspirations into Reality with Excellence
          </p>
        </div>
      </div>
      <div className="w-[80%] h-min-screen mx-auto text-center">
        <Filter state={state} dispatch={dispatch} />
        <div className="grid grid-cols-1 gap-[25px] sm:grid-cols-2 lg:grid-cols-3 xl:gap-[50px] w-full my-16">
          {state.products &&
            state.products.map((product) => (
              <ProductCard productData={product} key={product._id} />
            ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center items-center space-x-4">
        <button
          onClick={prevPage}
          disabled={state.currentPage === 1}
          className="px-4 py-2 rounded-full bg-slate-700 text-white font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <span className="mr-1"></span> Previous
        </button>

        <div className="flex items-center bg-white rounded-full shadow-md px-4 py-2">
          <span className="text-slate-700 font-bold mr-2">Page</span>
          <span className=" bg-slate-700 font-bold rounded-full px-3 py-1">
            {state.currentPage}
          </span>
          <span className="text-gray-600 mx-2">of</span>
          <span className="bg-gray-100 text-gray-800 font-bold rounded-full px-3 py-1">
            {state.totalPages}
          </span>
        </div>

        <button
          onClick={nextPage}
          disabled={state.currentPage === state.totalPages}
          className="px-4 py-2 rounded-full bg-slate-700 text-white font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Next <span className="ml-1"></span>
        </button>
      </div>
    </>
  );
};

export default Products;
