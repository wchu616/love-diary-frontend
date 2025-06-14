import React, { useState, useEffect } from "react";

// 后端 API 基础地址
const API_BASE = "https://zero613yshzyq.onrender.com/api";

// 允许登录的用户列表
const ALLOWED_USERS = [
  { username: "zyq", password: "woyaoyizhiaiysh" },
  { username: "ysh", password: "woyaoyizhiaizyq" }
];

export default function App() {
  const [user, setUser] = useState(""); // 当前登录用户
  const [password, setPassword] = useState(""); // 登录密码
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 拉取全部留言
  useEffect(() => {
    fetch(`${API_BASE}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(() => setMessages([]));
  }, []);

  // 处理图片选择
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 清除已选图片
  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // 登录
  function handleLogin(e) {
    e.preventDefault();
    const matched = ALLOWED_USERS.find(
      (u) => u.username === user && u.password === password
    );
    if (!matched) {
      setError("用户名或密码错误");
      return;
    }
    fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error("用户名或密码错误");
        setError("");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setUser(user);
        } else {
          throw new Error("登录失败");
        }
      })
      .catch(err => {
        setError(err.message);
        setUser(""); // 登录失败时清空用户状态
      });
  }

  // 发送留言
  function handleSend(e) {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;

    const formData = new FormData();
    formData.append('author', user);
    formData.append('content', content.trim());
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    fetch(`${API_BASE}/messages`, {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(() => {
        // 留言成功后刷新
        return fetch(`${API_BASE}/messages`)
          .then(res => res.json())
          .then(data => setMessages(data));
      })
      .then(() => {
        setContent("");
        clearImage();
      });
  }

  function handleLogout() {
    setUser("");
    setPassword("");
  }

  // 未登录页
  if (!user) {
    return (
      <div style={{ maxWidth: 340, margin: "60px auto", padding: 20, background: "#222", borderRadius: 12, color: "#fff" }}>
        <h2 style={{ textAlign: "center" }}>宝宝日记 Diary 登录</h2>
        <form onSubmit={handleLogin}>
          <input
            name="username"
            placeholder="用户名"
            style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 4 }}
            autoFocus
            value={user}
            onChange={e => setUser(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="密码"
            style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 4 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 4, background: "#6fffd1", color: "#fff", fontWeight: "bold" }}>
            登录
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 12, color: "#aaa" }}>
          宝宝今天也爱你 0613  
        </div>
        {error && <div style={{ color: "#f66", marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  // 已登录留言板页
  return (
    <div style={{ maxWidth: 520, margin: "40px auto", background: "#222", borderRadius: 16, padding: 24, color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>宝宝日记  Diary</h2>
        <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#6fffd1", cursor: "pointer" }}>退出</button>
      </div>
      <div style={{ marginBottom: 18, fontSize: 15, color: "#ccc" }}>
        你好，{user}宝宝！今天有什么开心的事呀？
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="写下今天的美好瞬间..."
          style={{ padding: 10, borderRadius: 8 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#333",
              color: "#fff",
              cursor: "pointer",
              textAlign: "center",
              flex: 1
            }}
          >
            选择图片
          </label>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#6fffd1",
              color: "#fff",
              fontWeight: "bold",
              flex: 1
            }}
          >
            发送
          </button>
        </div>
        {imagePreview && (
          <div style={{ position: "relative", marginTop: 8 }}>
            <img
              src={imagePreview}
              alt="预览"
              style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
            />
            <button
              onClick={clearImage}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0,0,0,0.5)",
                border: "none",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>
        )}
      </form>
      <div>
        {messages.length === 0 ? (
          <div style={{ color: "#aaa", textAlign: "center" }}>来当第一！</div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} style={{ background: "#333", borderRadius: 8, marginBottom: 12, padding: 12 }}>
              <div style={{ fontWeight: "bold", color: msg.author === user ? "#6fffd1" : "#6fc1ff" }}>
                {msg.author}
                <span style={{ fontWeight: "normal", color: "#aaa", fontSize: 12, marginLeft: 8 }}>
                  {msg.time}
                  {msg.region && (
                    <span> | {msg.region}</span>
                  )}
                </span>
              </div>
              <div style={{ marginTop: 6, fontSize: 16 }}>{msg.content}</div>
              {msg.image_url && (
                <img
                  src={`${API_BASE.replace('/api', '')}${msg.image_url}`}
                  alt="留言图片"
                  style={{ maxWidth: "100%", maxHeight: 300, marginTop: 8, borderRadius: 4 }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
