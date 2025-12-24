import { useEffect, useState } from "react";
import { fetchHealth } from "../api/health";

function Health() {
  const [status, setStatus] = useState("확인 중...");

  useEffect(() => {
    fetchHealth()
      .then((res) => setStatus(JSON.stringify(res)))
      .catch(() => setStatus("서버 오류"));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>🩺 Health Check</h2>
      <pre>{status}</pre>
    </div>
  );
}

export default Health;
