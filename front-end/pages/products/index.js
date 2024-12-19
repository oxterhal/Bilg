import { useState, useEffect } from "react";

export default function ProductManagement() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Fetch products from the server
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:10000/products");
      const data = await response.json();
      setProducts(data);
    } catch {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    const { name, description, price, stock } = form;

    if (!name || !description || !price || !stock) {
      setError("All fields are required");
      return;
    }

    try {
      await fetch("http://localhost:10000/createProducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: name,
          description,
          price: +price,
          stock: +stock,
        }),
      });
      setForm({ name: "", description: "", price: "", stock: "" });
      setError("");
      fetchProducts();
    } catch {
      setError("Failed to create product");
    }
  };

  return (
    <div className="p-4 text-black bg-white min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Products
        </h1>

        <div>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product Name"
            className="w-full p-2 mb-2 bg-white border border-gray-300"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 mb-2 bg-white border border-gray-300"
          />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            className="w-full p-2 mb-2 bg-white border border-gray-300"
            min="0"
          />
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock"
            className="w-full p-2 mb-2 bg-white border border-gray-300"
            min="0"
          />
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 p-2 rounded text-white hover:bg-blue-700 transition"
          >
            Create Product
          </button>
        </div>

        <br />
        <ul className="gap-10">
          {products.map((product) => (
            <li
              key={product.product_id}
              className="bg-white p-4 rounded border border-gray-200 shadow-md"
            >
              <h3 className="font-bold text-gray-800">
                {product.product_name}
              </h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-500 font-semibold">
                Price: ${product.price}
              </p>
              <p className="text-yellow-500">Stock: {product.stock}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
