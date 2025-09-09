import Config from "react-native-config";

export default {
  baseURL: "https://nbl.onyxtec.io/api",
  userimageURL: "https://nbl.onyxtec.io/storage/user/",
  attachmentimageURL: "https://nbl.onyxtec.io/storage/job_attachments/",
  postAttachmentImageURL: "https://nbl.onyxtec.io/storage/post_attachments/",
  categoriesImageURL: "https://nbl.onyxtec.io/storage/categories/",

//ngrok
  // baseURL: "https://a169a4416042.ngrok-free.app/api",
  // userimageURL: "https://23f1883e1980.ngrok-free.app/storage/user/",
  // attachmentimageURL: "https://23f1883e1980.ngrok-free.app/storage/job_attachments/",
  // postAttachmentImageURL: "https://23f1883e1980.ngrok-free.app/storage/post_attachments/",


};

// import Config from 'react-native-config';

// export default {
//   baseURL: Config.API_URL,
//   imageURL: Config.IMG_URL,
// };



// import Config from "react-native-config";

// const IS_LIVE = Config.IS_LIVE === "true" ;

// const API_BASE = IS_LIVE ? Config.API_URL_LIVE : Config.API_URL_DEV;
// const STORAGE_BASE = IS_LIVE ? Config.STORAGE_URL_LIVE : Config.STORAGE_URL_DEV;

// export default {
//   api: {
//     baseURL: API_BASE,
//   },
//   storage: {
//     userimageURL: `${STORAGE_BASE}/user/`,
//     attachmentimageURL: `${STORAGE_BASE}/job_attachments/`,
//   },
// };
