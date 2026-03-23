import './checkout-header.css'
import './CheckoutPage.css'
import {Footer} from '../component/Footer';
import { useState, useEffect } from 'react';
import axios from 'axios';


export function CheckoutPage() {

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/cart', { withCredentials: true })
            .then(res => { setCartItems(res.data) })
            .catch(err => console.error(err));
    }, []);
    const totalCents = cartItems.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0);
    //here sum is act as a accumulator and item is act as next element
    const shippingCents = cartItems.reduce((sum,item)=> sum +(item.shipping),0);
    const totalBeforeTax = totalCents + shippingCents;
    const taxCents = totalBeforeTax * 0.1;
    const orderTotal = totalBeforeTax + taxCents



    function getDate(daysAgo) {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date();
        date.setDate(date.getDate() + daysAgo);
        const day = date.getDate();
        const month = date.getMonth();
        const nameDay = date.getDay();
        return `${dayNames[nameDay]}, ${monthNames[month]} ${day}`;

    }
    const updateCart = async (itemCount, productId, userId) => {
        if (itemCount == 1) {
            return;
        }
        try {
            const response = await axios.put(`http://localhost:3001/api/cart/${itemCount}/${productId}/${userId}`,
                {},
                { withCredentials: true }
            )
            fetchData();
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/cart', {}, { withCredentials: true });
            setCartItems(response.data);
            console.log(response.data);
            console.log("Data fetched");
        }
        catch (err) {
            console.error(err);
        }
    }

    const deleteProduct = async (id, product) => {
        try {
            const response = await axios.delete(
                `http://localhost:3001/api/cart/${id}/${product}`,
                { withCredentials: true }
            );
            console.log(response.data);
        } catch (err) {
            console.log("Error", err);
        }

        fetchData();
    }
    const [showCount, setShowCount] = useState(null);
    const renderCount = (id) => {
        setShowCount(id);
    }

    const placeOrder = () => {
        console.log("OrderPlaced");
    }
    const changeShippingOption = (date,productId,shipping,userId)=>{
        axios.put(
            `http://localhost:3001/api/cart/option`,
            [date,productId,shipping,userId],
            {withCredentials:true}
        );
        fetchData();
    }


    
    return (
        <>
            <title>Checkout</title>
            <div className="checkout-header">
                <div className="header-content">
                    <div className="checkout-header-left-section">
                        <a href="/">
                            <img className="logo" src="images/logo-white.png" />
                            <img className="mobile-logo" src="images/mobile-logo.png" />
                        </a>
                    </div>

                    <div className="checkout-header-middle-section">
                        Checkout (<a className="return-to-home-link"
                            href="/"> {cartItems.length} items</a>)
                    </div>

                    <div className="checkout-header-right-section">
                        <img src="images/icons/checkout-lock-icon.png" />
                    </div>
                </div>
            </div>

            <div className="checkout-page">
                <div className="page-title">Review your order</div>

                <div className="checkout-grid">
                    <div className="order-summary">

                        {cartItems.map((item) => (
                            <div className="cart-item-container" key={item.productId}>
                                <div className="cart-item-details-grid">
                                    <img className="product-image" src={item.image} />
                                    <div className="cart-item-details">
                                        <div className="product-name">{item.name}</div>
                                        <div className="product-price">
                                            ${(item.priceCents / 100).toFixed(2)}
                                        </div>
                                        <div className="product-quantity">
                                            Quantity: <span className="quantity-label">{item.quantity}</span>
                                            <span
                                                className="update-quantity-link link-primary"
                                                onClick={() => renderCount(item.productId)}
                                            >
                                                {(showCount == item.productId ?
                                                    <>
                                                        <button onClick={() => { updateCart(item.quantity + 1, item.productId, item.id) }}>+</button>
                                                        <button onClick={() => { updateCart(item.quantity - 1, item.productId, item.id) }}>-</button>
                                                    </>
                                                    :
                                                    "Update"
                                                )}
                                            </span>
                                            <span className="delete-quantity-link link-primary" onClick={() => deleteProduct(item.id, item.productId)}>
                                                Delete
                                            </span>
                                        </div>
                                    </div>
                                    <div className="delivery-options">
                                        <div className="delivery-options-title">
                                            Choose a delivery option:
                                        </div>
                                        <div className="delivery-option">
                                            <input type="radio" 
                                                className="delivery-option-input"
                                                name={item.productId}  
                                                checked ={item.shipping == 0}
                                                onChange={()=>{changeShippingOption(getDate(6),item.productId,0,item.id)}}/>
                                            <div>
                                                <div className="delivery-option-date">
                                                    {getDate(6)}
                                                </div>
                                                <div className="delivery-option-price">
                                                    FREE - Shipping
                                                </div>
                                            </div>
                                        </div>
                                        <div className="delivery-option">
                                            <input type="radio"
                                                className="delivery-option-input"
                                                name={item.productId}
                                                checked ={item.shipping == 499}
                                                onChange={()=>{changeShippingOption(getDate(4),item.productId,499,item.id)}} 
                                                />
                                            <div>
                                                <div className="delivery-option-date">
                                                    {getDate(4)}
                                                </div>
                                                <div className="delivery-option-price">
                                                    $4.99 - Shipping
                                                </div>
                                            </div>
                                        </div>
                                        <div className="delivery-option">
                                            <input type="radio"
                                                className="delivery-option-input"
                                                name={item.productId} 
                                                checked ={item.shipping == 999}
                                                onChange={()=>{changeShippingOption(getDate(2),item.productId,999,item.id)}}
                                                />
                                            <div>
                                                <div className="delivery-option-date">
                                                    {getDate(2)}
                                                </div>
                                                <div className="delivery-option-price">
                                                    $9.99 - Shipping
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="payment-summary">
                        <div className="payment-summary-title">Payment Summary</div>
                        <div className="payment-summary-row">
                            <div>Items ({cartItems.length}):</div>
                            <div>${(totalCents / 100).toFixed(2)}</div>
                        </div>
                        <div className="payment-summary-row subtotal-row">
                            <div>Total before tax:</div>
                            <div className="payment-summary-money">${(totalBeforeTax / 100).toFixed(2)}</div>
                        </div>

                        <div className="payment-summary-row">
                            <div>Estimated tax (10%):</div>
                            <div className="payment-summary-money">${(taxCents / 100).toFixed(2)}</div>
                        </div>

                        <div className="payment-summary-row total-row">
                            <div>Order total:</div>
                            <div>${(orderTotal / 100).toFixed(2)}</div>
                        </div>
                        <div>
                            <button className="order-button" onClick={() => { placeOrder() }}>
                                <p className="order-button-font"> Order</p>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            
            <Footer user={name = "rohan"}></Footer>
        </>
    );


}
