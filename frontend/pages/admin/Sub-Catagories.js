import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Admin/Admin-Sidebar";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import {
  useFetchAllSubCategoriesQuery,
  useCreateNewSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "@/store/slices/api/subcategoryApiSlice";
import { useFetchAllCategoriesQuery } from "@/store/slices/api/categoryApiSlice";
import { withAuth } from "@/utils/withAuth";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const SubCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);
  const { data: categoriesFromAPI } = useFetchAllCategoriesQuery();

  const { data: subCategories = [], refetch: refetchSubCategories } =
    useFetchAllSubCategoriesQuery();
  const [createNewSubCategory] = useCreateNewSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoriesFromAPI) {
      setCategories(categoriesFromAPI);
    }
  }, [categoriesFromAPI]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "SubCategory Name is required";
    if (!formData.description)
      tempErrors.description = "SubCategory Description is required";
    if (!formData.category_id) tempErrors.category_id = "Category is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        if (isEditing) {
          await updateSubCategory({
            id: currentSubCategoryId,
            ...formData,
          }).unwrap();
        } else {
          await createNewSubCategory(formData).unwrap();
        }
        refetchSubCategories();
        resetForm();
      } catch (error) {
        console.error("Error saving subcategory:", error);
      }
    }
  };

  const handleEdit = (subCategory) => {
    setFormData({
      name: subCategory.name,
      description: subCategory.description,
      category_id: subCategory.category_id._id,
    });
    setIsEditing(true);
    setCurrentSubCategoryId(subCategory._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubCategory(id).unwrap();
      refetchSubCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category_id: "",
    });
    setErrors({});
    setIsEditing(false);
    setCurrentSubCategoryId(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 text-black">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            <span className="text-green-500 border-b-2 border-black-500 pb-1">
              Add Subcategory:
            </span>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  SubCategory Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter subcategory name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="category_id"
                >
                  Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-red-500 text-xs italic">
                    {errors.category_id}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  SubCategory Description
                </label>
                <ReactQuill
                  id="description"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  placeholder="Enter subcategory description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs italic">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isEditing ? "Update SubCategory" : "Add SubCategory"}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            <span className="text-green-500 border-b-2 border-black-500 pb-1">
              Subcategory List:
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
                  Category
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((subCategory, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {subCategory.name}
                  </td>
                  <td
                    className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    dangerouslySetInnerHTML={{
                      __html: subCategory.description,
                    }}
                  ></td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {subCategory.category
                      ? subCategory.category.name
                      : "No Category"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleEdit(subCategory)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subCategory._id)}
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

export default withAuth(SubCategory, {
  requireLogin: true,
  requireAdmin: true,
});
