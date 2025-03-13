import getImageURL from "@/utils/image";
import { useRouter } from "next/router";

const ProductCard = ({ productData }) => {
  const { name, image, price, quantity, slug } = productData || {};
  const router = useRouter();

  const handleViewProduct = () => {
    router.push(`/products/${slug}`);
  };

  return (
    <div className="w-[90%] mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
      <img
        src={`/${image}`}
        alt={name}
        className="w-full h-64 object-cover"
        onClick={handleViewProduct}
        style={{ cursor: "pointer" }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-gray-700">{price}&nbsp;৳</p>
        {quantity > 0 && <p className="text-gray-500">In stock: {quantity}</p>}
        {quantity == 0 && <p className="text-gray-500">Out of Stock.</p>}
        <div
          className="mt-4 inline-block bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
          onClick={handleViewProduct}
          style={{ cursor: "pointer" }}
        >
          View Product
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
