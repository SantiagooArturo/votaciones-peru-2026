"use client";

import type { Candidate } from "@/core/elections/domain/types";

interface ProbabilityGaugeProps {
    candidates: Candidate[];
    actasContabilizadas: number;
}

/**
 * Calculates probability of second round based on vote distribution.
 * If no candidate has >50%, second round is likely.
 */
function calculateSecondRoundProbability(
    candidates: Candidate[],
    actasPct: number,
): number {
    if (candidates.length < 2) return 0;
    const first = candidates[0]?.porcentajeVotosValidos ?? 0;
    if (first >= 50) return 0;

    const gap = first - (candidates[1]?.porcentajeVotosValidos ?? 0);
    const remaining = 100 - actasPct;

    if (first > 45 && gap > 15 && remaining < 30) return 15;
    if (first > 40 && gap > 10) return 35;
    if (first < 30) return 95;
    if (first < 35) return 85;

    return Math.min(95, Math.max(20, 100 - first * 1.5 + gap * 0.5));
}

export function ProbabilityGauge({ candidates, actasContabilizadas }: ProbabilityGaugeProps) {
    const probability = calculateSecondRoundProbability(candidates, actasContabilizadas);
    const isVeryLikely = probability >= 70;
    const isLikely = probability >= 40;

    const label = probability >= 90
        ? "Muy probable"
        : probability >= 70
            ? "Probable"
            : probability >= 40
                ? "Posible"
                : probability >= 20
                    ? "Poco probable"
                    : "Improbable";

    // SVG gauge angle: 0% = -90deg (left), 100% = 90deg (right)
    const needleAngle = -90 + (probability / 100) * 180;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 text-center">
                Probabilidad de segunda vuelta
            </h3>

            <div className="relative w-48 h-28 mx-auto">
                {/* Gauge arc */}
                <svg viewBox="0 0 200 110" className="w-full h-full">
                    {/* Background arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    {/* Green zone (improbable) */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 55 35"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="12"
                        strokeLinecap="round"
                        opacity="0.6"
                    />
                    {/* Yellow zone */}
                    <path
                        d="M 55 35 A 80 80 0 0 1 100 20"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="12"
                        opacity="0.6"
                    />
                    {/* Orange zone */}
                    <path
                        d="M 100 20 A 80 80 0 0 1 145 35"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="12"
                        opacity="0.6"
                    />
                    {/* Red zone (very probable) */}
                    <path
                        d="M 145 35 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="12"
                        strokeLinecap="round"
                        opacity="0.6"
                    />

                    {/* Needle */}
                    <g transform={`rotate(${needleAngle}, 100, 100)`}>
                        <line
                            x1="100"
                            y1="100"
                            x2="100"
                            y2="30"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <circle cx="100" cy="100" r="5" fill="white" />
                    </g>
                </svg>
            </div>

            <div className="text-center mt-2">
                <p className={`text-2xl font-bold font-mono ${
                    isVeryLikely ? "text-red-400" : isLikely ? "text-orange-400" : "text-green-400"
                }`}>
                    {probability.toFixed(0)}%
                </p>
                <p className={`text-xs font-semibold mt-0.5 ${
                    isVeryLikely ? "text-red-400/70" : isLikely ? "text-orange-400/70" : "text-green-400/70"
                }`}>
                    {label}
                </p>
            </div>

            {/* Top 2 matchup */}
            {candidates.length >= 2 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                        <div className="text-white/60">
                            <span className="font-semibold text-white/80">
                                {formatShortName(candidates[0].nombreCandidato)}
                            </span>
                            <span className="ml-1.5 font-mono text-yellow-400">
                                {candidates[0].porcentajeVotosValidos.toFixed(1)}%
                            </span>
                        </div>
                        <span className="text-white/20 text-[10px]">vs</span>
                        <div className="text-white/60 text-right">
                            <span className="font-semibold text-white/80">
                                {formatShortName(candidates[1].nombreCandidato)}
                            </span>
                            <span className="ml-1.5 font-mono text-slate-400">
                                {candidates[1].porcentajeVotosValidos.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatShortName(name: string): string {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length < 2) return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const firstLastName = parts[parts.length - 2];
    return firstLastName.charAt(0).toUpperCase() + firstLastName.slice(1).toLowerCase();
}
