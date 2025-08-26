// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import registerReducer from './slices/authSlice/registerSlice';
import verifyOtpReducer from './slices/authSlice/verifyOtpSlice';
import loginReducer from './slices/authSlice/loginSlice';
import resendOtpReducer from './slices/authSlice/resendOtpSlice';
import servicesReducer from './slices/servicesSlice/servicesSlice';
import categoriesReducer from './slices/categorySlice/categoriesSlice';
import profileReducer from './slices//authSlice/profileSlice';
import passwordReducer from './slices/authSlice/passwordSlice';
import forgotPasswordReducer from './slices/authSlice/forgotPasswordSlice';
import verifyForgetOtpReducer from './slices/authSlice/verifyForgotOtpSlice';
import resetForgotPasswordreducer from './slices/authSlice/resetPasswordSlice';
import jobDetailReducer from './slices/jobSlice/jobDetailSlice';
import jobReducer from './slices/jobSlice/jobSlice';
import offerReducer from './slices/jobSlice/offerSlice/offerSlice';
import notificationsReducer from './slices/notificationSlice/notificationSlice';
import featuredCategoriesReducer from './slices/consumerSlice/featuredCategoriesSlice';
import featuredServicesReducer from './slices/consumerSlice/featuredServicesSlice';
import postReducer from './slices/stageSlice/postSlice';



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
    verifyForgotOtp: verifyForgetOtpReducer,
    resetPassword: resetForgotPasswordreducer,
    job: jobReducer,
    jobDetail: jobDetailReducer,
    offer: offerReducer,
    notifications: notificationsReducer,
    featuredCategories: featuredCategoriesReducer,
    featuredServices: featuredServicesReducer,
    post: postReducer,
  },
});

export default store;
