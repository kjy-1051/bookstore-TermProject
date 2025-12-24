import { useEffect, useState } from "react";
import {
  fetchCommentsByBook,
  createComment,
  updateComment,
  deleteComment,
} from "../api/comments";

function CommentSection({ bookId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const isLoggedIn = !!localStorage.getItem("access_token");

  const loadComments = () => {
    fetchCommentsByBook(bookId).then(setComments);
  };

  useEffect(() => {
    loadComments();
  }, [bookId]);

  const handleCreate = async () => {
    if (!content.trim()) return;

    try {
      await createComment(bookId, content);
      setContent("");
      loadComments();
    } catch {
      alert("댓글 작성 실패");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateComment(id, editingContent);
      setEditingId(null);
      setEditingContent("");
      loadComments();
    } catch {
      alert("댓글 수정 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;

    try {
      await deleteComment(id);
      loadComments();
    } catch {
      alert("댓글 삭제 실패");
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3>💬 댓글</h3>

      {isLoggedIn && (
        <div style={{ marginBottom: 12 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
            placeholder="댓글을 입력하세요"
          />
          <button onClick={handleCreate}>댓글 작성</button>
        </div>
      )}

      {comments.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        <ul>
          {comments.map((c) => (
            <li key={c.id} style={{ marginBottom: 8 }}>
              {editingId === c.id ? (
                <>
                  <input
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(c.id)}>저장</button>
                  <button onClick={() => setEditingId(null)}>취소</button>
                </>
              ) : (
                <>
                  <span>{c.content}</span>
                  {isLoggedIn && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(c.id);
                          setEditingContent(c.content);
                        }}
                      >
                        수정
                      </button>
                      <button onClick={() => handleDelete(c.id)}>
                        삭제
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentSection;
