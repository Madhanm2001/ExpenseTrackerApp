import { transactionDetails, transactionList } from "./Apis";

export const RoutApi={
    Auth:{
        signUp:"/auth/signup",
        signIn:"/auth/login",
        resetPassword:"/auth/reset-password"
    },
    Profile:{
       getUserProfile:'/user/profile',
       updateUserProfile:'/user/update-profile'
    },
    Transaction:{
        transactionOverview:'/transaction/overview',
        createTransaction:'/transaction/create',
        transactionList:'/transaction/list',
        transactionDetails:'/transaction/detail',
        transactionDetailsEdit:'/transaction/update',
        transactionDetailsDelete:'/transaction',
    }
} 