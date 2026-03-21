import './SingleProduct.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';


export default function SingleProduct() {

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.post(`http://localhost:3001/api/singleProduct/${id}`)
      .then(res => {
        setProduct(res.data.Item);
        setLoading(false);
      }
      )
  },[id])

  if(loading) return (
    <>
      <div className="loading-body">
    <div className="loading-content">

    </div>
  </div>
</>
  )
 

  return (
    <>
      <Header></Header>
      <div>
        <div className="product-detail">
          <img src={product.image} />
          <div>
            <h2>{product.name}</h2>

                  <img className="product-rating-stars"
                    src={`../images/ratings/rating-${(product.ratingStar) * 10}.png`} />

            <h3>${product.priceCents}</h3>

            <p> {product.ratingCount}units sold</p>
          </div>
        </div>

        <h3>Related Products</h3>
        {/* <div className="related">
        {related.map(item => (
          <div key={item.id}>
            <img src={item.image} />
            <p>{item.name}</p>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div> */}

      </div>
      <Footer user></Footer>
    </>
  );
}