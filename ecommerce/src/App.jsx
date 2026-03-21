import './App.css';
import  HomePage  from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage';
import { CheckoutPage} from './pages/CheckoutPage.jsx';
import {OrderPage} from './pages/OrderPage.jsx'
import SingleProduct from './component/SingleProduct.jsx'
import { Routes, Route } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/checkout" element={<CheckoutPage/>} />
      <Route path="orders" element={<OrderPage />} />
      <Route path ="/product/:id" element={<SingleProduct/>}/>
    </Routes>
  );
}

export default App;