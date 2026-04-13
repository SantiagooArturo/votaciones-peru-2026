"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Trophy } from "@phosphor-icons/react";
import type { Candidate } from "@/core/elections/domain/types";

interface CandidateCardProps {
    candidate: Candidate;
    rank: number;
    maxPercentage: number;
    isFinished: boolean;
}

const RANK_COLORS: Record<number, { border: string; bg: string; bar: string }> = {
    1: {
        border: "border-yellow-400/60",
        bg: "bg-gradient-to-r from-yellow-400/10 to-transparent",
        bar: "bg-gradient-to-r from-yellow-400 to-yellow-500",
    },
    2: {
        border: "border-slate-300/40",
        bg: "bg-gradient-to-r from-slate-300/8 to-transparent",
        bar: "bg-gradient-to-r from-slate-300 to-slate-400",
    },
    3: {
        border: "border-amber-600/40",
        bg: "bg-gradient-to-r from-amber-600/8 to-transparent",
        bar: "bg-gradient-to-r from-amber-600 to-amber-700",
    },
};

export function CandidateCard({ candidate, rank, maxPercentage, isFinished }: CandidateCardProps) {
    const isTop3 = rank <= 3;
    const isWinner = isFinished && rank === 1;
    const colors = RANK_COLORS[rank];
    const barWidth = maxPercentage > 0
        ? (candidate.porcentajeVotosValidos / maxPercentage) * 100
        : 0;

    return (
        <div
            className={cn(
                "relative rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3.5 transition-all duration-500",
                isWinner
                    ? "border-yellow-400 bg-gradient-to-r from-yellow-400/15 to-yellow-400/5 ring-1 ring-yellow-400/30"
                    : isTop3 && colors
                        ? `${colors.border} ${colors.bg}`
                        : "border-white/[0.06] bg-white/[0.02]",
            )}
        >
            {isWinner && (
                <div className="absolute -top-2.5 left-3 flex items-center gap-1 bg-yellow-400 text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Trophy weight="fill" className="w-2.5 h-2.5" />
                    Ganador
                </div>
            )}

            <div className="flex items-center gap-2.5 sm:gap-3.5">
                {/* Rank number */}
                <span className={cn(
                    "w-5 text-center font-mono text-xs sm:text-sm font-bold shrink-0",
                    rank === 1 ? "text-yellow-400" : rank === 2 ? "text-slate-300" : rank === 3 ? "text-amber-600" : "text-white/20",
                )}>
                    {rank}
                </span>

                {/* Photo */}
                <div className={cn(
                    "w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border",
                    isTop3 ? "border-white/20" : "border-white/[0.06]",
                )}>
                    {candidate.photoUrl ? (
                        <Image
                            src={candidate.photoUrl}
                            alt={candidate.nombreCandidato}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-[10px] font-bold">
                            ?
                        </div>
                    )}
                </div>

                {/* Info + bar */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                        <div className="min-w-0">
                            <h3 className={cn(
                                "font-semibold truncate leading-tight",
                                isTop3 ? "text-white text-[13px] sm:text-sm" : "text-white/70 text-xs sm:text-[13px]",
                            )}>
                                {formatName(candidate.nombreCandidato)}
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-white/30 truncate">
                                {candidate.nombreAgrupacionPolitica}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className={cn(
                                "font-mono font-bold",
                                isTop3 ? "text-base sm:text-lg text-white" : "text-sm text-white/60",
                            )}>
                                {candidate.porcentajeVotosValidos.toFixed(2)}%
                            </p>
                            <p className="text-[8px] sm:text-[9px] text-white/25 font-mono">
                                {candidate.totalVotosValidos.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="mt-1.5 sm:mt-2 h-1 sm:h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000 ease-out",
                                isTop3 && colors ? colors.bar : "bg-white/15",
                            )}
                            style={{ width: `${barWidth}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatName(name: string): string {
    if (!name) return "—";
    return name
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}
