"use client";

import { ChartBar, UsersThree, Stack, Prohibit, Note } from "@phosphor-icons/react";
import type { Totals, Mesas } from "@/core/elections/domain/types";

interface StatsBarProps {
    totals: Totals;
    mesas: Mesas;
}

export function StatsBar({ totals, mesas }: StatsBarProps) {
    const totalMesas = mesas.mesasInstaladas + mesas.mesasPendientes;
    const mesasPct = totalMesas > 0 ? (mesas.mesasInstaladas / totalMesas) * 100 : 0;

    return (
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
            <StatCard
                icon={<ChartBar weight="fill" className="w-3.5 h-3.5 text-yellow-400" />}
                label="Actas"
                value={`${totals.actasContabilizadas.toFixed(1)}%`}
                detail={`${totals.contabilizadas.toLocaleString()} / ${totals.totalActas.toLocaleString()}`}
                progress={totals.actasContabilizadas}
            />
            <StatCard
                icon={<UsersThree weight="fill" className="w-3.5 h-3.5 text-blue-400" />}
                label="Votos"
                value={formatCompact(totals.totalVotosEmitidos)}
                detail={`${formatCompact(totals.totalVotosValidos)} validos`}
            />
            <StatCard
                icon={<Stack weight="fill" className="w-3.5 h-3.5 text-emerald-400" />}
                label="Mesas"
                value={formatCompact(mesas.mesasInstaladas)}
                detail={`de ${formatCompact(totalMesas)}`}
                progress={mesasPct}
            />
            <StatCard
                icon={<Note weight="fill" className="w-3.5 h-3.5 text-white/30" />}
                label="Blancos"
                value={formatCompact(totals.votosBlancos)}
                detail={`${((totals.votosBlancos / totals.totalVotosEmitidos) * 100).toFixed(1)}%`}
                className="hidden sm:block"
            />
            <StatCard
                icon={<Prohibit weight="fill" className="w-3.5 h-3.5 text-red-400/50" />}
                label="Nulos"
                value={formatCompact(totals.votosNulos)}
                detail={`${((totals.votosNulos / totals.totalVotosEmitidos) * 100).toFixed(1)}%`}
                className="hidden sm:block"
            />
        </div>
    );
}

function formatCompact(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toLocaleString();
}

function StatCard({
    icon,
    label,
    value,
    detail,
    progress,
    className,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    detail: string;
    progress?: number;
    className?: string;
}) {
    return (
        <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 sm:p-3.5 ${className ?? ""}`}>
            <div className="flex items-center gap-1 mb-1">
                {icon}
                <span className="text-[9px] sm:text-[10px] text-white/35 font-medium uppercase tracking-wider truncate">{label}</span>
            </div>
            <p className="text-sm sm:text-lg font-bold text-white font-mono leading-none">{value}</p>
            <p className="text-[9px] sm:text-[10px] text-white/25 mt-0.5 font-mono truncate">{detail}</p>
            {progress !== undefined && (
                <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                        className="h-full rounded-full bg-white/20 transition-all duration-1000"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
}
