import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Checkout = ()=>{
    const [cartinfo,setcartinfo] = useState([]);
    const email= localStorage.getItem('email');
    const cartID = localStorage.getItem(email);
    const [loading,setloading] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        setloading(true);
        axios({
            method:'GET',
            url:`https://api.chec.io/v1/carts/${cartID}`,
            headers:{
                'X-Authorization': 'pk_185066f1f96affca255ca48cd4a64803a4b791d6d0d5b'
            }
        }).then((res)=>{
            if(res.status==200)
            {
                console.log(res);
                setcartinfo(res.data);
                setloading(false);
            }
        }).catch((err)=>{console.log(err)});
    },[])
    
    const handleProdcutFeed =()=>{
        navigate('/productfeed');
    }

    
    return(
        <>
        <h2 style={{color:'#120E43'}}>INVOICE REPORT</h2>
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
                    <table className="table table-bordered border-dark" style={{width:'70%',marginLeft:'15%'}}>
                            <thead>
                                <tr>
                                <th scope="col">S.NO</th>
                                <th scope="col">PRODUCT NAME</th>
                                <th scope="col">IMAGE</th>
                                <th scope="col">QUANTITY</th>
                                <th scope="col">PRICE</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                               cartinfo.line_items?( cartinfo.line_items.map((lineitem,i)=>{
                                return(
                                    <>
                                    <tr key={i}>
                                        <th scope="row">{i+1}</th>
                                        <td>{lineitem.name}</td>
                                        <td><img src={lineitem.image.url} height='200' width='175'/></td>
                                        <td>{lineitem.quantity}</td>
                                        <td className="text-success">{lineitem.price['formatted_with_symbol']}</td>
                                    </tr>
                                    </>
                                )
                            })):null
                            }
                                <tr>
                                            <th scope="row" colSpan='4'>TOTAL</th>
                                            <td className="text-success">{cartinfo.subtotal?cartinfo.subtotal['formatted_with_symbol']:'₹0.00'}</td>
                                </tr>
                            </tbody>
                </table>
                <button className="btn btn-primary" onClick={handleProdcutFeed} style={{marginLeft:'90%',marginBottom:10}}>back</button>
        </>
    )
}

export default Checkout;