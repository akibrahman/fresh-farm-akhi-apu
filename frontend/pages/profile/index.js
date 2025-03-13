import { React, useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPaperclip,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { withAuth } from "@/utils/withAuth";
import {
  useUploadUserImageMutation,
  useDeleteImageMutation,
} from "@/store/slices/api/uploadsApiSlice";
import { useUpdateMyProfileMutation } from "@/store/slices/api/userApiSlice";
import { toastManager } from "@/utils/toastManager";
import { useRouter } from "next/router";
const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const [uploadUserImage] = useUploadUserImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: null,
  });
  const [displayData, setDisplayData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [picture, setPicture] = useState("/images/defaultUser.png");
  const [picturePreview, setPicturePreview] = useState(
    "/images/defaultUser.png"
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setDisplayData(user);
      if (user.profilePicture) {
        setPicture(user.profilePicture);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toastManager.loading("Updating profile...");

    try {
      let updatedData = {};
      updatedData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
      };
      if (formData.image) {
        const newFormData = new FormData();
        newFormData.append("image", formData.image);
        if (user.profilePicture) {
          await deleteImage(user.profilePicture).unwrap();
        }
        const res = await uploadUserImage(newFormData).unwrap();
        updatedData = { ...updatedData, image: res.image };
      }
      await updateMyProfile(updatedData).unwrap();
      setDisplayData(formData);
      setIsEditing(false);
      toastManager.updateStatus(toastId, {
        render: "Profile updated successfully",
        type: "success",
      });
      setTimeout(() => {
        router.reload();
      }, 2000);
    } catch (error) {
      toastManager.updateStatus(toastId, {
        render: error?.data?.message || "Failed to update profile",
        type: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPicturePreview(reader.result);
    };
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="text-black flex justify-center px-5 pb-5 bg-gray-100 min-h-screen">
      <div className="w-11/12">
        <div className="flex justify-between py-4">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{
                    color: "#9c9c9c",
                    left: "24px",
                    padding: "15px",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="pl-10 py-2 border rounded-xl"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src={picture} width={35} height={20} alt="Profile" />
            <p className="text-gray-600">{displayData.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          <div className="flex-grow">
            <form
              className="justify-center bg-white border rounded-lg p-10 mb-6"
              onSubmit={handleSubmit}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-600 text-xl font-bold">
                  General Information
                </h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="text-blue-500"
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                )}
              </div>
              <div className="flex gap-5 flex-wrap">
                <div className="flex-grow">
                  <label className="pt-3 pb-2 block text-gray-600">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-700 font-semibold text-lg pb-1">
                      {formData.name}
                    </p>
                  )}
                </div>
                <div className="flex-grow">
                  <label className="pt-3 pb-2 block text-gray-600">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      disabled
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-700 font-semibold text-lg pb-1">
                      {formData.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-5 flex-wrap">
                <div className="flex-grow">
                  <label className="pt-3 pb-2 block text-gray-600">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-700 font-semibold text-lg pb-1">
                      {formData.phone}
                    </p>
                  )}
                </div>
              </div>

              <h3 className="text-gray-600 text-xl font-bold pt-6">Address</h3>
              <div className="flex gap-5 flex-wrap">
                <div className="flex-grow">
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-700 font-semibold text-lg pb-1">
                      {formData.address}
                    </p>
                  )}
                </div>
              </div>
              {isEditing && (
                <button
                  type="submit"
                  className="mt-4 py-3 px-6 bg-gray-900 text-white font-bold rounded hover:bg-gray-600"
                >
                  Save Changes
                </button>
              )}
            </form>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 bg-white pt-16 pb-16 justify-center items-center text-center border rounded-lg">
              <img
                src={picture}
                width={120}
                height={50}
                className="round"
                alt="Profile"
              />
              <div>
                <h4 className="text-gray-600 text-2xl font-bold py-1">
                  {displayData.name}
                </h4>
                <p className="text-gray-500  py-1">{displayData.email}</p>
                <p className="text-gray-500 py-1">{displayData.address}</p>
              </div>
            </div>
            <div className="bg-white p-4 border rounded-lg">
              <label className="text-gray-600 text-lg">
                Select profile photo
              </label>
              <div className="flex items-center gap-4 px-2 py-3">
                <img
                  src={picturePreview}
                  width={60}
                  height={40}
                  className="border rounded"
                  alt="Profile Preview"
                />
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faPaperclip}
                    size="xl"
                    style={{
                      color: "#212121",
                      position: "relative",
                      pointerEvents: "none",
                    }}
                  />
                  <div>
                    <label
                      htmlFor="profile-photo-upload"
                      className="cursor-pointer text-gray-500"
                    >
                      <p>Choose Image</p>
                      <p className="text-sm">
                        JPG, GIF or PNG. Max size of 800K
                      </p>
                    </label>
                    <input
                      type="file"
                      id="profile-photo-upload"
                      disabled={!isEditing}
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile, { requireLogin: true });
