"use client";

import { useState } from "react";
import { supabase } from "../../supabase";
import { useRouter } from "next/navigation";

export default function NewPlayerPage() {

  const router = useRouter();

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [app,setApp] = useState("");

  async function createPlayer(){

    if(!name || !phone || !app){
      alert("Todos los campos son obligatorios");
      return;
    }

    const { error } = await supabase
      .from("players")
      .insert([
        {
          name,
          phone,
          app,
          status:"activo"
        }
      ]);

    if (error) {
  console.log("ERROR SUPABASE:", error);
  alert("Error creando jugador: " + error.message);
  return;
}

    alert("Jugador creado");

    router.push("/players");
  }

  return (
    <main style={{padding:40,fontFamily:"sans-serif"}}>

      <h1>Nuevo jugador</h1>

      <div style={{maxWidth:400}}>

        <input
          placeholder="Nombre"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={{display:"block",marginBottom:10,padding:10,width:"100%"}}
        />

        <input
          placeholder="Teléfono"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          style={{display:"block",marginBottom:10,padding:10,width:"100%"}}
        />

        <input
          placeholder="App"
          value={app}
          onChange={(e)=>setApp(e.target.value)}
          style={{display:"block",marginBottom:10,padding:10,width:"100%"}}
        />

        <button
          onClick={createPlayer}
          style={{
            padding:10,
            background:"#2563eb",
            color:"white",
            border:"none",
            borderRadius:6,
            cursor:"pointer"
          }}
        >
          Crear jugador
        </button>

      </div>

    </main>
  );
}