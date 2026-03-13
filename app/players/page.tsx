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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando jugadores:", error);
      alert("Error cargando jugadores: " + error.message);
      setLoading(false);
      return;
    }

    setPlayers(data || []);
    setLoading(false);
  }

  function getDaysInactive(lastActivity?: string | null) {
    if (!lastActivity) return 0;

    const lastDate = new Date(lastActivity).getTime();
    const now = new Date().getTime();
    const diffMs = now - lastDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  function getStatusColor(daysInactive: number) {
    if (daysInactive >= 30) return "red";
    if (daysInactive >= 20) return "orange";
    if (daysInactive >= 10) return "yellow";
    return "limegreen";
  }

  function getStatusLabel(daysInactive: number) {
    if (daysInactive >= 30) return "Inactivo 30+ días";
    if (daysInactive >= 20) return "Inactivo 20+ días";
    if (daysInactive >= 10) return "Inactivo 10+ días";
    return "Activo";
  }

  async function handleDelete(playerId: string) {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este jugador?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerId);

    if (error) {
      console.error("Error eliminando jugador:", error);
      alert("Error eliminando jugador: " + error.message);
      return;
    }

    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
  }

  function handleEdit(playerId: string) {
    localStorage.setItem("editPlayerId", playerId);
    window.location.href = "/players/edit";
  }

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", color: "white" }}>
      <h1 style={{ marginBottom: 20 }}>Lista de jugadores</h1>

      {loading ? (
        <p>Cargando jugadores...</p>
      ) : players.length === 0 ? (
        <p>No hay jugadores guardados todavía.</p>
      ) : (
        <div>
          {players.map((player) => {
            const daysInactive = getDaysInactive(player.last_activity);
            const color = getStatusColor(daysInactive);
            const label = getStatusLabel(daysInactive);

            return (
              <div
                key={player.id}
                style={{
                  padding: 12,
                  marginBottom: 12,
                  border: "1px solid gray",
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: color,
                    }}
                  />
                  <strong>{player.name}</strong>
                </div>

                <div style={{ marginTop: 8 }}>Teléfono: {player.phone}</div>
                <div>App: {player.app}</div>
                <div>Estado: {label}</div>
                <div>
                  Última actividad:{" "}
                  {player.last_activity ? player.last_activity : "Sin actividad"}
                </div>
                <div>Días inactivo: {daysInactive}</div>

                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => handleEdit(player.id)}
                    style={{
                      marginRight: 10,
                      padding: 8,
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Editar jugador
                  </button>

                  <button
                    onClick={() => handleDelete(player.id)}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: "#dc2626",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar jugador
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}