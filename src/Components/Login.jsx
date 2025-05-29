import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/NavBar.css";
import { Link } from "react-router-dom";
import * as Api from '../Api/Apis';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

function Login() {

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('JWTToken')) {
            navigate('/')
        }
    }, [])


    const [SignInOpen, setSignInOpen] = useState(false);
    const [signUpDetails, setSignUpDetails] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [signUpDetailsErrors, setSignUpDetailsErrors] = useState({});
    const [invalidCredential, setInvalidCredential] = useState('')
    const[showPassword,setShowPassword]=useState()
  const {
    mutate: signInMutate,
    isLoading: isSignInLoading,
    isError: isSignInError,
    error: signInError,
    data: signInData
} = useMutation({
    mutationFn: Api.SignInApi,
    onSuccess: (res) => {
        const accessToken = res?.data?.data?.accessToken;

        if (accessToken) {
            localStorage.setItem("JWTToken", accessToken);

            setSignUpDetails({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            });

            toast.success('Login Successfully', {
                autoClose: 1000,
                onClose: () => navigate('/'), // Wait for toast to close before redirect
            });
        } else {
            setInvalidCredential('Invalid email or password');
            toast.error('Invalid email or password');
        }
    },
    onError: (err) => {
        setInvalidCredential('Invalid email or password');
        toast.error('Login Failed');
    },
});

const {
    mutate: signUpMutate,
    isLoading: isSignUpLoading,
    isError: isSignUpError,
    error: signUpError,
    data: signUpData
} = useMutation({
    mutationFn: Api.SignUpApi,
    onSuccess: (res) => {
        console.log('SignUp Success', res);
        toast.success('Create Account Successfully', {
            autoClose: 1000,
            onClose: () => window.location.reload(),
        });
        setSignUpDetails({
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        });
    },
    onError: (err) => {
        console.error('SignUp Error', err);
        toast.error('SignUp Failed');
    },
});



    console.log(invalidCredential);


    //   console.log({ data,
    //     isLoading,
    //     isError,
    //     error});



    const onAuthenticatedSignUp = (e) => {
        e.preventDefault();

        const errors = onFormValidate();
        if (Object.keys(errors).length === 0) {
            signUpMutate(signUpDetails);
            
        }
        
        setInvalidCredential('')
    };

    const onAuthenticatedSignIn = (e) => {
        e.preventDefault();

        const errors = onFormValidate();
        if (!errors.email && !errors.password) {
            const signInData = {
                email: signUpDetails.email,
                password: signUpDetails.password,
            }
            signInMutate(signInData);


        }

    };

    const onFormValidate = () => {
        const errors = {};
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const namePattern = /^[a-zA-Z\s]+$/;


        if (!signUpDetails.firstName.trim()) {
            errors.firstName = "first name cannot be empty";
        }
        else if (!namePattern.test(signUpDetails.firstName)) {
            errors.firstName = "Enter valid first name";
        }
        if (!signUpDetails.lastName.trim()) {
            errors.lastName = "last name cannot be empty";
        }
        else if (!namePattern.test(signUpDetails.lastName)) {
            errors.firstName = "Enter valid last name";
        }
        if (!signUpDetails.email.trim()) {
            errors.email = "email cannot be empty";
        }
        else if (!emailPattern.test(signUpDetails.email)) {
            errors.email = "Enter valid email";
        }
        if (!signUpDetails.password.trim()) {
            errors.password = "password cannot be empty";
        }
        else if (!(signUpDetails.password.trim().length > 7 && signUpDetails.password.trim().length < 16)) {
            errors.password = "password should be in 8-15 character";
        }

        setSignUpDetailsErrors(errors);
        return errors;
    };

    const onLoginInputChange = (e) => {
        const { name, value } = e.target;

        setSignUpDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    return (
        <>
            {!SignInOpen ? (
                <div className="login">
                    <form>
                        <h2 style={{ textAlign: "center", fontFamily: "system-ui" }}>Sign-In</h2>
                        <div className="form">
                            <label>E-mail</label>
                            <input type="text" className="SigninForm" name="email" value={signUpDetails.email} onChange={onLoginInputChange} />
                            <div style={{ color: "red" }}>{signUpDetailsErrors.email}</div>
                        </div>
                        <div className="form">
                            <label>Password</label>
                            <div style={{display:'flex'}}>
                            <input type={showPassword?"text":"Password"} className="SigninForm" name="password" value={signUpDetails.password} onChange={onLoginInputChange} />
                            <span className="eyeHint" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>

                            </div>
                            <div style={{ color: "red" }}>{signUpDetailsErrors.password}</div>
                        </div>
                        <button onClick={onAuthenticatedSignIn}>Submit</button>
                        <div id="SignIn" style={{ display: "flex", justifyContent: "center", width: "100%", gap: "30px" }}>
                            <p onClick={() => {
                                setSignInOpen(true), setSignUpDetailsErrors(''), setSignUpDetails({
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    password: ""
                                })
                            }}><Link className="LinktoCreate" onClick={()=>setShowPassword(false)}>Create Account</Link></p>
                        </div>
                        <div style={{ color: "red" }}>{invalidCredential}</div>
                    </form>
                </div>
            ) : (
                <div className="login">
                    <form>
                        <h2 style={{ textAlign: "center", fontFamily: "system-ui" }}>Sign-Up</h2>
                        <div className="form">
                            <label>First Name</label>
                            <input type="text" className="SignupForm" name="firstName" value={signUpDetails.firstName} onChange={onLoginInputChange} />
                            <div style={{ color: "red" }}>{signUpDetailsErrors.firstName}</div>
                        </div>
                        <div className="form">
                            <label>Last Name</label>
                            <input type="text" className="SignupForm" name="lastName" value={signUpDetails.lastName} onChange={onLoginInputChange} />
                            <div style={{ color: "red" }}>{signUpDetailsErrors.lastName}</div>
                        </div>
                        <div className="form">
                            <label>E-mail</label>
                            <input type="email" className="SignupForm" name="email" value={signUpDetails.email} onChange={onLoginInputChange} />
                            <div style={{ color: "red" }}>{signUpDetailsErrors.email}</div>
                        </div>
                        <div className="form">
                            <label>Password</label>
                            <div style={{display:'flex'}}>
                            <input type={showPassword?"text":"Password"} className="SignupForm" name="password" value={signUpDetails.password} onChange={onLoginInputChange} />
                            <span className="eyeHint" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
                            </div>
                            <div style={{ color: "red" }}>{signUpDetailsErrors.password}</div>
                        </div>
                        <button onClick={onAuthenticatedSignUp}>Submit</button>
                        <div id="SignIn" style={{ textAlign: "center" }}>
                            <p onClick={() => {
                                setSignInOpen(false), setSignUpDetailsErrors(''), setSignUpDetails({
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    password: ""
                                })
                            }}><Link className="LinktoCreate" onClick={()=>{setSignUpDetails({email: "",
                                    password: ""},invalidCredential(''),setSignUpDetailsErrors(''),setShowPassword(false))}}>Sign-In</Link></p>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default Login;
