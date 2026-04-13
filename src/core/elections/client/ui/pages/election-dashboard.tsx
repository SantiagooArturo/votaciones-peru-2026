"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowsClockwise, Circle, WhatsappLogo, XLogo } from "@phosphor-icons/react";
import { CandidateCard } from "../components/candidate-card";
import { StatsBar } from "../components/stats-bar";
import { ProbabilityGauge } from "../components/probability-gauge";
import type { ElectionData } from "@/core/elections/domain/types";

const REFRESH_INTERVAL = 30_000;
const SITE_URL = "https://votaciones-peru-2026.vercel.app";

interface ElectionDashboardProps {
    initialData: ElectionData;
}

function formatName(name: string): string {
    if (!name) return "";
    return name.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getFirstLastName(name: string): string {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length < 2) return formatName(name);
    const firstLastName = parts[parts.length - 2];
    return firstLastName.charAt(0).toUpperCase() + firstLastName.slice(1).toLowerCase();
}

function WinnerCard({ name, pct }: { name: string; pct: number }) {
    return (
        <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/5 p-4 text-center">
            <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">
                Ganador en primera vuelta
            </p>
            <p className="text-lg font-bold text-white mt-1">{name}</p>
            <p className="text-sm font-mono text-yellow-400 mt-0.5">{pct.toFixed(2)}%</p>
        </div>
    );
}

function VoteDistribution({ candidates, maxPct }: { candidates: ElectionData["candidates"]; maxPct: number }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-3">
                Distribucion de votos
            </h3>
            {candidates.map((c) => (
                <div key={c.dniCandidato} className="flex items-center gap-2 mb-2 last:mb-0">
                    <span className="text-[10px] text-white/40 w-20 truncate">
                        {getFirstLastName(c.nombreCandidato)}
                    </span>
                    <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
                        <div
                            className="h-full rounded-full bg-white/25 transition-all duration-700"
                            style={{ width: `${(c.porcentajeVotosValidos / maxPct) * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 w-11 text-right">
                        {c.porcentajeVotosValidos.toFixed(1)}%
                    </span>
                </div>
            ))}
        </div>
    );
}

function buildShareText(data: ElectionData): string {
    const top3 = data.candidates.slice(0, 3);
    const lines = [
        `Elecciones Peru 2026 - Resultados EN VIVO`,
        `${data.totals.actasContabilizadas.toFixed(1)}% actas contabilizadas`,
        ``,
        ...top3.map((c, i) => `${i + 1}. ${formatName(c.nombreCandidato)} - ${c.porcentajeVotosValidos.toFixed(2)}%`),
        ``,
        `Datos oficiales ONPE`,
    ];
    return lines.join("\n");
}

export function ElectionDashboard({ initialData }: ElectionDashboardProps) {
    const [data, setData] = useState(initialData);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [countdown, setCountdown] = useState(30);

    const isFinished = data.totals.actasContabilizadas >= 99.9;
    const hasWinner = isFinished && data.candidates.length > 0 && data.candidates[0].porcentajeVotosValidos > 50;

    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch("/api/elections");
            const json = await res.json();
            setData({ ...json, lastUpdated: new Date(json.lastUpdated) });
        } catch {
            // keep current data on error
        } finally {
            setIsRefreshing(false);
            setCountdown(30);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(refresh, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [refresh]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const shareWhatsApp = () => {
        const text = buildShareText(data);
        window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n\n" + SITE_URL)}`, "_blank");
    };

    const shareX = () => {
        const text = buildShareText(data);
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SITE_URL)}`, "_blank");
    };

    const maxPct = data.candidates[0]?.porcentajeVotosValidos ?? 1;
    const top5 = data.candidates.slice(0, 5);

    return (
        <div className="min-h-screen bg-[#08080d]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-10">
                {/* Header */}
                <header className="flex items-start justify-between mb-6 sm:mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {isFinished ? (
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                    Conteo finalizado
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                                    <Circle weight="fill" className="w-2 h-2 animate-pulse" />
                                    En vivo
                                </span>
                            )}
                        </div>
                        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                            Elecciones Generales 2026
                        </h1>
                        <p className="text-[10px] sm:text-[11px] text-white/30 mt-0.5">
                            Resultados oficiales ONPE — Primera vuelta
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                            onClick={shareWhatsApp}
                            className="p-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 active:scale-95 transition-all"
                            title="Compartir en WhatsApp"
                        >
                            <WhatsappLogo weight="fill" className="w-5 h-5 text-[#25D366]" />
                        </button>
                        <button
                            onClick={shareX}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
                            title="Compartir en X"
                        >
                            <XLogo weight="bold" className="w-4 h-4 text-white/70" />
                        </button>
                    </div>
                </header>

                {/* Actas + Stats: stacked on mobile, side by side on desktop */}
                <div className="flex flex-col lg:flex-row lg:items-end gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="shrink-0">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
                            Actas contabilizadas
                        </p>
                        <p className="text-[44px] sm:text-6xl font-bold text-white font-mono tracking-tighter leading-none mt-1">
                            {data.totals.actasContabilizadas.toFixed(2)}
                            <span className="text-xl sm:text-2xl text-white/40">%</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-white/25">
                            <span>
                                {data.lastUpdated instanceof Date
                                    ? data.lastUpdated.toLocaleTimeString("es-PE")
                                    : "—"}
                            </span>
                            <span className="flex items-center gap-1">
                                <ArrowsClockwise
                                    weight="bold"
                                    className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
                                />
                                {isRefreshing ? "Actualizando..." : `${countdown}s`}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <StatsBar totals={data.totals} mesas={data.mesas} />
                    </div>
                </div>

                {/* Candidates + Sidebar */}
                <div className="lg:grid lg:grid-cols-[1fr_280px] gap-5 sm:gap-6">
                    {/* Candidates */}
                    <div>
                        <h2 className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-3">
                            Votos por candidato — Top 5
                        </h2>
                        <div className="space-y-2">
                            {top5.map((candidate, i) => (
                                <CandidateCard
                                    key={candidate.dniCandidato}
                                    candidate={candidate}
                                    rank={i + 1}
                                    maxPercentage={maxPct}
                                    isFinished={isFinished}
                                />
                            ))}
                        </div>

                        {/* Mobile: gauge + distribution below candidates */}
                        <div className="mt-5 space-y-4 lg:hidden">
                            <ProbabilityGauge
                                candidates={data.candidates}
                                actasContabilizadas={data.totals.actasContabilizadas}
                            />

                            {hasWinner && (
                                <WinnerCard name={formatName(data.candidates[0].nombreCandidato)} pct={data.candidates[0].porcentajeVotosValidos} />
                            )}

                            <VoteDistribution candidates={top5} maxPct={maxPct} />
                        </div>
                    </div>

                    {/* Desktop sidebar */}
                    <div className="hidden lg:block space-y-4">
                        <ProbabilityGauge
                            candidates={data.candidates}
                            actasContabilizadas={data.totals.actasContabilizadas}
                        />

                        {hasWinner && (
                            <WinnerCard name={formatName(data.candidates[0].nombreCandidato)} pct={data.candidates[0].porcentajeVotosValidos} />
                        )}

                        <VoteDistribution candidates={top5} maxPct={maxPct} />
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 sm:mt-10 pt-5 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[10px] text-white/15 text-center sm:text-left">
                        Datos oficiales ONPE. Resultados parciales sujetos a actualizacion.
                    </p>
                    <p className="text-[10px] text-white/25">
                        Hecho por <span className="text-white/40 font-medium">Santiago Franco Baanante</span>
                    </p>
                </footer>
            </div>
        </div>
    );
}
