import axios from "./axiosInstance";

export const uploadBanner = (formData) => {
    return axios.post("/banners", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  
  export const getBanners = () => axios.get("/banners");
  export const deleteBanner = (id) => axios.delete(`/banners/${id}`);
