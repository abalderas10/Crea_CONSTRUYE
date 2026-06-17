"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es-MX">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0c0c0e",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#52525b",
            }}
          >
            Error
          </p>
          <h1 style={{ margin: "12px 0", fontSize: 24, fontWeight: 800 }}>
            Algo salió mal.
          </h1>
          <button
            onClick={reset}
            style={{
              marginTop: 12,
              padding: "10px 22px",
              borderRadius: 8,
              border: "none",
              background: "#c8ff00",
              color: "#000",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
