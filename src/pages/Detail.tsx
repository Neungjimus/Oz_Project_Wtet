import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMealById } from "../api/recipeApi";

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  strYoutube?: string;
}

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getMealById(id);
        setMeal(data);
      } catch (err) {
        console.error("getMealById error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!meal) return <p className="p-6">레시피를 찾을 수 없습니다.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 underline"
      >
        ← 뒤로가기
      </button>

      <h1 className="text-3xl font-bold mb-4">{meal.strMeal}</h1>
      {meal.strMealThumb && (
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="rounded-2xl mb-6 w-full"
        />
      )}
      <p className="mb-4 text-gray-600">
        <strong>Category:</strong> {meal.strCategory || "—"} |{" "}
        <strong>Area:</strong> {meal.strArea || "—"}
      </p>

      <h2 className="text-xl font-semibold mb-2">Instructions</h2>
      <p className="whitespace-pre-line mb-6">
        {meal.strInstructions || "설명 없음"}
      </p>

      {meal.strYoutube && (
        <>
          <h2 className="text-xl font-semibold mb-2">🎥 YouTube</h2>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={meal.strYoutube.replace("watch?v=", "embed/")}
              title="youtube"
              allowFullScreen
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
