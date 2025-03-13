import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useFetchAllProductsQuery } from "@/store/slices/api/productApiSlice";

const HomePageProducts = () => {
  const [products, setProducts] = useState([]);
  const {
    data: productsData,
    error,
    isLoading,
  } = useFetchAllProductsQuery({
    limit: 4,
    page: "",
    search: "",
    sort: "",
  });

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.data);
    }
  }, [productsData]);

  return (
    <div>
      <div className="w-[100%] mx-auto text-center pt-16">
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
        <div className="grid grid-cols-1 gap-[25px] sm:grid-cols-3 lg:grid-cols-4 xl:gap-[50px] w-full my-8">
          {products &&
            products.map((product) => (
              <ProductCard productData={product} key={product._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageProducts;
