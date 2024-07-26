import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import ItemForm from './components/ItemForm';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import PurchaseForm from './components/PurchaseForm';
import OrderTracker from './components/OrderTracker';
import CheckoutForm from './components/CheckoutForm';
import WalletLogin from './components/WalletLogin';
import './styles/App.css';

const mockProducts = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
  { id: 3, name: 'Product 3', price: 30 },
];

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement a function to verify the token with the backend
      // For now, we'll just set a user object
      setUser({ token });
    }
  }, []);

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const addToCart = (product) => {
    try {
      setCartItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === product.id);
        let updatedItems;
        if (existingItem) {
          updatedItems = currentItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          updatedItems = [...currentItems, { ...product, quantity: 1 }];
        }
        setTotalPrice(calculateTotalPrice(updatedItems));
        return updatedItems;
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = (productId) => {
    try {
      setCartItems(currentItems => {
        const updatedItems = currentItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        ).filter(item => item.quantity > 0);
        setTotalPrice(calculateTotalPrice(updatedItems));
        return updatedItems;
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const addNewItem = (newItem) => {
    setProducts(currentProducts => [...currentProducts, { ...newItem, id: Date.now() }]);
  };

  const handleCheckout = (orderData) => {
    console.log('Order placed:', orderData);
    alert('Order placed successfully!');
    setCartItems([]);
    setTotalPrice(0);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      {user ? (
        <Dashboard>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/shop">
              {isLoading ? (
                <p>Loading products...</p>
              ) : (
                <>
                  <ItemList products={products} addToCart={addToCart} />
                  <ItemForm onAddItem={addNewItem} />
                </>
              )}
            </Route>
            <Route exact path="/items" component={ItemList} />
            <Route exact path="/items/:id" component={ItemDetail} />
            <Route exact path="/items/new" component={ItemForm} />
            <Route exact path="/items/:id/edit" component={ItemForm} />
            <Route exact path="/orders" component={OrderList} />
            <Route exact path="/orders/:id" component={OrderDetail} />
            <Route exact path="/place-order" component={OrderForm} />
            <Route exact path="/purchase" component={PurchaseForm} />
            <Route exact path="/order-tracking" component={OrderTracker} />
            <Route path="/cart">
              <div className="cart-container">
                <Cart items={cartItems} removeFromCart={removeFromCart} totalPrice={totalPrice} user={user} />
              </div>
            </Route>
            <Route path="/checkout">
              <CheckoutForm 
                cartItems={cartItems} 
                totalPrice={totalPrice} 
                onCheckout={handleCheckout} 
                user={user}
              />
            </Route>
          </Switch>
        </Dashboard>
      ) : (
        <WalletLogin onLogin={handleLogin} />
      )}
    </Router>
  );
}