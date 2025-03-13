import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  deleteCart,
} from "@/store/slices/cartSlice";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useCreateOrderMutation } from "@/store/slices/api/orderApiSlice";
import { toastManager } from "@/utils/toastManager";
import { useCreatePaymentIntentMutation } from "@/store/slices/api/paymentSlice";
import Image from "next/image";

const CartDropdown = ({ isOpen, toggleCart }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [totalAmount, setTotalAmount] = useState(0);
  const [createOrder] = useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const calculateTotalAmount = useMemo(() => {
    return cart.cart.reduce(
      (total, item) => total + item.itemPrice * item.quantity,
      0
    );
  }, [cart.cart]);

  useEffect(() => {
    setTotalAmount(calculateTotalAmount);
  }, [calculateTotalAmount]);

  const handleIncrease = (item) => {
    dispatch(increaseQuantity(item));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item));
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.cart.length === 0) {
      toastManager.error("Cart is empty. Cannot place order.");
      return;
    }
    const toastId = toastManager.loading("Processing your order...");
    const products = await cart.cart.map((item) => ({
      product: item._id,
      quantity: item.quantity,
      price: item.itemPrice,
    }));
    const order = {
      products,
      totalAmount: cart.totalPayableAmount,
    };
    try {
      const response = await createOrder(order).unwrap();
      toastManager.updateStatus(toastId, {
        type: "success",
        render: "Order placed successfully",
      });
      const orderId = response.order._id;
      const paymentIntent = {
        amount: cart.totalPayableAmount,
        orderID: orderId,
        currency: "BDT",
      };
      const paymentResponse = await createPaymentIntent(paymentIntent).unwrap();
      toastManager.updateStatus(toastId, {
        type: "success",
        render: "Redirecting to payment gateway...",
      });
      setTimeout(() => {
        window.location.href = paymentResponse.payment_url;
      }, 2000);
      dispatch(deleteCart());
      toggleCart();
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.error?.message ||
        "Something went wrong. Please try again later.";
      toastManager.updateStatus(toastId, {
        type: "error",
        render: errorMessage,
      });
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={toggleCart}
      ></div>
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            <div className="flex-1 py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Your cart</h2>
                <button
                  onClick={toggleCart}
                  className="ml-3 flex h-7 items-center text-gray-400 hover:text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>

              <ul className="mt-8 space-y-6 divide-y divide-gray-200">
                {cart.cart.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Your cart is empty
                  </p>
                ) : (
                  cart.cart.map((item) => (
                    <li key={item._id} className="flex py-6">
                      <div className="flex-shrink-0 w-24 h-[4.5rem] overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={`/${item.image}`}
                          alt={item.name}
                          width={96}
                          height={72}
                          objectFit="cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">{item.itemPrice} Tk</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.color || "Color"}
                          </p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm mt-4">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleDecrease(item)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <FaMinus />
                            </button>
                            <button
                              onClick={() => handleIncrease(item)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <FaPlus />
                            </button>
                            <button
                              onClick={() => handleRemove(item)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total amount:</p>
                <p>{totalAmount} Tk</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Checkout
                </button>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <button
                  type="button"
                  onClick={toggleCart}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
