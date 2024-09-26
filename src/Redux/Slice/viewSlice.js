import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../Helper/helper";

export const getCarousel = createAsyncThunk(
    "view/carousel",
    async (data) => {
        try {
            const res = await axiosInstance.get("/api/user/carousel");
            return res.data;
        } catch (error) {
            console.log(error.response);
            return error.response.data
        }
    }
)
export const getCategories = createAsyncThunk(
  "view/categories",
  async (data) => {
    try {
      const res = await axiosInstance.get("/api/user/categories");
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
);

export const getBrands = createAsyncThunk(
  "view/brands",
  async (data) => {
    try {
      const res = await axiosInstance.get("/api/user/brands");
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
);

export const getProducts = createAsyncThunk(
  "view/products",
  async (data) => {
    try {
      const res = await axiosInstance.get("/api/user/products", { params: data} );
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
);
export const getSuggestions = createAsyncThunk(
  "view/suggestions",
  async (data) => {
    try {
      const res = await axiosInstance.get("/api/user/products/search");
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const getProductDetails = createAsyncThunk(
  "view/product",
  async (id) => {
    try {
      const res = await axiosInstance.get(`/api/user/products/${id}`);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const getDeals = createAsyncThunk(
  "view/deals",
  async (data) => {
    try {
      const res = await axiosInstance.get("/api/user/products/deals");
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const getRelatedProducts = createAsyncThunk(
  "view/relatedProducts",
  async (id) => {
    try {
      const res = await axiosInstance.get(`/api/user/products/related/${id}`);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const createCart = createAsyncThunk(
  "view/createCart",
  async (id) => {
    try {
      const res = await axiosInstance.get(`/api/user/cart/add/${id}`);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const getCart = createAsyncThunk(
  "view/getCart",
  async (data) => {
    try {
      const res = await axiosInstance.get("/api/user/cart", { params: data} );
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const removeCart = createAsyncThunk(
  "view/removeCart",
  async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/user/cart/remove/${id}`);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const increaseCart = createAsyncThunk(
  "view/increaseCart",
  async (id) => {
    try {
      const res = await axiosInstance.get(`/api/user/cart/update/increase/${id}`);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const substractCart = createAsyncThunk(
  "view/substractCart",
  async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/user/cart/update/decrease/${id}`);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const createOrderWithRazorpay = createAsyncThunk(
  "view/createOrderWithRazorpay",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/payment/create-order", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const verifyPayment = createAsyncThunk(
  "view/verifyPayment",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/payment/verify-payment", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const getOrders = createAsyncThunk(
  "view/getOrders",
  async (data) => {
    try {
      const res = await axiosInstance.get("/api/user/get/order");
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const getReviews = createAsyncThunk(
  "view/getReviews",
  async (id) => {
    try {
      const res = await axiosInstance.get(`/api/user/reviews/${id}`);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const createReview = createAsyncThunk(
  "view/createReview",
  async (data) => {
    try {
      const res = await axiosInstance.post("/api/user/reviews/create", data);
      return res.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data
    }
  }
)
export const viewSlice = createSlice({
  name: "View",
  initialState: {
    user: null,
    loading: false,
    carousel: [],
    categories:[],
    brands:[],
    productsData:{},
    productSingle:[],
    productLoading: false,
    relatedProducts:[],
    searchSuggestion:[],
    relatedProductsLoading: false,
    deals:{},
    cart: {},
    cartLoading: false,
    cartChange: false,
    orders: [],
    reviews: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCarousel.pending, (state, action) => {
        state.loading = true;
        state.carousel = [];
      })
      .addCase(getCarousel.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.carousel = action.payload.data
        }
      })
      .addCase(getCarousel.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getCategories.pending, (state, action) => {
        state.loading = true;
        state.categories = [];
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.categories = action.payload.data
        }
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getBrands.pending, (state, action) => {
        state.loading = true;
        state.brands = [];
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.brands = action.payload.data
        }
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(getProducts.pending, (state, action) => {
        state.productLoading = true;
        state.productsData = {};
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        console.log(action.payload);
        state.productLoading = false;
        if(action.payload.success){
            state.productsData = action.payload.data
        }
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.productLoading = false;
      })
      .addCase(getSuggestions.pending, (state, action) => {
        state.loading = true;
        state.searchSuggestion = [];
      })
      .addCase(getSuggestions.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.searchSuggestion = action.payload.data
        }
      })
      .addCase(getSuggestions.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getProductDetails.pending, (state, action) => {
        state.loading = true;
        state.productSingle = []
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.productSingle = action.payload.data
        }
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getRelatedProducts.pending, (state, action) => {
        state.relatedProductsLoading = true;
        state.relatedProducts = [];
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        console.log(action.payload);
        state.relatedProductsLoading = false;
        if(action.payload.success){
            state.relatedProducts = action.payload.data
        }
      })
      .addCase(getRelatedProducts.rejected, (state, action) => {
        state.relatedProductsLoading = false;
      })
      .addCase(getDeals.pending, (state, action) => {
        state.loading = true;
        state.deals = {};
      })
      .addCase(getDeals.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.deals = action.payload.data
        }
      })
      .addCase(getDeals.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(createCart.pending, (state, action) => {
        state.cartLoading = true;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        console.log(action.payload);
        state.cartLoading = false;
      })
      .addCase(createCart.rejected, (state, action) => {
        state.cartLoading = false;
      })
      .addCase(getCart.pending, (state, action) => {
        state.loading = true;
        // state.cart = {};
      })
      .addCase(getCart.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.cart = action.payload.data
        }
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(removeCart.pending, (state, action) => {
        state.cartChange = true;
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        console.log(action.payload);
        state.cartChange = false;
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.cartChange = false;
      })
      .addCase(increaseCart.pending, (state, action) => {
        state.cartChange = true;
      })
      .addCase(increaseCart.fulfilled, (state, action) => {
        console.log(action.payload);
        state.cartChange = false;
      })
      .addCase(increaseCart.rejected, (state, action) => {
        state.cartChange = false;
      })
      .addCase(substractCart.pending, (state, action) => {
        state.cartChange = true;
      })
      .addCase(substractCart.fulfilled, (state, action) => {
        console.log(action.payload);
        state.cartChange = false;
      })
      .addCase(substractCart.rejected, (state, action) => {
        state.cartChange = false;
      })
      .addCase(getOrders.pending, (state, action) => {
        state.loading = true;
        state.orders = [];
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.orders = action.payload.data
        }
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getReviews.pending, (state, action) => {
        state.loading = true;
        state.reviews = [];
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        if(action.payload.success){
            state.reviews = action.payload.data
        }
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(createReview.pending, (state, action) => {
        state.reviewLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        console.log(action.payload);
        state.reviewLoading = false;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
      })
  },
});
