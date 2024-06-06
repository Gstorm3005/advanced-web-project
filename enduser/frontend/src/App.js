import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [articles, setArticles] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = () => {
        axios.get('http://localhost:5000/enduser/api/articles', {
            headers: {
                authenticated: 'true'
            }
        })
        .then(response => {
            setArticles(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the articles!', error);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/enduser/api/articles', { name, category, quantity, price }, {
            headers: {
                authenticated: 'true'
            }
        })
        .then(response => {
            setArticles([...articles, response.data]);
            setName('');
            setPrice('');
        })
        .catch(error => {
            console.error('There was an error creating the product!', error);
        });
    };

    return (
        <div className="App">
            <h1>enduser - Articles</h1>
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
                    <label htmlFor="price">Category</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
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
                <button type="submit">Create Article</button>
            </form>
            <h2>Articles List</h2>
            <ul>
                {articles.map(article => (
                    <li key={article._id}>{article.name} - {article.category} - {article.quantity} - ${article.price}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
