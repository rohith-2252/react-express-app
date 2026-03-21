
import './HomePage.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

import { Header } from '../component/Header.jsx'
import { Footer } from '../component/Footer.jsx';



function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/check-auth')
      .then(res => {
        if (!res.data.authenticated) {
          navigate('/login')
        } else {
          setProfile(res.data.user);
          return axios.get('http://localhost:3001/api/products');
        }
      })
      .then(res => {
        if (res) {
          
          setProducts(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/login');
      });
  }, [navigate]);

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [addButton,setAddButton] = useState(null);
  const changeAddButton= (id)=>{
    
    setAddButton(id);

    setTimeout(()=>{
      setAddButton(null)
    },2000
  );

  }
  const singleProduct = (productid)=>{

    navigate(`/product/${productid}`);
            
  }


  const handleAddToCart = (productId) => {
    const quantity = selectedQuantities[productId] || 1;
    axios.post('http://localhost:3001/api/cart',
      { productId, quantity },
      { withCredentials: true }
    )
      .then(() => {
        changeAddButton(productId);
      }
      )
      .catch(err => console.error(err));
  }


  if (loading) return     <>
      <div className="loading-body">
    <div className="loading-content">

    </div>
  </div>
</>

  return (
    <>
      <Header> </Header>
      <div className="home-page">
        <div className="products-grid">
          {products.map((product) => (

            <>
              <div className="product-container" key={product.id} >
                <div className="product-image-container" onClick={()=>{singleProduct(product.id)}}>
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
                  <select onChange={(e) => setSelectedQuantities({ ...selectedQuantities, [product.id]: e.target.value })} >
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



                <button className="add-to-cart-button button-primary" key={product.id} onClick={() => handleAddToCart(product.id)}>
                  {(addButton == product.id ? "Added to Cart"
                    : "Add to Cart")}
                </button>

              </div>
            </>
          ))}
        </div>
      </div >
      <Footer
        user={profile}></Footer>


    </>

  );

}

export default HomePage;