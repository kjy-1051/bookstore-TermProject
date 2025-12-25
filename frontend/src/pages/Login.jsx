import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { login, register, logout, deleteMe } from "../api/auth";
import api from "../api/axios";   // ⭐ axios 인스턴스만 사용

function Login() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ===== 일반 로그인 ===== */
  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("role", data.role);

      navigate("/books");
    } catch {
      alert("로그인 실패");
    }
  };

  /* ===== 회원가입 ===== */
  const handleRegister = async () => {
    try {
      await register(email, password, "사용자");
      alert("회원가입 성공. 로그인 해주세요.");
    } catch {
      alert("회원가입 실패");
    }
  };

  /* ===== Google 로그인 ===== */
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const { data } = await api.post(
        "/auth/oauth/firebase/google",
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("role", data.role);

      navigate("/books");
    } catch (err) {
      console.error(err);
      alert("Google 로그인 실패");
    }
  };

  /* ===== Kakao 로그인 ===== */
  const handleKakaoLogin = () => {
    // ⭐ 반드시 백엔드 포트 (13089) 로 직접 이동
    window.location.href = "http://localhost:13089/auth/oauth/kakao/login";
  };

  /* ===== 로그아웃 ===== */
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 서버 실패해도 무시
    } finally {
      localStorage.clear();
      alert("로그아웃 완료");
      navigate("/");
    }
  };

  /* ===== 회원 탈퇴 ===== */
  const handleDeleteMe = async () => {
    if (!window.confirm("정말로 회원 탈퇴하시겠습니까?")) return;

    try {
      await deleteMe();
      alert("회원 탈퇴 완료");
    } catch {
      alert("회원 탈퇴 실패");
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h2>📚 Bookstore</h2>

      {!isLoggedIn ? (
        <>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />

          <div>
            <button onClick={handleLogin}>로그인</button>
            <button onClick={handleRegister}>회원가입</button>
          </div>

          <hr />

          <button onClick={handleGoogleLogin}>Google 로그인</button>
          <button onClick={handleKakaoLogin}>Kakao 로그인</button>
        </>
      ) : (
        <>
          <p>이미 로그인되어 있습니다.</p>

          <button onClick={handleLogout}>로그아웃</button>

          <br /><br />

          <button style={{ color: "red" }} onClick={handleDeleteMe}>
            회원 탈퇴
          </button>
        </>
      )}
    </div>
  );
}

export default Login;


