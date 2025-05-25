import React, { useEffect, useState } from "react";
import ProfileImg from '../images/Avatar2.jpg';
import '../Styles/Profile.css';
import { Link } from "react-router-dom";
import PopUpModal from "../common/Modal";
import * as Api from '../Api/Apis';
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function Profile() {
    const [show, setShow] = useState(false)
    const [editShow, setEditShow] = useState(false)
    const [ResetPasswordDetails, setResetPasswordDetails] = useState({ oldPassword: "", newPassword: "" })
    const [ResetPasswordErrors, setResetPasswordErrors] = useState({ oldPassword: "", newPassword: "" })
    const [profileDetails, setProfileDetails] = useState({ firstName: "", lastName: "", email: "" })
    const [profileDetailsErrors, setProfileDetailsErrors] = useState({ firstName: "", lastName: "", email: "" })
    // const [invalidCredential,setInvalidCredential]=useState('')


    const { data: profileData, isLoading, error } = useQuery({
        queryKey: ['getUserProfile'],
        queryFn: Api.getUserProfile,
    });




    console.log(profileData, "dataprofile");



    const ResetPasswordDetailsChange = (e) => {

        const { name, value } = e.target
        setResetPasswordDetails(
            (ps) => ({
                ...ps,
                [name]: value
            }))
    }

    const UpdateProfileDetailsChange = (e) => {

        const { name, value } = e.target
        setProfileDetails(
            (ps) => ({
                ...ps,
                [name]: value
            }))
    }
    const validateResetPasswordForm = () => {
    const errors = {};
    if (!ResetPasswordDetails.oldPassword.trim()) {
        errors.oldPassword = "old password cannot be empty";
    } else if (!(ResetPasswordDetails.oldPassword.length >= 8 && ResetPasswordDetails.oldPassword.length <= 15)) {
        errors.oldPassword = "old password should be in 8 letters";
    }
    if (!ResetPasswordDetails.newPassword.trim()) {
        errors.newPassword = "new password cannot be empty";
    } else if (!(ResetPasswordDetails.newPassword.length >= 8 && ResetPasswordDetails.newPassword.length <= 15)) {
        errors.newPassword = "new password should be 8-15 characters";
    }
    setResetPasswordErrors(errors);
    return errors;
};

const validateProfileUpdateForm = () => {
    const errors = {};
    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!profileDetails.firstName.trim()) {
        errors.firstName = "first name cannot be empty";
    } else if (!namePattern.test(profileDetails.firstName)) {
        errors.firstName = "Enter valid first name";
    }

    if (!profileDetails.lastName.trim()) {
        errors.lastName = "last name cannot be empty";
    } else if (!namePattern.test(profileDetails.lastName)) {
        errors.lastName = "Enter valid last name";
    }

    if (!profileDetails.email.trim()) {
        errors.email = "email cannot be empty";
    } else if (!emailPattern.test(profileDetails.email)) {
        errors.email = "Enter valid email";
    }

    setProfileDetailsErrors(errors);
    return errors;
};




    const {
        mutate: RestPasswordMutate,
        isLoading: isSignInLoading,
        isError: isSignInError,
        error: signInError,
        data: signInData
    } = useMutation({
        mutationKey:["resetPassword"],
        mutationFn: Api.ResetPasswordApi,
        onSuccess: (res) => {

            if (res) {

                setResetPasswordDetails({
                    oldPassword: "",
                    newPassword: ""
                });
                setResetPasswordErrors({ oldPassword: "", newPassword: "" })
                toast.info('Password is Changed', {
                autoClose: 1500,
                onClose: () => window.location.reload()
            });
                
            }
            else {
                setResetPasswordErrors({ oldPassword: "old password is not valid" })
            }
        },
        onError: (err) => console.error('Login Error', err),
    });

     const {
        mutate: UpdateProfileMutate,
        isLoading: isUpdateProfileLoading,
        isError: isUpdateProfileError,
        error: UpdateProfileError,
        data: UpdateProfileData
    } = useMutation({
        mutationKey:["updateProfile"],
        mutationFn: Api.updateUserProfile,
        onSuccess: (res) => {

            if (res) {

                setProfileDetails({
                    firstName: "",
                    lastName: "",
                    email:''
                });
                setProfileDetailsErrors({ firstName: "",
                    lastName: "",
                    email:'' })
                toast.info('Profile Details are Updated', {
                autoClose: 1500,
                onClose: () => window.location.reload()
            });
            }
        },
        onError: (err) => console.error('Login Error', err),
    });
    console.log(signInData, "data for signin");

