import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import { searchMeal, getRandomMeal } from "../api/recipeApi";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert("로그아웃 되었습니다.");
    window.location.reload();
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    const data = await searchMeal(query);
    setMeals(data || []);
  };

  const handleRandom = async () => {
    const data = await getRandomMeal();
    setMeals([data]);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold mb-3">🍳 What To Eat</h1>
        <p className="text-gray-500 mb-6">로그인 후 이용할 수 있습니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          로그인 하러가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="flex justify-between w-full max-w-2xl mb-4">
        <h1 className="text-3xl font-bold text-yellow-600">🍳 What To Eat</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          로그아웃
        </button>
      </div>

      <p className="text-gray-500 mb-6 text-center">
        음식 이름을{" "}
        <span className="font-semibold text-yellow-500">영어로</span>{" "}
        검색해보세요!
        <br />
        예: chicken, pasta, beef, salad
      </p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipe..."
          className="border rounded-lg px-4 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          검색
        </button>
        <button
          onClick={handleRandom}
          className="border border-yellow-500 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50 transition"
        >
          랜덤 추천
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {meals.length > 0 ? (
          meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/detail/${meal.idMeal}`)}
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">{meal.strMeal}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
