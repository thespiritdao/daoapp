import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthService } from './services/auth';

// Import your components here
import Login from './components/Login';
import Shop from './components/Shop';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import ProductUpload from './components/ProductUpload';
import ErrorBoundary from './components/ErrorBoundary';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { isValid } = await AuthService.verifyToken();
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Shop} />
            <PrivateRoute path="/cart" component={Cart} />
            <PrivateRoute path="/checkout" component={Checkout} />
            <PrivateRoute path="/orders" component={OrderHistory} />
            <PrivateRoute path="/upload" component={ProductUpload} />
          </Switch>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;