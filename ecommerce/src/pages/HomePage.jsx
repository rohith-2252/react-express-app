
import './HomePage.css'
import { useState, useEffect } from 'react';

import { Header } from '../component/header.jsx'
function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(response => response.json())
      .then(data => {

        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Products....</div>
  console.log(products[0]);

  return (
    <>
      <Header> </Header>
      <div className="home-page">
        <div className="products-grid">
          {products.map((product) => (

            <>
              <div className="product-container" key={product.id}>
                <div className="product-image-container">
                  <img className="product-image"
                    src={product.image} />
                </div>

                <div className="product-name limit-text-to-2-lines">
                  {product.name}
                </div>

                <div className="product-rating-container">
                  <img className="product-rating-stars"
                    src={`/images/ratings/rating-${(product.rating.stars) * 10}.png`} />
                  <div className="product-rating-count link-primary">
                    {(product.rating.count)}
                  </div>
                </div>

                <div className="product-price">
                  ${(Number(product.priceCents || 0) / 100).toFixed(2)}
                </div>

                <div className="product-quantity-container">
                  <select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>

                <div className="product-spacer"></div>

                <div className="added-to-cart">
                  <img src="images/icons/checkmark.png" />
                  Added
                </div>

                <button className="add-to-cart-button button-primary">
                  Add to Cart
                </button>
              </div>
            </>
          ))}
        </div>
      </div >
    </>
  );

}

export default HomePage;