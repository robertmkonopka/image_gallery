import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).then((res) => res.json());

    if (data.token) {
      Cookies.set("token", data.token);
      router.push("/admin");
    }
  };

  return (
    <div
      style={{ margin: "0 auto", width: "100%", maxWidth: 500, marginTop: 80 }}
    >
      <div
        style={{
          borderRadius: 16,
          boxShadow: "rgb(0 0 0 / 16%) 0px 0px 16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 30,
            height: 125,
            backgroundColor: "#276df1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "white",
          }}
        >
          Sign in
        </div>

        <form style={{ padding: 24 }} onSubmit={handleSubmit}>
          <input
            className="admin__input"
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="admin__input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="admin__button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
