"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Player = {
  id: string;
  name: string;
  phone: string;
  app: string;
  status: string;
  last_activity?: string | null;
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    loadPlayers();

    const interval = setInterval(() => {
      loadPlayers();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function loadPlayers() {
    const { data, error } = await supabase.from("players").select("*");

    if (error) {
      console.error("Error cargando jugadores:", error);
      return;
    }

    setPlayers(data || []);
  }

  const total = players.length;
  const activos = players.filter(
    (p) => p.status?.toLowerCase() === "activo"
  ).length;
  const inactivos = total - activos;

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
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: "bold",
              marginBottom: 8,
              letterSpacing: "-1px",
            }}
          >
            ClientFlow
          </h1>

          <p style={{ color: "#cbd5e1", fontSize: 18, margin: 0 }}>
            Panel de control del club
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 18,
            marginBottom: 30,
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Total jugadores</div>
            <div style={numberStyle}>{total}</div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>Activos</div>
            <div style={{ ...numberStyle, color: "#22c55e" }}>{activos}</div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>Inactivos</div>
            <div style={{ ...numberStyle, color: "#f87171" }}>{inactivos}</div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(148, 163, 184, 0.20)",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
            backdropFilter: "blur(8px)",
          }}
        >
          <h2
            style={{
              fontSize: 24,
              marginTop: 0,
              marginBottom: 22,
              fontWeight: "bold",
            }}
          >
            Acciones rápidas
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <a href="/players/new" style={{ textDecoration: "none" }}>
              <button
                style={{
                  ...buttonStyle,
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                }}
              >
                Agregar jugador
              </button>
            </a>

            <a href="/players" style={{ textDecoration: "none" }}>
              <button
                style={{
                  ...buttonStyle,
                  background:
                    "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
                }}
              >
                Ver jugadores
              </button>
            </a>

            <a href="/recharge" style={{ textDecoration: "none" }}>
              <button
                style={{
                  ...buttonStyle,
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                }}
              >
                Registrar recarga
              </button>
            </a>

            <a href="/recharges" style={{ textDecoration: "none" }}>
              <button
                style={{
                  ...buttonStyle,
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                }}
              >
                Historial recargas
              </button>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.72)",
  border: "1px solid rgba(148, 163, 184, 0.20)",
  borderRadius: 22,
  padding: 24,
  boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
  backdropFilter: "blur(8px)",
};

const labelStyle: React.CSSProperties = {
  color: "#cbd5e1",
  marginBottom: 10,
  fontSize: 16,
  fontWeight: 500,
};

const numberStyle: React.CSSProperties = {
  fontSize: 42,
  fontWeight: "bold",
  lineHeight: 1,
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 18,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(0,0,0,0.20)",
};