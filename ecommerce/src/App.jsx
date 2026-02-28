import './App.css';
import {HomePage} from './pages/HomePage.jsx';
// import { CheckoutPage} from './pages/CheckoutPage.jsx';
// import {OrderPage} from './pages/OrderPage.jsx'
import { Routes, Route } from 'react-router'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="checkout" element={<CheckoutPage />} />
      <Route path="orders" element={<OrderPage />} /> */}
    </Routes>
  );
}

export default App;