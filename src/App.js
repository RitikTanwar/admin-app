import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
import { fetchAllCategory, isUserLoggedIn ,} from './actions';
import PrivateRoute from './components/HOC/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import Products from './containers/Products';
import Orders from './containers/Orders';
import Category from './containers/Category';
import { getInitialData } from './actions';
import NewPage from './containers/NewPage';

function App() {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
    dispatch(getInitialData());
  },[]);

  return (
    <div className="App">
      <Switch>
        
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/page" component={NewPage} />
        <PrivateRoute path="/products" component={Products} />
        <PrivateRoute path="/orders" component={Orders} />
        <PrivateRoute path="/category" component={Category} />
      </Switch>
    </div>
  );
}

export default App;
