import Home from './components/Home';
import { Routes, Route } from 'react-router-dom';
import Purchase from './components/purchase';
import Products from './components/products';
import PurchaseSuccess from './components/Success'; 
import ServiceProducts from './components/Serviceproducts'
import OrderFormPage from './components/Servicepurchase';
import ServiceSuccess from './components/Servicesuccess';
import ServicePage from "./components/linksecurity";



function App() {
  return (
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/products" element = {<Products />} />
        <Route path = "/purchase/:id" element = {<Purchase />} />
        <Route path ="/payment-success" element = {<PurchaseSuccess />} />
        <Route path = "/serviceproducts" element = {<ServiceProducts />} />
        <Route path = "/order-form" element= {<OrderFormPage />} />
        <Route path = "/servicesuccess" element={<ServiceSuccess />} />
         {/* Tokenized WhatsApp redirect */}
        <Route path="/whatsapp/:token/:groupId" element={<ServicePage />} />

      </Routes>
  );
} 

export default App;
