import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Admin/Admin-Sidebar";
import {
  useDeleteProductMutation,
  useFetchAllProductsQuery,
} from "@/store/slices/api/productApiSlice";
import { toastManager } from "@/utils/toastManager";
import "react-quill/dist/quill.snow.css";
import AddProduct from "./Add-Product";
import { withAuth } from "@/utils/withAuth";
import { debounce } from "lodash";
import Image from "next/image";

const AllProducts = () => {
  const { data: productsData } = useFetchAllProductsQuery({
    limit: 100000,
    page: 1,
    search: "",
    sort: "",
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState();
  const [deleteProduct] = useDeleteProductMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.data);
      setFilteredProducts(productsData.data);
    }
  }, [productsData]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [products]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    const toastID = toastManager.loading("Please wait...");
    try {
      await deleteProduct(id).unwrap();
      toastManager.updateStatus(toastID, {
        render: "Product deleted successfully",
        type: "success",
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      toastManager.updateStatus(toastID, {
        render: error?.data?.message || "Error deleting product",
        type: "error",
      });
    }
  };

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(lowerCaseQuery);
      const categoryMatch =
        product.category?.name?.toLowerCase().includes(lowerCaseQuery) ||
        !product.category;
      const subCategoryMatch =
        product.subCategory?.name?.toLowerCase().includes(lowerCaseQuery) ||
        !product.subCategory;
      return nameMatch || categoryMatch || subCategoryMatch;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, 300);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 text-black">
        {!isEditing && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Product List
                </h2>
                <input
                  type="text"
                  placeholder="Search products by name, category, or subcategory..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
              <div className="overflow-x-auto text-center">
                <table className="min-w-full bg-white border-collapse">
                  <thead className="bg-gray-100">
                    <tr className="text-center">
                      <th className="py-3 px-4 border-b">Image</th>
                      <th className="py-3 px-4 border-b">Name</th>
                      <th className="py-3 px-4 border-b">Price</th>
                      <th className="py-3 px-4 border-b">Stock</th>
                      <th className="py-3 px-4 border-b">Category</th>
                      <th className="py-3 px-4 border-b">SubCategory</th>
                      <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="border-b hover:bg-gray-50 transition duration-150 ease-in-out"
                        >
                          <td className="py-4 px-4">
                            <Image
                              src={
                                `/${product.image}` || "/placeholder-image.jpg"
                              }
                              alt={`${product.name} image`}
                              width={50}
                              height={50}
                              // className="absolute inset-0 w-full h-full"
                            />
                          </td>
                          <td className="py-4 px-4">{product.name}</td>
                          <td className="py-4 px-4">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-4">{product.quantity}</td>
                          <td className="py-4 px-4">
                            {product.category?.name || "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            {product.subCategory?.name || "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleEdit(product)}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-5 text-center text-gray-500"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {"<<"}
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {">"}
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {">>"}
                  </button>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="p-2 border rounded"
                  >
                    {[10, 20, 30, 40, 50].map((size) => (
                      <option key={size} value={size}>
                        Show {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        {isEditing && (
          <AddProduct
            editing={isEditing}
            product={editProduct}
            onEditComplete={handleEditComplete}
          />
        )}
      </div>
    </div>
  );
};

export default withAuth(AllProducts, {
  requireLogin: true,
  requireAdmin: true,
});
