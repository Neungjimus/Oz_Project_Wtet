import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const searchMeal = async (query: string) => {
  const res = await axios.get(`${BASE_URL}/search.php?s=${query}`);
  return res.data.meals;
};

export const getRandomMeal = async () => {
  const res = await axios.get(`${BASE_URL}/random.php`);
  return res.data.meals ? res.data.meals[0] : null;
};

export const getMealById = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
  return res.data.meals ? res.data.meals[0] : null;
};
