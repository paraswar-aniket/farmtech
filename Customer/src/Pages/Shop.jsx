import React, { useState, useEffect } from 'react';
import './CSS/Shop.css';
import { Item } from '../../Components/Item/Item';
import fruits_banner from '../../Components/Assets/fruits_cupon.png';
import vegetables_banner from '../../Components/Assets/banner_vegetables.jpg';
import grains_banner from '../../Components/Assets/banner_grains.jpg';
import { Hero } from "../../Components/Hero/Hero";

export const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://farmtech-kxq6.onrender.com/api/customer/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('API Response:', data);
                // Make sure you're setting the products array from the API response.
                setProducts(data.products);
            } else {
                const errorText = await response.text();
                console.error('Error fetching products:', errorText);
                setError('Failed to fetch products');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products by category.
    const filterByCategory = (category) => 
        products.filter((product) => product.type === category);

    return (
        <div className="shop-container">
            <Hero />
            <h1>New Products</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <>
                    {/* Fruits Section */}
                    <div className="category-section">
                        <div className="category-banner">
                            <img src={fruits_banner} alt="Fruits" />
                            <h2>Fruits</h2>
                        </div>
                        <div className="product-slideshow">
                            {filterByCategory('fruits').length > 0 ? (
                                filterByCategory('fruits').map(({ _id, name, image, price }) => (
                                    <Item
                                        key={_id}
                                        id={_id}
                                        name={name}
                                        image={image}
                                        price={price}
                                    />
                                ))
                            ) : (
                                <p>No fruits available</p>
                            )}
                        </div>
                    </div>

                    {/* Vegetables Section */}
                    <div className="category-section">
                        <div className="category-banner">
                            <img src={vegetables_banner} alt="Vegetables" />
                            <h2>Vegetables</h2>
                        </div>
                        <div className="product-slideshow">
                            {filterByCategory('vegetables').length > 0 ? (
                                filterByCategory('vegetables').map(({ _id, name, image, price }) => (
                                    <Item
                                        key={_id}
                                        id={_id}
                                        name={name}
                                        image={image}
                                        price={price}
                                    />
                                ))
                            ) : (
                                <p>No vegetables available</p>
                            )}
                        </div>
                    </div>

                    {/* Grains Section */}
                    <div className="category-section">
                        <div className="category-banner">
                            <img src={grains_banner} alt="Grains" />
                            <h2>Grains</h2>
                        </div>
                        <div className="product-slideshow">
                            {filterByCategory('grains').length > 0 ? (
                                filterByCategory('grains').map(({ _id, name, image, price }) => (
                                    <Item
                                        key={_id}
                                        id={_id}
                                        name={name}
                                        image={image}
                                        price={price}
                                    />
                                ))
                            ) : (
                                <p>No grains available</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
