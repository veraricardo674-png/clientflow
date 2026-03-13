"use client";

import { useEffect, useState } from "react";

type Player = {
  name: string;
  phone: string;
  app: string;
  status: string;
  lastActivity?: string;
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const savedPlayers = localStorage.getItem("players");
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  const total = players.length;
  const activos = players.filter((p) => p.status === "activo").length;
  const inactivos = total - activos;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "sans-serif",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 30 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            ClientFlow
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 16,
            }}
          >
            Panel de control del club
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              backgroundColor: "#1e293b",
              padding: 20,
              borderRadius: 16,
              border: "1px solid #334155",
            }}
          >
            <div style={{ color: "#94a3b8", marginBottom: 8 }}>
              Total jugadores
            </div>
            <div style={{ fontSize: 32, fontWeight: "bold" }}>{total}</div>
          </div>

          <div
            style={{
              backgroundColor: "#1e293b",
              padding: 20,
              borderRadius: 16,
              border: "1px solid #334155",
            }}
          >
            <div style={{ color: "#94a3b8", marginBottom: 8 }}>Activos</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "#22c55e" }}>
              {activos}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#1e293b",
              padding: 20,
              borderRadius: 16,
              border: "1px solid #334155",
            }}
          >
            <div style={{ color: "#94a3b8", marginBottom: 8 }}>Inactivos</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "#ef4444" }}>
              {inactivos}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              marginBottom: 20,
            }}
          >
            Acciones rápidas
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <a href="/players/new" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Agregar jugador
              </button>
            </a>

            <a href="/players" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#0f766e",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Ver jugadores
              </button>
            </a>

            <a href="/recharge" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#16a34a",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Registrar recarga
              </button>
            </a>

            <a href="/recharges" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#7c3aed",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: "pointer",
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