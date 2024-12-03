"use client";

import React, { useEffect, useState } from "react";

// Type definition for cart items
interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
}

export default function Page() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const userId = localStorage.getItem("userId");

  // Fetch cart and product data
  useEffect(() => {
    const fetchCartAndProducts = async () => {
      try {
        // Fetch cart data
        if (userId) {
          const cartResponse = await fetch(`/api/cart?userId=${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (cartResponse.ok) {
            const cartData = await cartResponse.json();

            const cartItems = cartData[0]?.products?.map((product: any) => ({
              product_id: product.product_id,
              quantity: product.quantity,
            }));

            setCartItems(cartItems || []);
          }
        }

        // Fetch product data
        const productsResponse = await fetch("/api/product", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (productsResponse.ok) {
          const productData = await productsResponse.json();
          setProducts(productData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndProducts();
  }, [userId]);
  //handle quantity change
  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));

    try {
      // Update the quantity on the server
      const updateResponse = await fetch(`/api/cart?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: newQuantity,
        }),
      });

      if (updateResponse.ok) {
        // Re-fetch the updated cart data after successful update
        const updatedCartResponse = await fetch(`/api/cart?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (updatedCartResponse.ok) {
          const updatedCartData = await updatedCartResponse.json();
          const updatedCartItems = updatedCartData[0]?.products?.map(
            (product: any) => ({
              product_id: product.product_id,
              quantity: product.quantity,
            })
          );
          setCartItems(updatedCartItems || []);
        }
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  // Calculate the total price
  const totalPrice = cartItems.reduce((total, item) => {
    const product = products.find((prod) => prod.id === item.product_id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  return userId ? (
    <div>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                Your Cart
              </h1>
            </header>

            <div className="mt-8">
              <ul className="space-y-4">
                {cartItems.map((cartItem) => {
                  const product = products.find(
                    (prod) => prod.id === cartItem.product_id
                  );
                  if (!product) return null; // If product not found, skip rendering

                  return (
                    <li
                      key={cartItem.product_id}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="size-16 rounded object-cover"
                      />

                      <div>
                        <h3 className="text-sm text-gray-900">
                          {product.name}
                        </h3>
                        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                          <div>
                            <dt className="inline">Price:</dt>
                            <dd className="inline">£{product.price}</dd>
                          </div>
                          <div>
                            <dt className="inline">Quantity:</dt>
                            <dd className="inline">{cartItem.quantity}</dd>
                          </div>
                        </dl>
                      </div>
                      <div className="flex flex-1 items-center justify-end gap-2">
                        <form>
                          <label htmlFor="Line2Qty" className="sr-only">
                            {" "}
                            Quantity{" "}
                          </label>

                          <input
                            type="number"
                            min="1"
                            value={
                              quantities[cartItem.product_id] ||
                              cartItem.quantity
                            }
                            id="Line2Qty"
                            onChange={(e) =>
                              handleQuantityChange(
                                cartItem.product_id,
                                parseInt(e.target.value)
                              )
                            }
                            className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </form>

                        <button className="text-gray-600 transition hover:text-red-600">
                          <span className="sr-only">Remove item</span>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                <div className="w-screen max-w-lg space-y-4">
                  <dl className="space-y-0.5 text-sm text-gray-700">
                    <div className="flex justify-between !text-base font-medium">
                      <dt>Total</dt>
                      <dd>£{totalPrice}</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                    >
                      Checkout
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <>Not User login</>
  );
}
