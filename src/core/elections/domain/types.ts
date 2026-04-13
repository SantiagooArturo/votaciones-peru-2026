export interface Candidate {
    nombreCandidato: string;
    nombreAgrupacionPolitica: string;
    codigoAgrupacionPolitica: string;
    dniCandidato: string;
    totalVotosValidos: number;
    porcentajeVotosValidos: number;
    porcentajeVotosEmitidos: number;
    photoUrl: string;
    partyLogoUrl: string;
}

export interface Totals {
    actasContabilizadas: number;
    contabilizadas: number;
    totalActas: number;
    participacionCiudadana: number;
    fechaActualizacion: number;
    totalVotosEmitidos: number;
    totalVotosValidos: number;
    votosBlancos: number;
    votosNulos: number;
}

export interface Mesas {
    mesasInstaladas: number;
    mesasNoInstaladas: number;
    mesasPendientes: number;
}

export interface ElectionData {
    candidates: Candidate[];
    totals: Totals;
    mesas: Mesas;
    lastUpdated: Date;
}
