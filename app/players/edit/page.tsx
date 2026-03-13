"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../supabase";

export default function EditPlayerPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [app, setApp] = useState("");
  const [status, setStatus] = useState("activo");

  useEffect(() => {
    if (!id) {
      alert("No se recibió el id del jugador");
      window.location.href = "/players";
      return;
    }

    loadPlayer();
  }, [id]);

  async function loadPlayer() {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error cargando jugador:", error);
      alert("No se encontró el jugador a editar");
      window.location.href = "/players";
      return;
    }

    setName(data.name || "");
    setPhone(data.phone || "");
    setApp(data.app || "");
    setStatus(data.status || "activo");
    setLoading(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("players")
      .update({
        name,
        phone,
        app,
        status,
      })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando jugador:", error);
      alert("Error actualizando jugador");
      return;
    }

    alert("Jugador actualizado correctamente");
    window.location.href = "/players";
  }

  if (loading) {
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
        <h1>Cargando jugador...</h1>
      </main>
    );
  }

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
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 20 }}>Editar jugador</h1>

        <form
          onSubmit={handleUpdate}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            backgroundColor: "#111827",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #334155",
          }}
        >
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="App"
            value={app}
            onChange={(e) => setApp(e.target.value)}
            style={inputStyle}
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <button type="submit" style={saveBtn}>
            Guardar cambios
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #475569",
  backgroundColor: "#0f172a",
  color: "white",
};

const saveBtn: React.CSSProperties = {
  padding: 12,
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
};