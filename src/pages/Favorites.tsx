import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("즐겨찾기 불러오기 오류:", error);
      } else {
        setFavorites(data);
      }

      setLoading(false);
    };

    loadFavorites();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-500 underline mb-4"
      >
        ← 뒤로가기
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Star size={24} className="text-yellow-500" fill="currentColor" />내
        즐겨찾기
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">즐겨찾기한 레시피가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={item.recipe_image}
                alt={item.recipe_name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold">{item.recipe_name}</h3>
                <button
                  onClick={() => navigate(`/detail/${item.recipe_id}`)}
                  className="mt-2 text-sm text-blue-500"
                >
                  상세보기 →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
