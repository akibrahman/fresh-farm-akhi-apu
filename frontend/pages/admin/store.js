import Sidebar from "@/components/Admin/Admin-Sidebar";
import React, { useEffect, useState } from "react";
import { withAuth } from "@/utils/withAuth";
import { useFetchAllProductsQuery } from "@/store/slices/api/productApiSlice";

const store = () => {
  const { data: allProducts, error, isLoading } = useFetchAllProductsQuery();
  const [products, setProducts] = useState([]);

  const editHandler = (p_name) => {
    console.log(p_name);
  };

  const deleteHandler = (p_name) => {
    console.log(p_name);
  };

  useEffect(() => {
    if (allProducts) {
      setProducts(allProducts);
    }
  }, [allProducts]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-10 text-black">
        <h1 className="text-2xl font-bold mb-6">Products Dashboard</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="w-full bg-gray-800 text-white text-left">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td className="py-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 object-cover"
                      />
                    </td>
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">{product.price}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-2 text-center">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(store, { requireLogin: true, requireAdmin: true });
