import axios from "./axiosInstance";

export const addReview = (formData) =>
    axios.post("/reviews/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

export const getReviews = (params = {}) =>
        axios.get("/reviews", { params });
      
//export const getReviewById = (reviewId) =>
 //       axios.get(`/reviews/${reviewId}`);

export const getReviewsByProductId = (productId) =>
        axios.get(`/reviews/product/${productId}`);
      
export const updateReview = (reviewId, formData) =>
        axios.put(`/reviews/${reviewId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      
export const deleteReview = (reviewId) =>
        axios.delete(`/reviews/${reviewId}`);    