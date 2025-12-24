import api from "./axios";

export const fetchBooks = async (page = 1, size = 10) => {
  const res = await api.get("/books", {
    params: { page, size },
  });
  return res.data;
};

export const searchBooks = async ({
  keyword,
  category,
  page = 1,
  size = 9,
}) => {
  const res = await api.get("/books/search", {
    params: {
      keyword: keyword || undefined,
      category: category || undefined,
      page,
      size,
    },
  });
  return res.data;
};

export const fetchBookDetail = async (id) => {
  const res = await api.get(`/books/${id}`);
  return res.data;
};

export const fetchLatestBooks = () =>
  api.get("/books/latest").then(res => res.data);

export const fetchBooksByPrice = ({
  minPrice,
  maxPrice,
  page = 1,
  size = 9,
  sort = "price,ASC",
}) =>
  api
    .get("/books/filter/price", {
      params: {
        min_price: minPrice,
        max_price: maxPrice,
        page,
        size,
        sort,
      },
    })
    .then((res) => res.data);

export const fetchPopularBooksByRatings = () =>
  api.get("/books/popular/ratings").then(res => res.data);

export const fetchPopularBooksByComments = () =>
  api.get("/books/popular/comments").then(res => res.data);

export const fetchRandomBook = () =>
  api.get("/books/recommend/random").then(res => res.data);
