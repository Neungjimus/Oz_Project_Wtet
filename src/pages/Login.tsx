import { useState } from "react";
import { supabase } from "../api/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true면 로그인, false면 회원가입

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // 로그인
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert(error.message);
      } else {
        alert("로그인 성공!");
        window.location.reload();
      }
    } else {
      // 회원가입
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        alert(error.message);
      } else {
        alert("회원가입 성공! 이제 로그인하세요!");
        setIsLogin(true); // 회원가입 후 로그인 모드로 전환
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? "로그인" : "회원가입"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          {isLogin ? "로그인" : "회원가입"}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-3 text-sm text-blue-600 hover:underline"
      >
        {isLogin ? "회원가입 하러가기" : "로그인 하러가기"}
      </button>
    </div>
  );
}
