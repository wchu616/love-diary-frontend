import React, { useState, useEffect } from "react";

// 允许的账号信息（可按需更改）
const USERS = [
  { username: "zyq", password: "woyaoyizhiaiysh" },
  { username: "ysh", password: "woyaoyizhiaizyq" },
];

// Render 云端 API 地址
const API_BASE = "https://zero613yshzyq.onrender.com/api";

export default function App() {
  const [inputUser, setInputUser] = useState("");
  const [inputPwd, setInputPwd] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // 拉取留言
  useEffect(() => {
    fetch(`${API_BASE}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data.reverse()))
      .catch(() => setMessages([]));
  }, []);

  // 登录校验
  function handleLogin(e) {
    e.preventDefault();
    const matched = USERS.find(
      (u) => u.username === inputUser && u.password === inputPwd
    );
    if (!matched) {
      setError("用户名或密码错误");
      return;
    }
    fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: inputUser, password: inputPwd }),
    })
      .then(res => {
        if (!res.ok) throw new Error("后端登录失败");
        setError("");
        setLoggedUser(inputUser);
      })
      .catch(() => setError("后端登录失败"));
  }

  // 发送留言
  function handleSend(e) {
    e.preventDefault();
    if (!content.trim()) return;
    fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: loggedUser, content: content.trim() }),
    })
      .then(res => res.json())
      .then(() => {
        fetch(`${API_BASE}/messages`)
          .then(res => res.json())
          .then(data => setMessages(data.reverse()));
      });
    setContent("");
  }

  function handleLogout() {
    setLoggedUser("");
    setInputUser("");
    setInputPwd("");
  }

  // 未登录
  if (!loggedUser) {
    return (
      <div style={{ maxWidth: 340, margin: "60px auto", padding: 20, background: "#222", borderRadius: 12, color: "#fff" }}>
        <h2 style={{ textAlign: "center" }}>宝宝日记 Diary 登录</h2>
        <form onSubmit={handleLogin}>
          <input
            name="username"
            placeholder="用户名"
            style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 4 }}
            autoFocus
            value={inputUser}
            onChange={e => setInputUser(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="密码"
            style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 4 }}
            value={inputPwd}
            onChange={e => setInputPwd(e.target.value)}
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

  // 已登录留言板
  return (
    <div style={{ maxWidth: 520, margin: "40px auto", background: "#222", borderRadius: 16, padding: 24, color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>宝宝日记  Diary</h2>
        <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#6fffd1", cursor: "pointer" }}>退出</button>
      </div>
      <div style={{ marginBottom: 18, fontSize: 15, color: "#ccc" }}>
        你好，{loggedUser}宝宝！今天有什么开心的事呀？
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="写下今天的美好瞬间..."
          style={{ flex: 1, padding: 10, borderRadius: 8 }}
        />
        <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, background: "#6fffd1", color: "#fff", fontWeight: "bold" }}>发送</button>
      </form>
      <div>
        {messages.length === 0 ? (
          <div style={{ color: "#aaa", textAlign: "center" }}>来当第一！</div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} style={{ background: "#333", borderRadius: 8, marginBottom: 12, padding: 12 }}>
              <div style={{ fontWeight: "bold", color: msg.author === loggedUser ? "#6fffd1" : "#6fc1ff" }}>
                {msg.author}
                <span style={{ fontWeight: "normal", color: "#aaa", fontSize: 12, marginLeft: 8 }}>
                  {msg.time}
                  {msg.region && (
                    <span> | {msg.region}</span>
                  )}
                </span>
              </div>
              <div style={{ marginTop: 6, fontSize: 16 }}>{msg.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
