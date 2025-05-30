import axiosInstance from './axiosInstance';
import { RoutApi } from "./ApiRoutes";

export const SignUpApi = async (data) => {
  try{
    const response = await axiosInstance.post(RoutApi.Auth.signUp, data);
    return response;
  }
  catch(err){
    console.log(err);
  }
    
}


export const SignInApi = async (data) => {
  try{
    const response = await axiosInstance.post(RoutApi.Auth.signIn, data);
    console.log(response);
    
    return response;
  }
  catch(err){
    console.log(err);
  }
    
}

export const ResetPasswordApi = async (data) => {
  try{
    const response = await axiosInstance.put(RoutApi.Auth.resetPassword, data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log(response);
    
    return response;
  }
  catch(err){
    console.log(err);
  }
    
}

export const getUserProfile = async () => {
  try{
    const response = await axiosInstance.get(RoutApi.Profile.getUserProfile, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log(response);
    
    return response;
  }
  catch(err){
    console.log(err);
  } 
}

export const updateUserProfile = async (data) => {
  try{
    const response = await axiosInstance.put(RoutApi.Profile.updateUserProfile,data);
    console.log(response);
    
    return response;
  }
  catch(err){
    console.log(err);
  }
    
}

export const transactionOverview = async (data) => {
  try {
    const url = `${RoutApi.Transaction.transactionOverview}?month=${data.month}&year=${data.year}`;

    const response = await axiosInstance.get(url, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(response);
    return response;
  } catch (err) {
    console.error("Transaction Overview API Error:", err);
    throw err; 
  }
};

export const createTransaction = async (data) => {
  try {
    const response = await axiosInstance.post(RoutApi.Transaction.createTransaction,data,{
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(response);
    return response;
  } catch (err) {
    console.error("Transaction Overview API Error:", err);
    throw err; 
  }
};

export const transactionList = async (data) => {

   const url = `${RoutApi.Transaction.transactionList}?month=${data.month}&year=${data.year}&startDate=${data.startDate}&endDate=${data.endDate}&type=${data.type}&category=${data.category}`;
  try {
    const response = await axiosInstance.get(url,{
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(response);
    return response;
  } catch (err) {
    console.error("Transaction Overview API Error:", err);
    throw err; 
  }
};

export const transactionDetails = async (date) => {

   const url = `${RoutApi.Transaction.transactionDetails}?date=${date}`;
  try {
    const response = await axiosInstance.get(url);
    console.log(response);
    return response;
  } catch (err) {
    console.error("Transaction Overview API Error:", err);
    throw err; 
  }
};

export const transactionDetailsEdit = async (id,data) => {
  
  
   const url = `${RoutApi.Transaction.transactionDetailsEdit}/${id}`;
  try {
    const response = await axiosInstance.put(url,data);
    console.log(response);
    return response;
  } catch (err) {
    console.error("Transaction Overview API Error:", err);
    throw err; 
  }
};

export const transactionDetailsDelete = async (id) => {
   const url = `${RoutApi.Transaction.transactionDetailsDelete}/${id}`;
  try {
    const response = await axiosInstance.delete(url);
    console.log(response);
    return response;
  } catch (err) {
    console.error("Transaction Overview API Error:", err);
    throw err; 
  }
};
