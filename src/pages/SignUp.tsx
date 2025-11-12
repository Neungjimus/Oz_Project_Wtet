import { useState } from "react";
import { supabase } from "../api/supabaseClient";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("회원가입 성공! 이메일을 확인하고 로그인 해주세요.");
      setEmail("");
      setPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleSignUp} className="flex flex-col gap-3 w-64">
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
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
          } text-white py-2 rounded`}
        >
          {loading ? "회원가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        이미 계정이 있으신가요?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          로그인 하러가기
        </a>
      </p>
    </div>
  );
}
