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

export default function RechargePage() {
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");

  useEffect(() => {
    loadPlayers();

    const savedRecent = localStorage.getItem("recentRecharges");
    if (savedRecent) {
      setRecentPlayers(JSON.parse(savedRecent));
    }
  }, []);

  async function loadPlayers() {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando jugadores:", error);
      alert("Error cargando jugadores: " + error.message);
      return;
    }

    setPlayers(data || []);
  }

  const filteredPlayers = players.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.phone.toLowerCase().includes(term)
    );
  });

  async function handleRecharge() {
    const playerInput = (selectedPlayer || search).trim();
    const amountInput = amount.trim();

    if (!playerInput || !amountInput) {
      alert("Jugador y monto requeridos");
      return;
    }

    const matchedPlayer = players.find(
      (p) =>
        p.name.toLowerCase() === playerInput.toLowerCase() ||
        p.phone === playerInput
    );

    if (!matchedPlayer) {
      alert("Ese jugador no está registrado");
      return;
    }

    const rechargeDate = new Date().toLocaleString();

    const { error: rechargeError } = await supabase.from("recharges").insert([
      {
        player_id: matchedPlayer.id,
        amount: Number(amountInput),
        date: rechargeDate,
      },
    ]);

    if (rechargeError) {
      console.error("Error al guardar recarga:", rechargeError);
      alert("No se pudo guardar la recarga: " + rechargeError.message);
      return;
    }

    const { error: playerUpdateError } = await supabase
      .from("players")
      .update({
        status: "activo",
        last_activity: new Date().toISOString(),
      })
      .eq("id", matchedPlayer.id);

    if (playerUpdateError) {
      console.error("Error actualizando jugador:", playerUpdateError);
      alert("Recarga guardada, pero no se pudo actualizar actividad del jugador");
    }

    const recharge = {
      player: matchedPlayer.name,
      amount: amountInput,
      date: rechargeDate,
    };

    const existingRecharges = localStorage.getItem("recharges");
    const recharges = existingRecharges ? JSON.parse(existingRecharges) : [];
    recharges.push(recharge);
    localStorage.setItem("recharges", JSON.stringify(recharges));

    let updatedRecent = [
      matchedPlayer.name,
      ...recentPlayers.filter((p) => p !== matchedPlayer.name),
    ];
    updatedRecent = updatedRecent.slice(0, 5);

    localStorage.setItem("recentRecharges", JSON.stringify(updatedRecent));
    setRecentPlayers(updatedRecent);

    await loadPlayers();

    alert("Recarga registrada");

    setSearch("");
    setSelectedPlayer("");
    setAmount("");
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
          maxWidth: 820,
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
            Registrar recarga
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: 17,
              margin: 0,
            }}
          >
            Busca un jugador y registra su recarga rápidamente
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
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <div>
              <div style={labelStyle}>Jugador</div>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedPlayer("");
                }}
                placeholder="Buscar jugador por nombre o teléfono"
                style={inputStyle}
              />
            </div>

            {search && (
              <div
                style={{
                  border: "1px solid rgba(148, 163, 184, 0.20)",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "rgba(15, 23, 42, 0.9)",
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.slice(0, 10).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPlayer(p.name);
                        setSearch(p.name);
                      }}
                      style={{
                        padding: "12px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
                        color: "white",
                      }}
                    >
                      <strong>{p.name}</strong> — {p.phone}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "12px 14px",
                      color: "#cbd5e1",
                    }}
                  >
                    No se encontraron jugadores
                  </div>
                )}
              </div>
            )}

            <div>
              <div style={labelStyle}>Monto</div>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Monto"
                style={inputStyle}
              />
            </div>

            <button onClick={handleRecharge} style={saveBtn}>
              Registrar recarga
            </button>
          </div>
        </div>

        {recentPlayers.length > 0 && (
          <div
            style={{
              background: "rgba(15, 23, 42, 0.72)",
              border: "1px solid rgba(148, 163, 184, 0.20)",
              borderRadius: 22,
              padding: 24,
              boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 16,
                fontSize: 24,
              }}
            >
              Últimos jugadores
            </h3>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {recentPlayers.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedPlayer(p);
                    setSearch(p);
                  }}
                  style={recentBtn}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
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
  marginTop: 4,
  width: "100%",
  padding: "16px 18px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(0,0,0,0.20)",
};

const recentBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.20)",
  background: "rgba(15, 23, 42, 0.92)",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 10px 18px rgba(0,0,0,0.16)",
};