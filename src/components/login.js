import { useState } from "react";
import '../App.css';
import { object,string } from "yup";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";
const userSchema = object({
    email:string().email().required(),
    password:string().min(6).max(12).required()
});
const Login=()=>{
    const [details,setDetails] = useState({
        email:'',
        password:''
    });
    const [errors,setErrors] = useState({});
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const handleOnChange=(key,value)=>{
        setDetails({...details,[key]:value})
    }
    const handleSubmit = ()=>{
        setLoading(true)
        userSchema.validate(details,{abortEarly:false}).then((res)=>{
            setErrors({});
            axios({
                method:'post',
                url:'https://api.backendless.com/BFB1C5CE-4984-1444-FFC6-C5F99F8DF500/2D6508CA-D333-4FAD-A55C-94CF94272EB5/users/login',
                data:{
                    login: details['email'],
                    password: details['password']
                     }
            }).then((res)=>{
                if(res.status==200){
                    console.log(res);
                    localStorage.setItem('email',res.data.email);
                    localStorage.setItem('name',res.data.name);
                    setLoading(false);
                    toast.success('logged in successfully!');
                    const token = res.data['user-token'];
                    localStorage.setItem('EcomToken',token);
                    navigate('/productfeed');
                }
             }).catch((err)=>{
                setLoading(false)
                console.log(err);
                toast.error(err.response.data.message)
            })
        }).catch((err)=>{
            let errObj = {};
            err.inner.map((err)=>{
                errObj[err.path] = err.message;
            })
            setErrors(errObj);
        });
    }
    return(
        <div className='d-flex justify-content-center align-items-center'style={{height:'100%'}}>
        <div className="form-group container1" style={{width:'25%',borderRadius:10,marginTop:'5%'}}>
            <br/>
            <h3 className='text-primary'>Login</h3>
            <hr/>
            <div><input type="email" className='form-control' placeholder="Enter email" style={{width:'90%',marginLeft:15,marginTop:10}} onChange={(event)=>{handleOnChange('email',event.target.value)}}/>
            <p className="text-danger">{errors['email']}</p>
            </div>
            <div><input type="password" className='form-control'placeholder="Password" style={{width:'90%',marginLeft:15,marginTop:10}} onChange={(event)=>{handleOnChange('password',event.target.value)}}/>
            <p className="text-danger">{errors['password']}</p>
            </div>
            {
                loading?
                <>
                  <div class="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary" role="status"></div>
                        <div style={{marginLeft:20,marginTop:10}} className='text-primary'><p>credentials verification</p></div>
                 </div>
                </>:null
            }
            <div><button type="submit" className="btn btn-primary" style={{width:'90%',marginTop:10}} onClick={handleSubmit}>Login</button></div>
            <br/>
            <p className='text-secondary'>Not registered? <Link to='/signup'>Signup</Link> here</p>
            <br/>
        </div>
           
    </div>
    )
}

export default Login;