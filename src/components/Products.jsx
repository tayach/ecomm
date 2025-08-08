import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../redux/action";
import productsData from "../data/products.json";
import toast from "react-hot-toast";

const Products = () => {
  const [filter, setFilter] = useState(productsData);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.handleCart);

  const categories = useMemo(
    () => Array.from(new Set(productsData.map((p) => p.category))),
    []
  );

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart");
  };

  const applyFilters = (category, price) => {
    let updated = productsData;
    if (category) {
      updated = updated.filter((p) => p.category === category);
    }
    if (price) {
      const max = parseFloat(price);
      if (!isNaN(max)) {
        updated = updated.filter((p) => p.price <= max);
      }
    }
    setFilter(updated);
  };

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    applyFilters(cat, maxPrice);
  };

  const handlePrice = (price) => {
    setMaxPrice(price);
    applyFilters(selectedCategory, price);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setMaxPrice("");
    setFilter(productsData);
  };

  const recommendations = useMemo(() => {
    if (!cartItems.length) return [];
    const cartCategories = new Set(cartItems.map((item) => item.category));
    const recs = productsData.filter(
      (p) =>
        cartCategories.has(p.category) &&
        !cartItems.some((item) => item.id === p.id)
    );
    return recs.slice(0, 3);
  }, [cartItems]);

  return (
    <>
      <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Product Catalog</h2>
          <hr />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6 text-center">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={resetFilters}
          >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className="btn btn-outline-dark btn-sm m-2"
                onClick={() => handleCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="col-md-6 text-center">
            <input
              type="number"
              className="form-control d-inline w-50"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => handlePrice(e.target.value)}
            />
          </div>
        </div>
        <div className="row justify-content-center">
          {filter.map((product) => (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Category: {product.category}</li>
                  <li className="list-group-item">Price: $ {product.price}</li>
                  <li className="list-group-item">Rating: {product.rating}</li>
                </ul>
                <div className="card-body">
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => addProduct(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {recommendations.length > 0 && (
        <div className="container my-3 py-3">
          <div className="row">
            <div className="col-12">
              <h3 className="text-center">Recommended for you</h3>
              <hr />
            </div>
          </div>
          <div className="row justify-content-center">
            {recommendations.map((product) => (
              <div
                key={`rec-${product.id}`}
                className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
              >
                <div className="card text-center h-100 border-secondary">
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">Category: {product.category}</li>
                    <li className="list-group-item">Price: $ {product.price}</li>
                    <li className="list-group-item">Rating: {product.rating}</li>
                  </ul>
                  <div className="card-body">
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Products;