const onAuthenticatedResetPassword = (e) => {
    e.preventDefault();
    const errors = validateResetPasswordForm();
    if (Object.keys(errors).length === 0) {
        const resetPasswordData = {
            oldPassword: ResetPasswordDetails.oldPassword,
            newPassword: ResetPasswordDetails.newPassword,
        };
        RestPasswordMutate(resetPasswordData);
    }
};

const onSubmitUpdateProfile = (e) => {
    e.preventDefault();
    const errors = validateProfileUpdateForm();
    if (Object.keys(errors).length === 0) {
        UpdateProfileMutate(profileDetails);
    }
};



    console.log(profileDetails, "profileDetails");

    return (
        <div id="profileDetails">
            <PopUpModal
                show={show}
                closeButton={true}
                closeFunction={() => setShow(false)}
                overlayFunction={() => setShow(false)}
                headerContent={"Reset Password"}
                bodyContent={
                    <>
                        <div className="restform">
                            <label>old password</label>
                            <input type="password" name="oldPassword" value={ResetPasswordDetails.oldPassword} onChange={ResetPasswordDetailsChange} />
                            <div style={{ color: "red" }}>{ResetPasswordErrors.oldPassword}</div>
                        </div>
                        <div className="restform">
                            <label>new password</label>
                            <input type="Password" name="newPassword" value={ResetPasswordDetails.newPassword} onChange={ResetPasswordDetailsChange} />
                            <div style={{ color: "red" }}>{ResetPasswordErrors.newPassword}</div>
                        </div>
                    </>
                }
                footerContent={
                    <>
                        <button onClick={onAuthenticatedResetPassword}>Save</button>
                        <button onClick={() => setShow(false)}>Cancel</button>
                    </>
                }
            />
            <PopUpModal
                show={editShow}
                closeButton={true}
                closeFunction={() => setEditShow(false)}
                overlayFunction={() => setEditShow(false)}
                headerContent={"Reset Password"}
                bodyContent={
                    <>
                        <div className="restform">
                            <label>First Name</label>
                            <input type="text" name="firstName" value={profileDetails.firstName} onChange={UpdateProfileDetailsChange} />
                            <div style={{ color: "red" }}>{profileDetailsErrors.firstName}</div>
                        </div>
                        <div className="restform">
                            <label>Last Name</label>
                            <input type="Password" name="lastName" value={profileDetails.lastName} onChange={UpdateProfileDetailsChange} />
                            <div style={{ color: "red" }}>{profileDetailsErrors.lastName}</div>
                        </div>
                        <div className="restform">
                            <label>E-mail</label>
                            <input type="text" name="email" value={profileDetails.email} onChange={UpdateProfileDetailsChange} />
                            <div style={{ color: "red" }}>{profileDetailsErrors.email}</div>
                        </div>

                    </>
                }
                footerContent={
                    <>
                        <button onClick={onSubmitUpdateProfile}>Save</button>
                        <button onClick={() => setEditShow(false)}>Cancel</button>
                    </>
                }
            />
            {/* {console.log(data,":profileData")
            } */}
            <section id="form">
                <div id="ProfileDiv">
                    <img src={ProfileImg} alt="Profile" id="ProfileImage" />
                    <h3>{profileData?.data?.data?.firstName} {profileData?.data?.data?.lastName}</h3>
                </div>

                <div className="Profileform">
                    <h3>First Name</h3>
                    <p>{profileData?.data?.data?.firstName}</p>
                </div>
                <div className="Profileform">
                    <h3>Last Name</h3>
                    <p>{profileData?.data?.data?.lastName}</p>
                </div>
                <div className="Profileform">
                    <h3>E-mail</h3>
                    <p>{profileData?.data?.data?.email}</p>
                </div>
                <div id="EditProfile">
                    <p id="changePass" onClick={() => { setResetPasswordDetails({ oldPassword: "", newPassword: "" }), setResetPasswordErrors({ oldPassword: "", newPassword: "" }), setShow(!show) }}><Link className="LinktoCreate">Reset Password</Link></p>
                    <p id="ChangeProfile" onClick={() => { setEditShow(!editShow),setProfileDetails({firstName: "",
                    lastName: "",
                    email:''}), setProfileDetailsErrors({firstName: "",
                    lastName: "",
                    email:''}) }}><Link className="LinktoCreate">Edit Profile</Link></p>

                </div>
            </section>
        </div>
    );
}

export default Profile;
