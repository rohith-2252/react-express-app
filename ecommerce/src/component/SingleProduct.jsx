import './SingleProduct.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from './Header';
import { Footer } from './Footer';

export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(false);

    axios.post(`http://localhost:3001/api/singleProduct/${id}`)
      .then(res => {
        setProduct(res.data.Item);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleDecrease = () => setQty(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQty(prev => Math.min(5, prev + 1));

  if (loading) {
    return   <>
      <div className="loading-body">
    <div className="loading-content">

    </div>
  </div>
</>
  }

  if (error || !product) {
    return (
      <div className="status-screen error-state">
        <p>We couldn't find this product. It might be out of stock or our servers are taking a nap.</p>
        <button onClick={() => navigate('/')} className="btn return-btn">
          Back to Homepage
        </button>
      </div>
    );
  }

  const { 
    name, 
    image, 
    ratingStar, 
    ratingCount, 
    priceCents, 
    description 
  } = product;

  const formattedPrice = (priceCents / 100).toFixed(2);

  return (
    <div className="page-wrapper">
      <Header />

      <main className="product-page">
        
        <section className="product-left">
          <div className="image-container">
            <img src={image} alt={name} />
          </div>

          <div className="action-buttons">
            <button className="btn add-cart">
              <span className="icon">🛍️</span> ADD TO CART
            </button>
          </div>
        </section>

        <section className="product-right">
          
          <header>
            <h1 className="title">{name}</h1>
            <div className="rating-section">
              <div className="rating-badge">{ratingStar} ★</div>
              <span className="rating-count">Loved by {ratingCount} people</span>
            </div>
          </header>

          <div className="price-box">
            <span className="price">${formattedPrice}</span>
            <span className="discount-tag">Just for you</span>
          </div>

          <div className="offers-section">
            <h3>🎁 Ways to save on this</h3>
            <ul className="offer-list">
              <li><strong>Card Perks:</strong> 10% instant joy on Credit Cards</li>
              <li><strong>On Us:</strong> Free delivery straight to your door</li>
            </ul>
          </div>

          <div className="quantity-section">
            <span className="qty-label">How many do you need?</span>
            
            <div className="qty-counter">
              <button onClick={handleDecrease} disabled={qty === 1} className="qty-btn" aria-label="Decrease quantity">−</button>
              <span className="qty-display" aria-live="polite">{qty}</span>
              <button onClick={handleIncrease} disabled={qty === 5} className="qty-btn" aria-label="Increase quantity">+</button>
            </div>
            
            {qty === 5 && <span className="qty-limit-msg">Wow, you really love these! (Max 5)</span>}
          </div>

          <div className="description-section">
            <h3>✨ Why you'll love it</h3>
            <p>{description || "We're still writing the story for this one, but trust us, it's great."}</p>
          </div>

        </section>
      </main>

      <Footer user />
    </div>
  );
}