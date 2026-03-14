"use client";

import { useState } from "react";
import { supabase } from "../../supabase";
import { useRouter } from "next/navigation";

export default function NewPlayerPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [app, setApp] = useState("");

  async function createPlayer() {
    if (!name || !phone || !app) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const { error } = await supabase.from("players").insert([
      {
        name,
        phone,
        app,
        status: "activo",
      },
    ]);

    if (error) {
      console.log("ERROR SUPABASE:", error);
      alert("Error creando jugador: " + error.message);
      return;
    }

    alert("Jugador creado correctamente");
    router.push("/players");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1e3a8a 0%, #0f172a 45%, #020617 100%)",
        color: "white",
        fontFamily: "sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: "bold",
              marginBottom: 8,
              letterSpacing: "-1px",
            }}
          >
            Nuevo jugador
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: 17,
              margin: 0,
            }}
          >
            Agrega un nuevo jugador al sistema de ClientFlow
          </p>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(148, 163, 184, 0.20)",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <div>
              <div style={labelStyle}>Nombre</div>
              <input
                placeholder="Nombre del jugador"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>Teléfono</div>
              <input
                placeholder="Número de teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>App</div>
              <input
                placeholder="PPPoker, PokerBros, Ases, etc."
                value={app}
                onChange={(e) => setApp(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button onClick={createPlayer} style={saveBtn}>
              Crear jugador
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#cbd5e1",
  marginBottom: 8,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "16px 18px",
  borderRadius: 14,
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "rgba(15, 23, 42, 0.85)",
  color: "white",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};

const saveBtn: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  padding: "16px 18px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(0,0,0,0.20)",
};