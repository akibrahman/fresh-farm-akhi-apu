import Sidebar from "@/components/Admin/Admin-Sidebar";
import { React, useState } from "react";
import { withAuth } from "@/utils/withAuth";

const OfferForm = () => {
  const [offerImg, setOfferImg] = useState("");
  const [offerTitle, setofferTitle] = useState(
    "Unlock 15% off your first order"
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async () => {};

  const onEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1  h-screen">
        <form
          className="justify-center md:mx-2 lg:mx-24 my-5 bg-white border shadow-md rounded-lg p-10"
          onSubmit={handleSubmit}
        >
          <div className=" flex justify-between items-center mb-4">
            <h3 className="text-gray-600 text-xl font-bold">
              Edit Offer Information
            </h3>
          </div>
          <div className="flex gap-5">
            <div className="flex-grow">
              <label className="pt-3 pb-2 block text-gray-600">
                Offer Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="offerTitle"
                  value={offerTitle}
                  onChange={(e) => setofferTitle(e.target.value)}
                  className="w-full text-black p-2 border border-gray-300 rounded"
                />
              ) : (
                <p className="text-black">{offerTitle}</p>
              )}
            </div>
          </div>
          <div className="">
            <div className="">
              <label className="pt-3 pb-2 block text-gray-600">
                Offer Image
              </label>
              {isEditing ? (
                <input
                  type="file"
                  name="offerImg"
                  value={offerImg}
                  onChange={(e) => setOfferImg(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            {isEditing && (
              <button
                type="submit"
                className="mt-4 py-3 px-6 bg-gray-900 text-white font-bold rounded hover:bg-gray-600"
              >
                Save
              </button>
            )}

            {!isEditing && (
              <button
                type="button"
                onClick={onEdit}
                className="mt-4 py-3 px-6 bg-gray-900 text-white font-bold rounded hover:bg-gray-600"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(OfferForm, { requireLogin: true, requireAdmin: true });
