"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

type Player = {
  id: string;
  name: string;
  phone: string;
  app: string;
  status: string;
  last_activity?: string | null;
};

export default function EditPlayerPage() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [appName, setAppName] = useState("");
  const [status, setStatus] = useState("activo");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayer() {
      const savedId = localStorage.getItem("editPlayerId");

      if (!savedId) {
        alert("No se encontró el jugador a editar");
        window.location.href = "/players";
        return;
      }

      setPlayerId(savedId);

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", savedId)
        .single();

      if (error || !data) {
        console.error("Error cargando jugador:", error);
        alert("No se pudo cargar el jugador");
        window.location.href = "/players";
        return;
      }

      setName(data.name || "");
      setPhone(data.phone || "");
      setAppName(data.app || "");
      setStatus(data.status || "activo");
      setLoading(false);
    }

    loadPlayer();
  }, []);

  async function handleUpdate() {
    if (!playerId) return;

    if (!name.trim() || !phone.trim() || !appName.trim()) {
      alert("Llena todos los campos");
      return;
    }

    const { data: existingPlayers, error: checkError } = await supabase
      .from("players")
      .select("id, phone")
      .eq("phone", phone.trim());

    if (checkError) {
      console.error("Error validando teléfono:", checkError);
      alert("Error validando teléfono");
      return;
    }

    const phoneExists = existingPlayers?.some((p) => p.id !== playerId);

    if (phoneExists) {
      alert("Ya existe otro jugador con ese teléfono");
      return;
    }

    const { error } = await supabase
      .from("players")
      .update({
        name: name.trim(),
        phone: phone.trim(),
        app: appName.trim(),
        status: status.trim(),
      })
      .eq("id", playerId);

    if (error) {
      console.error("Error actualizando jugador:", error);
      alert("Error actualizando jugador: " + error.message);
      return;
    }

    alert("Jugador actualizado correctamente");
    window.location.href = "/players";
  }

  if (loading) {
    return (
      <main style={{ padding: 40, fontFamily: "sans-serif", color: "white" }}>
        <h1>Cargando jugador...</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif", color: "white" }}>
      <h1 style={{ marginBottom: 20 }}>Editar jugador</h1>

      <div style={{ marginTop: 20, maxWidth: 400 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del jugador"
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

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Teléfono"
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

        <input
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="App donde juega"
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

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
        >
          <option value="activo">activo</option>
          <option value="inactivo">inactivo</option>
        </select>

        <button
          onClick={handleUpdate}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "none",
            backgroundColor: "#16a34a",
            color: "white",
            cursor: "pointer",
          }}
        >
          Guardar cambios
        </button>
      </div>
    </main>
  );
}