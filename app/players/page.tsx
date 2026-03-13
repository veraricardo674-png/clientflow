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

  function getWhatsAppLink(player: Player) {
    const cleanPhone = player.phone.replace(/\D/g, "");
    const phoneWithCountryCode = 52${cleanPhone};
    const message = Hola ¿cómo estás? Te esperamos en las mesas pregunta por nuestras promociones exclusivas😎;
    return https://wa.me/${phoneWithCountryCode}?text=${encodeURIComponent(message)};
  }

  const filteredPlayers = players.filter((p) => {
    const days = getDaysInactive(p.last_activity);

    if (filter === "10") return days >= 10;
    if (filter === "20") return days >= 20;
    if (filter === "30") return days >= 30;

    return true;
  });

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", color: "white" }}>
      <h1 style={{ marginBottom: 20 }}>Jugadores</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setFilter("all")} style={btn}>
          Todos
        </button>

        <button onClick={() => setFilter("10")} style={btn}>
          🟡 10+ días
        </button>

        <button onClick={() => setFilter("20")} style={btn}>
          🟠 20+ días
        </button>

        <button onClick={() => setFilter("30")} style={btn}>
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
              border: "1px solid gray",
              padding: 12,
              marginBottom: 10,
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

            <div>Teléfono: {player.phone}</div>
            <div>App: {player.app}</div>
            <div>Días inactivo: {days}</div>

            <div style={{ marginTop: 12 }}>
              <a
                href={getWhatsAppLink(player)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  WhatsApp
                </button>
              </a>
            </div>
          </div>
        );
      })}
    </main>
  );
}

const btn = {
  marginRight: 10,
  padding: "8px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};