import './App.css';
import Login from './components/login';
import Signup from './components/signup';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import ProductFeed from './components/productfeed';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Checkout from './components/checkout';

const ProtectedRoute = (props)=>{
  const token = localStorage.getItem('EcomToken');
  if(token!="") return props.children;
  return <Navigate to="/login"/>
}

const UnprotectedRoute = (props)=>{
  const token = localStorage.getItem('EcomToken');
  if(token!="") return <Navigate to="/productfeed"/>;
  return props.children;
}

function App() {
 
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
      <Routes>
        <Route path='/*' element={<Signup/>}/>
        <Route path='/signup' element={
          <UnprotectedRoute>
            <Signup/>
          </UnprotectedRoute>
        }/>
        <Route path='/login' element={
          <UnprotectedRoute>
            <Login/>
          </UnprotectedRoute>

        }/>
        <Route path='/referal/:referalId' element={<Signup />}/>

        <Route path='/productfeed' element={
          <ProtectedRoute>
            <ProductFeed/>
          </ProtectedRoute>
        } />
        
        <Route path='/checkout' element={<Checkout/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
