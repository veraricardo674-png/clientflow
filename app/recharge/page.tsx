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
    <main style={{ padding: 40, fontFamily: "sans-serif", color: "white" }}>
      <h1 style={{ marginBottom: 20 }}>Registrar recarga</h1>

      <div style={{ maxWidth: 500 }}>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedPlayer("");
          }}
          placeholder="Buscar jugador por nombre o teléfono"
          style={{
            display: "block",
            marginBottom: 10,
            padding: 10,
            width: "100%",
            border: "1px solid gray",
            borderRadius: 6,
            backgroundColor: "#111",
            color: "white",
          }}
        />

        {search && (
          <div
            style={{
              border: "1px solid gray",
              borderRadius: 6,
              marginBottom: 10,
              maxHeight: 150,
              overflowY: "auto",
            }}
          >
            {filteredPlayers.slice(0, 10).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPlayer(p.name);
                  setSearch(p.name);
                }}
                style={{
                  padding: 8,
                  cursor: "pointer",
                  borderBottom: "1px solid #333",
                }}
              >
                {p.name} — {p.phone}
              </div>
            ))}
          </div>
        )}

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto"
          style={{
            display: "block",
            marginBottom: 12,
            padding: 10,
            width: "100%",
            border: "1px solid gray",
            borderRadius: 6,
            backgroundColor: "#111",
            color: "white",
          }}
        />

        <button
          onClick={handleRecharge}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "none",
            backgroundColor: "#16a34a",
            color: "white",
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          Registrar recarga
        </button>

        {recentPlayers.length > 0 && (
          <>
            <h3>Últimos jugadores</h3>

            <div style={{ marginTop: 10 }}>
              {recentPlayers.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedPlayer(p);
                    setSearch(p);
                  }}
                  style={{
                    marginRight: 10,
                    marginBottom: 10,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid gray",
                    backgroundColor: "#222",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}