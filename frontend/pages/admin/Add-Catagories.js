import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Admin/Admin-Sidebar";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import {
  useCreateNewCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchAllCategoriesQuery,
} from "../../store/slices/api/categoryApiSlice";
import { toastManager } from "@/utils/toastManager";
import { withAuth } from "@/utils/withAuth";

const Categories = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryDescription: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [createCategory] = useCreateNewCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data: categoryData } = useFetchAllCategoriesQuery();

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData);
    }
  }, [categoryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      categoryDescription: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.categoryName)
      tempErrors.categoryName = "Category Name is required";
    if (!formData.categoryDescription)
      tempErrors.categoryDescription = "Category Description is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const toastId = toastManager.loading("Please wait...");
      try {
        if (!isEditing) {
          await createCategory(formData).unwrap();
          toastManager.updateStatus(toastId, {
            render: "Category added successfully",
            type: "success",
          });
        } else {
          const updatedCategory = {
            ...selectedCategory,
            name: formData.categoryName,
            description: formData.categoryDescription,
          };
          await updateCategory(updatedCategory).unwrap();
          toastManager.updateStatus(toastId, {
            render: "Category updated successfully",
            type: "success",
          });
        }
      } catch (error) {
        const message = error?.data
          ? error?.data?.message
          : "An error occurred";
        toastManager.updateStatus(toastId, {
          render: message,
          type: "error",
        });
      } finally {
        resetForm();
      }
    }
  };

  const handleEdit = (category) => {
    setFormData({
      categoryName: category.name,
      categoryDescription: category.description,
    });
    setIsEditing(true);
    setSelectedCategory(category);
  };

  const handleDelete = async (id) => {
    const toastId = toastManager.loading("Please wait...");
    try {
      await deleteCategory(id).unwrap();
      toastManager.updateStatus(toastId, {
        render: "Category deleted successfully",
        type: "success",
      });
    } catch (error) {
      const message = error?.data ? error?.data?.message : "An error occurred";
      toastManager.updateStatus(toastId, {
        render: message,
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      categoryName: "",
      categoryDescription: "",
    });
    setErrors({});
    setIsEditing(false);
    setSelectedCategory(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 text-black">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            <span className="text-green-500 border-b-2 border-black-500 pb-1">
              {isEditing ? "Edit Category" : "Add Category"}
            </span>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="categoryName"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  name="categoryName"
                  type="text"
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.categoryName && (
                  <p className="text-red-500 text-xs italic">
                    {errors.categoryName}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="categoryDescription"
                >
                  Category Description
                </label>
                <ReactQuill
                  value={formData.categoryDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter category description"
                  className="bg-white mb-4"
                />
                {errors.categoryDescription && (
                  <p className="text-red-500 text-xs italic">
                    {errors.categoryDescription}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isEditing ? "Update Category" : "Add Category"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            <span className="text-green-500 border-b-2 border-black-500 pb-1">
              Categories-List :
            </span>
          </h2>
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {category.name}
                  </td>
                  <td
                    className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    dangerouslySetInnerHTML={{ __html: category.description }}
                  ></td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Categories, { requireLogin: true, requireAdmin: true });

// export default Categories;
