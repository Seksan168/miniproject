"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  like?: number;
  is_new?: boolean;
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products on component load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  async function fetchProducts() {
    try {
      const response = await fetch("/api/product");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  return (
    <>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header>
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Product Collection
            </h2>
            <p className="mt-4 max-w-md text-gray-500">
              Explore our exclusive product collection and find what you need.
            </p>
          </header>
          {/* Sorting and Filters */}
          <div className="mt-12">
            <div className="flex flex-col lg:flex-row items-center lg:justify-between">
              {/* Sorting */}
              <div className="mb-4 lg:mb-0">
                <label
                  htmlFor="SortBy"
                  className="block text-xs font-medium text-gray-700"
                >
                  Sort By
                </label>
                <select
                  id="SortBy"
                  className="mt-1 rounded border-gray-300 text-sm"
                >
                  <option>Sort By</option>
                  <option value="Title, DESC">Title, DESC</option>
                  <option value="Title, ASC">Title, ASC</option>
                  <option value="Price, DESC">Price, DESC</option>
                  <option value="Price, ASC">Price, ASC</option>
                </select>
              </div>
              <div className="flex flex-col lg:flex-row items-center">
                <p className="block text-xs font-medium text-gray-700 mb-2 lg:mb-0 lg:mr-4">
                  Filters
                </p>
                <div className="flex flex-wrap gap-4">
                  <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                      <span className="text-sm font-medium">Availability</span>
                      <span className="transition group-open:-rotate-180">
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
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div className="border-t border-gray-200 bg-white p-4">
                      <ul className="space-y-2">
                        <li>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="size-5 rounded border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              In Stock
                            </span>
                          </label>
                        </li>
                        <li>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="size-5 rounded border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Out of Stock
                            </span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </details>
                  <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                      <span className="text-sm font-medium">Price</span>
                      <span className="transition group-open:-rotate-180">
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
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>
                    <div className="border-t border-gray-200 bg-white p-4">
                      <div className="flex justify-between gap-4">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="mt-8 lg:mt-12">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg shadow-sm hover:shadow-lg"
                  >
                    {/* Product Image */}
                    <a href="#" className="block overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-[300px] w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </a>

                    {/* Product Details */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        {product.name}
                      </h3>
                      <p className="text-gray-500">Price: ${product.price}</p>
                      <button
                        type="button"
                        className="mt-4 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
