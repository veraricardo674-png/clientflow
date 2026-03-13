"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
      <main style={{ padding: 40, color: "white" }}>
        <h1>Cargando jugador...</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, color: "white" }}>
      <h1>Editar jugador</h1>

      <form
        onSubmit={handleUpdate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 400,
          marginTop: 20,
        }}
      >
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10 }}
          required
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: 10 }}
          required
        />

        <input
          type="text"
          placeholder="App"
          value={app}
          onChange={(e) => setApp(e.target.value)}
          style={{ padding: 10 }}
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 10 }}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <button
          type="submit"
          style={{
            padding: 12,
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Guardar cambios
        </button>
      </form>
    </main>
  );
}