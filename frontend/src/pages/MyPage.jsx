import { useEffect, useState } from "react";
import { fetchMe, updateMe } from "../api/users";

function MyPage() {
  const [me, setMe] = useState(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await fetchMe();
      setMe(data);

      setEmail(data.email ?? "");
      setName(data.name ?? "");
      setPhone(data.phone ?? "");
      setAddress(data.address ?? "");
    };

    load();
  }, []);

  const handleUpdate = async () => {
    try {
      const updated = await updateMe({
        email,
        name,
        phone,
        address,
      });

      setMe(updated);
      alert("내 정보가 수정되었습니다.");
    } catch (e) {
      alert("정보 수정 실패");
    }
  };

  if (!me) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <h2>🙋 마이페이지</h2>

      <div style={{ marginBottom: 12 }}>
        <label>이메일</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>전화번호</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-1234-5678"
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>주소</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <p><b>권한:</b> {me.role}</p>

      <button onClick={handleUpdate} style={{ marginTop: 12 }}>
        💾 정보 수정
      </button>
    </div>
  );
}

export default MyPage;

