// // viewmodels/RegisterViewModel.js

// import apiClient from '../../api/client';
// import RegisterModel from '../../models/RegisterModel';

// class RegisterViewModel {
//   async registerUser(userData) {
//     const model = new RegisterModel(userData);

//     try {
//       const response = await apiClient.post('/register', model.toJSON());
//       return {
//         success: response.data.success,
//         message: response.data.message,
//         data: response.data.data,
//         statusCode: response.data.statusCode,
//       };
//     } catch (error) {
//       console.error('Register error:', error.response?.data || error.message);
    
//       return {
//         success: false,
//         error: {
//           message:
//             error.response?.data?.message ||
//             error.message ||
//             'An unexpected error occurred',
//         },
//       };
//     }
//   }
// }

// export default new RegisterViewModel();


import apiClient from '../../api/client';

class RegisterViewModel {
  async registerUser(userData) {
    const formData = new FormData();

    // Append all regular fields
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.password_confirmation);
    formData.append('phone', userData.phone);
    formData.append('country_code', userData.country_code);
    formData.append('address', userData.address);
    formData.append('longitude', userData.longitude);
    formData.append('latitude', userData.latitude);

    // Append image file only if it exists
    if (userData.profile_photo) {
      const fileName = userData.profile_photo.split('/').pop();
      const fileType = fileName.split('.').pop();

      formData.append('profile_photo', {
        uri: userData.profile_photo,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await apiClient.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
        statusCode: response.data.statusCode,
      };
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);

      return {
        success: false,
        error: {
          message:
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred',
        },
      };
    }
  }
}

export default new RegisterViewModel();
