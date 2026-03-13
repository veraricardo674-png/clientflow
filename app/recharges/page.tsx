"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Recharge = {
  id: string;
  player_id: string;
  amount: number;
  date: string;
  player_name?: string;
};

export default function RechargesPage() {
  const [recharges, setRecharges] = useState<Recharge[]>([]);

  useEffect(() => {
    loadRecharges();
  }, []);

  async function loadRecharges() {
    const { data: rechargeData, error } = await supabase
      .from("recharges")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error cargando recargas:", error);
      alert("Error cargando recargas");
      return;
    }

    if (!rechargeData) return;

    const playerIds = rechargeData.map((r) => r.player_id);

    const { data: players } = await supabase
      .from("players")
      .select("id, name")
      .in("id", playerIds);

    const rechargesWithNames = rechargeData.map((r) => {
      const player = players?.find((p) => p.id === r.player_id);

      return {
        ...r,
        player_name: player?.name || "Jugador desconocido",
      };
    });

    setRecharges(rechargesWithNames);
  }

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", color: "white" }}>
      <h1 style={{ marginBottom: 20 }}>Historial de recargas</h1>

      {recharges.length === 0 ? (
        <p>No hay recargas registradas todavía.</p>
      ) : (
        <div>
          {recharges.map((recharge) => (
            <div
              key={recharge.id}
              style={{
                padding: 10,
                marginBottom: 10,
                border: "1px solid gray",
                borderRadius: 6,
              }}
            >
              <strong>{recharge.player_name}</strong>
              <div>Monto: ${recharge.amount}</div>
              <div>Fecha: {recharge.date}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}