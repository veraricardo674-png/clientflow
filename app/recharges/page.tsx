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
          maxWidth: 980,
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
            Historial de recargas
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: 17,
              margin: 0,
            }}
          >
            Consulta las últimas recargas registradas en el sistema
          </p>
        </div>

        {recharges.length === 0 ? (
          <div
            style={{
              background: "rgba(15, 23, 42, 0.72)",
              border: "1px solid rgba(148, 163, 184, 0.20)",
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
              backdropFilter: "blur(8px)",
              textAlign: "center",
              color: "#cbd5e1",
              fontSize: 17,
            }}
          >
            No hay recargas registradas todavía.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            {recharges.map((recharge) => (
              <div
                key={recharge.id}
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
                    fontSize: 28,
                    fontWeight: "bold",
                    marginBottom: 14,
                  }}
                >
                  {recharge.player_name}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={labelStyle}>Monto</div>
                    <div
                      style={{
                        ...valueStyle,
                        color: "#22c55e",
                      }}
                    >
                      ${recharge.amount}
                    </div>
                  </div>

                  <div>
                    <div style={labelStyle}>Fecha</div>
                    <div style={valueStyle}>{recharge.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

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