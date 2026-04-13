import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Resultados Oficiales Electorales - Peru 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #08080d 0%, #1a1a2e 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "#ef4444",
                        }}
                    />
                    <span
                        style={{
                            color: "#ef4444",
                            fontSize: "18px",
                            fontWeight: 700,
                            letterSpacing: "4px",
                            textTransform: "uppercase",
                        }}
                    >
                        EN VIVO
                    </span>
                </div>

                <h1
                    style={{
                        color: "white",
                        fontSize: "64px",
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1.1,
                        margin: 0,
                    }}
                >
                    Resultados Oficiales
                </h1>
                <h2
                    style={{
                        color: "white",
                        fontSize: "48px",
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1.1,
                        margin: 0,
                        marginTop: "8px",
                    }}
                >
                    Electorales
                </h2>

                <p
                    style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "24px",
                        marginTop: "24px",
                    }}
                >
                    Elecciones Generales Peru 2026
                </p>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginTop: "40px",
                        padding: "12px 24px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.03)",
                    }}
                >
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>
                        Datos oficiales ONPE — Actualizacion automatica cada 30s
                    </span>
                </div>

                <p
                    style={{
                        position: "absolute",
                        bottom: "30px",
                        right: "40px",
                        color: "rgba(255,255,255,0.2)",
                        fontSize: "14px",
                    }}
                >
                    Hecho por Santiago Franco Baanante
                </p>
            </div>
        ),
        { ...size },
    );
}
