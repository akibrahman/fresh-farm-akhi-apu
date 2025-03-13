import { React } from "react";
import Image from "next/image";

const PromotionCard = ({ offer }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-wrap md:flex-nowrap w-11/12 sm:w-4/5 lg:w-3/5 xl:w-2/3 bg-white rounded-lg overflow-hidden shadow-md lg-h-1/2">
        <div className="w-full md:w-1/2">
          <Image
            // src={offerImg}
            alt="offer"
            width={300}
            height={300}
            layout="responsive"
            objectFit="cover"
            className="md:h-full sm:w-full md:rounded-tl-lg md:rounded-bl-lg"
          />
        </div>
        <div className="bg-yellow-500  md:w-1/2 py-4 px-10 flex flex-col justify-center items-center   md:rounded-tr-lg md:rounded-br-lg">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 pb-2 text-center md:text-left lg:text-center">
            {/* {offerText} */}
          </h2>
          <p className="text-gray-800 pb-4 text-center md:text-left">
            Sign up for special offers and updates
          </p>
          <form className="w-full">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 md:py-1 rounded"
            >
              Unlock Offer
            </button>
          </form>
          <p className="text-gray-700 text-xs pt-4 text-center md:text-left md:text-sm">
            By signing up, you agree to be added to our email list
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
