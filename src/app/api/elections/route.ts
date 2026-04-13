import { NextResponse } from "next/server";

const ONPE_PROXY = "https://onpe-needle.linderhassinger.dev/api/onpe";
const ONPE_IMAGES = "https://resultadoelectoral.onpe.gob.pe/assets/img-reales";

/**
 * Server-side API route that proxies ONPE data.
 * This hides the actual ONPE endpoints from the client's network tab.
 */
export async function GET() {
    const [candidatesRes, totalsRes, mesasRes] = await Promise.all([
        fetch(`${ONPE_PROXY}/candidates`, { cache: "no-store" }),
        fetch(`${ONPE_PROXY}/totals`, { cache: "no-store" }),
        fetch(`${ONPE_PROXY}/mesas`, { cache: "no-store" }),
    ]);

    const candidatesJson = await candidatesRes.json();
    const totalsJson = await totalsRes.json();
    const mesasJson = await mesasRes.json();

    const rawCandidates = candidatesJson.data as Array<Record<string, unknown>>;

    const candidates = rawCandidates
        .filter(
            (c) =>
                c.codigoAgrupacionPolitica !== "80" &&
                c.codigoAgrupacionPolitica !== "81",
        )
        .map((c) => {
            const dni = (c.dniCandidato as string) || "";
            const code = (c.codigoAgrupacionPolitica as string) || "";
            return {
                nombreCandidato: (c.nombreCandidato as string) || "",
                nombreAgrupacionPolitica: (c.nombreAgrupacionPolitica as string) || "",
                codigoAgrupacionPolitica: code,
                dniCandidato: dni,
                totalVotosValidos: (c.totalVotosValidos as number) || 0,
                porcentajeVotosValidos: (c.porcentajeVotosValidos as number) || 0,
                porcentajeVotosEmitidos: (c.porcentajeVotosEmitidos as number) || 0,
                photoUrl: dni ? `${ONPE_IMAGES}/candidatos/${dni}.jpg` : "",
                partyLogoUrl: code ? `${ONPE_IMAGES}/partidos/${code.padStart(8, "0")}.jpg` : "",
            };
        })
        .sort((a, b) => b.totalVotosValidos - a.totalVotosValidos);

    const blankVotes = rawCandidates.find((c) => c.codigoAgrupacionPolitica === "80");
    const nullVotes = rawCandidates.find((c) => c.codigoAgrupacionPolitica === "81");

    return NextResponse.json({
        candidates,
        totals: {
            actasContabilizadas: totalsJson.data.actasContabilizadas,
            contabilizadas: totalsJson.data.contabilizadas,
            totalActas: totalsJson.data.totalActas,
            participacionCiudadana: totalsJson.data.participacionCiudadana,
            fechaActualizacion: totalsJson.data.fechaActualizacion,
            totalVotosEmitidos: totalsJson.data.totalVotosEmitidos,
            totalVotosValidos: totalsJson.data.totalVotosValidos,
            votosBlancos: (blankVotes?.totalVotosValidos as number) || 0,
            votosNulos: (nullVotes?.totalVotosValidos as number) || 0,
        },
        mesas: mesasJson.data,
        lastUpdated: new Date(totalsJson.data.fechaActualizacion).toISOString(),
    });
}
