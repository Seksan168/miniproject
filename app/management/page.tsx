"use client";

import { useState, useEffect } from "react";

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
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [editID, setEditID] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch("/api/product");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function addProduct() {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, image_url: imageUrl }),
      });
      if (!response.ok) throw new Error("Failed to add product");
      await fetchProducts();
      setName("");
      setPrice(0);
      setImageUrl("");
    } catch (error) {
      console.error(error);
    }
  }

  async function editProduct(id: number) {
    const product = products.find((product) => product.id === id);
    if (product) {
      setEditID(id);
      setName(product.name);
      setPrice(product.price);
      setImageUrl(product.image_url);
    }
  }

  async function updateProduct() {
    try {
      const response = await fetch(`/api/product`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editID, name, price, image_url: imageUrl }),
      });
      if (!response.ok) throw new Error("Failed to update product");
      await fetchProducts();
      setEditID(null);
      setName("");
      setPrice(0);
      setImageUrl("");
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteProduct(id: number) {
    try {
      const response = await fetch(`/api/product`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete product");
      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Product Management
          </h2>
          <p className="mt-4 max-w-md text-gray-500">
            Hi admin! Here you can manage your products.
          </p>
        </header>

        <div className="mt-8">
          <div>
            <label>
              Product Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block rounded border-gray-300 text-sm"
              />
            </label>
          </div>
          <div>
            <label>
              Price:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 block rounded border-gray-300 text-sm"
              />
            </label>
          </div>
          <div>
            <label>
              Image URL:
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1 block rounded border-gray-300 text-sm"
              />
            </label>
          </div>
          <div>
            {editID ? (
              <button
                onClick={updateProduct}
                className="mt-2 text-white bg-blue-500 px-4 py-2 rounded"
              >
                Update Product
              </button>
            ) : (
              <button
                onClick={addProduct}
                className="mt-2 text-white bg-green-500 px-4 py-2 rounded"
              >
                Add Product
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded p-4 shadow hover:shadow-lg"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
              <h3 className="mt-2 text-lg font-bold">{product.name}</h3>
              <p className="text-gray-700">Price: ${product.price}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => editProduct(product.id)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
