// models/RegisterModel.js

export default class RegisterModel {
    constructor({
      name,
      email,
      password,
      password_confirmation,
      phone,
      country_code,
      address,
      profile_photo,
      latitude,
      longitude,
    }) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.password_confirmation = password_confirmation;
      this.phone = phone;
      this.country_code = country_code;
      this.address = address;
      this.profile_photo = profile_photo; // base64 or URL or file
      this.latitude = latitude;
      this.longitude = longitude;
    }
  
    toJSON() {
      return {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        phone: this.phone,
        country_code: this.country_code,
        address: this.address,
        profile_photo: this.profile_photo,
        latitude: this.latitude,
        longitude: this.longitude,
      };
    }
  }
  