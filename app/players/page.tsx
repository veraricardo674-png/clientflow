"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Player = {
  id: string;
  name: string;
  phone: string;
  app: string;
  status: string;
  last_activity?: string | null;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const { data, error } = await supabase.from("players").select("*");

    if (error) {
      console.error("Error cargando jugadores:", error);
      alert("Error cargando jugadores");
      return;
    }

    setPlayers(data || []);
  }

  function getDaysInactive(lastActivity?: string | null) {
    if (!lastActivity) return 999;

    const last = new Date(lastActivity).getTime();
    const now = new Date().getTime();
    const diff = now - last;

    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function getColor(days: number) {
    if (days >= 30) return "#f43f5e";
    if (days >= 20) return "#fb923c";
    if (days >= 10) return "#facc15";
    return "#22c55e";
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este jugador?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("players").delete().eq("id", id);

    if (error) {
      console.error("Error eliminando jugador:", error);
      alert("Error eliminando jugador");
      return;
    }

    await loadPlayers();
  }

  function handleEdit(id: string) {
    window.location.href = `/players/edit?id=${id}`;
  }

  const filteredPlayers = players.filter((p) => {
    const days = getDaysInactive(p.last_activity);

    if (filter === "10") return days >= 10;
    if (filter === "20") return days >= 20;
    if (filter === "30") return days >= 30;

    return true;
  });

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
          maxWidth: 1180,
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
            Jugadores
          </h1>
          <p
            style={{
              color: "#cbd5e1",
              fontSize: 17,
              margin: 0,
            }}
          >
            Administra, edita y monitorea la actividad de tus jugadores
          </p>
        </div>

        <div
          style={{
            marginBottom: 24,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setFilter("all")}
            style={{
              ...filterBtn,
              background: filter === "all" ? "#2563eb" : "rgba(15, 23, 42, 0.72)",
              color: "white",
            }}
          >
            Todos
          </button>

          <button
            onClick={() => setFilter("10")}
            style={{
              ...filterBtn,
              background: filter === "10" ? "#eab308" : "rgba(15, 23, 42, 0.72)",
              color: "white",
            }}
          >
            🟡 10+ días
          </button>

          <button
            onClick={() => setFilter("20")}
            style={{
              ...filterBtn,
              background: filter === "20" ? "#f97316" : "rgba(15, 23, 42, 0.72)",
              color: "white",
            }}
          >
            🟠 20+ días
          </button>

          <button
            onClick={() => setFilter("30")}
            style={{
              ...filterBtn,
              background: filter === "30" ? "#e11d48" : "rgba(15, 23, 42, 0.72)",
              color: "white",
            }}
          >
            🔴 30+ días
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {filteredPlayers.map((player) => {
            const days = getDaysInactive(player.last_activity);
            const color = getColor(days);

            return (
              <div
                key={player.id}
                style={{
                  background: "rgba(15, 23, 42, 0.72)",
                  border: "1px solid rgba(148, 163, 184, 0.20)",
                  borderRadius: 22,
                  padding: 22,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: color,
                      boxShadow: 0 0 12px ${color},
                    }}
                  />
                  <strong
                    style={{
                      fontSize: 28,
                      lineHeight: 1,
                    }}
                  >
                    {player.name}
                  </strong>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                    marginBottom: 18,
                    color: "#e2e8f0",
                  }}
                >
                  <div>
                    <div style={labelStyle}>Teléfono</div>
                    <div style={valueStyle}>{player.phone}</div>
                  </div>

                  <div>
                    <div style={labelStyle}>App</div>
                    <div style={valueStyle}>{player.app}</div>
                  </div>

                  <div>
                    <div style={labelStyle}>Estado</div>
                    <div style={valueStyle}>{player.status}</div>
                  </div>

                  <div>
                    <div style={labelStyle}>Días inactivo</div>
                    <div style={valueStyle}>{days}</div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <button onClick={() => handleEdit(player.id)} style={editBtn}>
                    Editar
                  </button>

                  <button onClick={() => handleDelete(player.id)} style={deleteBtn}>
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

const filterBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.20)",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#94a3b8",
  marginBottom: 4,
};

const valueStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: "white",
};

const editBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
};

const deleteBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
};