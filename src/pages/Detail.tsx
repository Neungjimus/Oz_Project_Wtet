import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { getMealById } from "../api/recipeApi";
import { Star } from "lucide-react";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getMealById(id);
        setMeal(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const check = async () => {
      const { data: session } = await supabase.auth.getSession();
      const user = session?.session?.user;
      if (!user || !id) return;

      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("recipe_id", id)
        .single();

      setIsFavorite(!!data);
    };
    check();
  }, [id]);

  const toggleFavorite = async () => {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (!user) return alert("로그인 후 이용해주세요!");
    if (!meal) return;

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("recipe_id", id);

      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({
        user_id: user.id,
        recipe_id: meal.idMeal,
        recipe_name: meal.strMeal,
        recipe_image: meal.strMealThumb,
      });

      setIsFavorite(true);
    }
  };

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

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{meal.strMeal}</h1>

        <button onClick={toggleFavorite}>
          {isFavorite ? (
            <Star size={32} className="text-yellow-400" fill="currentColor" />
          ) : (
            <Star size={32} className="text-gray-400" />
          )}
        </button>
      </div>

      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="rounded-2xl mb-6 w-full"
      />

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
