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
    if (days >= 30) return "red";
    if (days >= 20) return "orange";
    if (days >= 10) return "yellow";
    return "limegreen";
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
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "sans-serif",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 20 }}>Jugadores</h1>

        <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("all")} style={filterBtn}>
            Todos
          </button>
          <button onClick={() => setFilter("10")} style={filterBtn}>
            🟡 10+ días
          </button>
          <button onClick={() => setFilter("20")} style={filterBtn}>
            🟠 20+ días
          </button>
          <button onClick={() => setFilter("30")} style={filterBtn}>
            🔴 30+ días
          </button>
        </div>

        {filteredPlayers.map((player) => {
          const days = getDaysInactive(player.last_activity);
          const color = getColor(days);

          return (
            <div
              key={player.id}
              style={{
                border: "1px solid #475569",
                padding: 12,
                marginBottom: 12,
                borderRadius: 8,
                backgroundColor: "#111827",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
                <strong>{player.name}</strong>
              </div>

              <div>Teléfono: {player.phone}</div>
              <div>App: {player.app}</div>
              <div>Estado: {player.status}</div>
              <div>Días inactivo: {days}</div>

              <div style={{ marginTop: 10 }}>
                <button onClick={() => handleEdit(player.id)} style={editBtn}>
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(player.id)}
                  style={deleteBtn}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

const filterBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

const editBtn: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: 10,
};

const deleteBtn: React.CSSProperties = {
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
};