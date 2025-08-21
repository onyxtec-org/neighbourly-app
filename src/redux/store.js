// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import registerReducer from './slices/auth/registerSlice';
import verifyOtpReducer from './slices/auth/verifyOtpSlice';
import loginReducer from './slices/auth/loginSlice';
import resendOtpReducer from './slices/auth/resendOtpSlice';
import servicesReducer from './slices/servicesSlice';
import categoriesReducer from './slices/categoriesSlice';
import profileReducer from './slices/auth/profileSlice'; 
import passwordReducer from './slices/auth/passwordSlice';
import forgotPasswordReducer from './slices/auth/forgotPasswordSlice';
import verifyForgetOtpReducer from './slices/auth/verifyForgotOtpSlice';
import resetForgotPasswordreducer from './slices/auth/resetPasswordSlice';
import jobDetailReducer from './slices/jobDetailSlice';
import jobReducer from './slices/jobSlice';
import offerReducer from './slices/offerSlice';
import notificationsReducer from './slices/notificationSlice';


import featuredCategoriesReducer from './slices/ConsumerDashboard/featuredCategoriesSlice';
import featuredServicesReducer from './slices/ConsumerDashboard/featuredServicesSlice';import notificationsReducer from './slices/notificationSlice';


import featuredCategoriesReducer from './slices/ConsumerDashboard/featuredCategoriesSlice';
import featuredServicesReducer from './slices/ConsumerDashboard/featuredServicesSlice';



const store = configureStore({
  reducer: {
    register: registerReducer,
    verifyOtp: verifyOtpReducer,
    login: loginReducer,
    resendOtp: resendOtpReducer,
    services: servicesReducer,
    categories: categoriesReducer,
    profile: profileReducer,
    password: passwordReducer,
    forgotPassword: forgotPasswordReducer,
    verifyForgotOtp : verifyForgetOtpReducer,
    resetPassword : resetForgotPasswordreducer,
    job: jobReducer, 
    jobDetail: jobDetailReducer, 
    offer: offerReducer,
    notifications:notificationsReducer,
    featuredCategories: featuredCategoriesReducer,
    featuredServices: featuredServicesReducer,
  },
});

export default store;
