"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "1rem",
            background: "#f4efe4",
            color: "#201c17",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>مشکلی پیش آمد</h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#55503f" }}>
            سایت با خطای غیرمنتظره‌ای مواجه شد.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              borderRadius: "9999px",
              background: "#201c17",
              color: "#fbf8f1",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            تلاش دوباره
          </button>
        </div>
      </body>
    </html>
  );
}
