import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:5000/restaurateur/api/products', {
            headers: {
                authenticated: 'true'
            }
        })
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the products!', error);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/restaurateur/api/products', { name, price }, {
            headers: {
                authenticated: 'true'
            }
        })
        .then(response => {
            setProducts([...products, response.data]);
            setName('');
            setPrice('');
        })
        .catch(error => {
            console.error('There was an error creating the product!', error);
        });
    };

    return (
        <div className="App">
            <h1>restaurateur - Products</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Product</button>
            </form>
            <h2>Products List</h2>
            <ul>
                {products.map(product => (
                    <li key={product._id}>{product.name} - ${product.price}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
