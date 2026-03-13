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
      console.error(error);
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
      console.error(error);
      alert("Error eliminando jugador");
      return;
    }

    loadPlayers();
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
    <main style={{ padding: 40 }}>
      <h1>Jugadores</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setFilter("all")}>Todos</button>
        <button onClick={() => setFilter("10")}>10+ días</button>
        <button onClick={() => setFilter("20")}>20+ días</button>
        <button onClick={() => setFilter("30")}>30+ días</button>
      </div>

      {filteredPlayers.map((player) => {
        const days = getDaysInactive(player.last_activity);
        const color = getColor(days);

        return (
          <div
            key={player.id}
            style={{
              border: "1px solid gray",
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
            <div>Días inactivo: {days}</div>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => handleEdit(player.id)}>
                Editar
              </button>

              <button
                onClick={() => handleDelete(player.id)}
                style={{ marginLeft: 10 }}
              >
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </main>
  );
}