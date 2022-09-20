import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ProductFeed = ()=>{
    const [feeds,setFeeds] = useState([]);
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const email= localStorage.getItem('email');
    const name= localStorage.getItem('name');
    const carId = localStorage.getItem(email);
    console.log(`${carId}`);
    const [cartinfo,setcartinfo] = useState({});
    const [addLoading,setaddloading] = useState(false);
    const [selectedbtnindex,setselectedbtnindex] = useState(undefined);
    useEffect(()=>{
        setLoading(true);
        axios({
            method:'get',
            url:'https://api.chec.io/v1/products',
            headers:{
                'X-Authorization': 'pk_185066f1f96affca255ca48cd4a64803a4b791d6d0d5b'
            }
        }).then((res)=>{
            setLoading(false);
            if(res.status==200)
            {
                setFeeds(res.data['data']);
            }
        }).catch((err)=>{
            setLoading(false);
            console.log(err);
            toast.error(err.response.data.error.message);
        })

        if(carId)
        {
            axios({
                method:'GET',
                url: `https://api.chec.io/v1/carts/${carId}`,
                headers:
                {
                    'X-Authorization': 'pk_185066f1f96affca255ca48cd4a64803a4b791d6d0d5b'
                }
            }).then((res)=>{
                setcartinfo(res.data);
                })
                .catch((err)=>{console.log(err)})
        }
        else{
            axios({
                method:'GET',
                url:'https://api.chec.io/v1/carts',
                headers: {
                    'X-Authorization':'pk_185066f1f96affca255ca48cd4a64803a4b791d6d0d5b'
                }
            }).then((res)=>{
               if(res.status==201)
               {
                localStorage.setItem(email,res.data.id);
                setcartinfo(res.data);
                console.log(res);
               }
            }).catch((err)=>{console.log(err)});
        }

    },[])
    const handleLogout=()=>{
        localStorage.setItem("EcomToken","");
        toast.error('logged out successfully');
        navigate('/login');
    }
    const handleAddCart= (productId,index)=>{
        const cartID = localStorage.getItem(email);
        setselectedbtnindex(index);
        setaddloading(true);
        axios({
            method:'POST',
            url:`https://api.chec.io/v1/carts/${cartID}`,
            headers:
            {
                'X-Authorization':'pk_185066f1f96affca255ca48cd4a64803a4b791d6d0d5b'
            },
            data:
            {
                id:productId,
                quantity:1
            }
        }).then((res)=>{
            setcartinfo(res.data.cart);
            setaddloading(false);
            toast.success('product added to cart successfully')
        }).catch((err)=>{console.log(err)})
    }
    const addedProducts = cartinfo.line_items ? cartinfo.line_items.map((item)=>item.product_id):[];
    // console.log(addedProducts);
    const handleRemoveCart = (productId,index)=>{
        const cartID = localStorage.getItem(email);
        setselectedbtnindex(index);
        setaddloading(true);
        const filter = cartinfo.line_items.filter((item)=>{
            return item.product_id == productId
        })
        const itemid = filter[0].id;
        axios({
            method:'DELETE',
            url: `https://api.chec.io/v1/carts/${cartID}/items/${itemid}`,
            headers:{
                'X-Authorization':'pk_185066f1f96affca255ca48cd4a64803a4b791d6d0d5b'
            }
        }).then((res)=>{
            console.log(res);
            setcartinfo(res.data.cart);
            setaddloading(false);
            toast('product removed from cart successfully!');
        }).catch((err)=>{console.log(err)});
        
    }

    const handleCheckout = ()=>{
        navigate('/checkout')
    }

    return(
      <>
        <div className="d-flex">
         <div><h1 style={{color:'#120E43'}}>Products Feed</h1></div>
         <div style={{marginLeft:'72%',marginTop:10}}><button className="btn btn-danger" onClick={handleLogout}>logout</button></div>
        </div>
        <div>
            <h3 style={{textTransform:'capitalize',color:'#120E43'}}>Welcome {name}</h3>
            <p>Products Added : {cartinfo.total_items||'0'}</p>
            <p>Grand total : {cartinfo.subtotal?cartinfo.subtotal.formatted_with_code:'0 INR'}</p>
        </div>
            {
                loading?
                <>
                <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary" role="status"></div>
                        <div className="spinner-grow text-primary" style={{marginLeft:20}} role="status"></div>
                        <div style={{marginLeft:20,marginTop:10}} className='text-primary'><p><strong>Loading ...</strong></p></div>
                 </div>
                 
                </>:null
            }
        <div className="d-flex flex-row flex-wrap">
            
            {
                feeds.map((feed,i)=>{
                    const id = feed.id;
                    return(
                        <>
                          <div className="card overflow-hidden" style={{width:'15%',height:350,margin:10}}>
                                    <img className="card-img-top" src={feed.image.url} alt="Card image cap" style={{height:200,width:188}}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{feed.name}</h5>
                                        {/* <p className="card-text">{feed.description.slice(0,20)}</p> */}
                                        <p className="card-title text-success"><small>Price:{feed.price['formatted_with_symbol']}</small></p>
                                        {
                                            addedProducts.includes(feed.id)?(
                                                <button class="btn btn-danger" style={{width:'100%',height:40}} onClick={()=>{handleRemoveCart(id,i);}}>{
                                                    (selectedbtnindex == i)?( addLoading?
                                                     <>
                                                        <div className="spinner-border text-white spinner-border-sm" role="status"></div>
                                                     </>:<p>Remove from cart</p>):<p>Remove from cart</p>
                                                 }</button>
                                            ):(
                                                <button class="btn btn-primary" style={{width:'100%',height:40}} onClick={()=>{handleAddCart(id,i);}} >{
                                                   (selectedbtnindex == i)?( addLoading?
                                                    <>
                                                       <div className="spinner-border text-white spinner-border-sm" role="status"></div>
                                                    </>:<p>Add to cart</p>):<p>Add to cart</p>
                                                }
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                        </>
                     )
                })
            }
        </div>
        {
            cartinfo.total_items>0?(<button className="btn text-white" style={{marginLeft:'90%', marginBottom:10,backgroundColor:'#fb641b'}}onClick={handleCheckout}>checkout</button>):null
        }
      </>
    )
}

export default ProductFeed;