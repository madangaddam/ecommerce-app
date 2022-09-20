import {useParams} from 'react-router-dom';
import { useState } from 'react';
import {object,string,number} from 'yup';
import '../App.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const userSchema=object({
    email:string().email().required('required'),
    name:string().required().min(6),
    password:string().min(6).max(12).required(),
    confirmPassword:string().min(6).max(12).required().test('passord is matched',function(value){
        return value=this.parent.password;
    })
})

const Signup=()=>{
    const navigate = useNavigate();
    const params=useParams();
    const [details,setDetails] = useState({
        email:'',
        name:'',
        password:'',
        confirmPassword:''
    });
    const [errors,setErrors]=useState({});
    const [loading,setLoading] = useState(false);
    const handleOnChange=(key,value)=>{
        setDetails({...details,[key]:value})
    }
    const handleSumbit =()=>{
       setLoading(true);
       userSchema.validate(details,{abortEarly:false}).then((res)=>{
        setErrors({});
        console.log(res);
        axios({
            method:'post',
            url:'https://api.backendless.com/BFB1C5CE-4984-1444-FFC6-C5F99F8DF500/2D6508CA-D333-4FAD-A55C-94CF94272EB5/users/register',
            data: {
                name: details['name'],
                email: details['email'],
	            password: details['password']
            }
        }).then((res)=>{
            if(res.status == 200)
            {
                setLoading(false);
                console.log(res);
                toast.success('Signed up successfully');
                navigate('/login');
            }
            }).catch((err)=>{console.log(err)})
       })
       .catch((err)=>{
        let Obj={};
        err.inner.map((err)=>{
            return Obj[err.path]= err.message;
        })
        setErrors(Obj);
    })
    
    }
    return(
        <div className='d-flex justify-content-center align-items-center'style={{}}>
            <div className="form-group container1 d-block" style={{width:'25%',borderRadius:10,marginTop:'5%'}}>
                <br/>
                <h3 className='text-primary'>Registration</h3>
                <hr/>
                <div><input type="email" className='form-control' placeholder="Enter email" style={{width:'90%',marginLeft:15,marginTop:10}} onChange={(event)=>{handleOnChange('email',event.target.value)}}/>
                <p className='text-danger'>{errors['email']}</p>
                </div>
                <div><input type="text" className='form-control'placeholder="Name" style={{width:'90%',marginLeft:15,marginTop:10}} onChange={(event)=>{handleOnChange('name',event.target.value)}}/>
                <p className='text-danger'>{errors['name']}</p>
                </div>
                <div><input type="password" className='form-control'placeholder="Password" style={{width:'90%',marginLeft:15,marginTop:10}} onChange={(event)=>{handleOnChange('password',event.target.value)}}/>
                <p className='text-danger'>{errors['password']}</p>
                </div>
                <div><input type="password" className='form-control' placeholder="Confirm password" style={{width:'90%',marginLeft:15,marginTop:10}} onChange={(event)=>{handleOnChange('confirmPassword',event.target.value)}}/>
                <p className='text-danger'>{errors['confirmPassword']}</p>
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
                <div><button type="submit" className="btn btn-primary" style={{width:'90%',marginTop:10}} onClick={handleSumbit}>Signup</button></div>
                <br/>
                <p className='text-secondary'>Already registered? <Link to='/login'>login</Link> here</p>
                <br/>
            </div>
        </div>
    )
}

export default Signup;