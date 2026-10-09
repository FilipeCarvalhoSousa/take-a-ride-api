export interface CalculateFareParams {
  originCity: string;      // Ex: "Ceilândia", "Taguatinga", "Plano Piloto"
  destinationCity: string; // Ex: "Samambaia", "Luziânia"
  isEntorno: boolean;      // Define se a origem ou destino é no Entorno (ex: Valparaíso, Novo Gama, Formosa, Águas Lindas)
}

// Cidades vizinhas/limítrofes diretas do DF (Cidades lado a lado)
const ADJACENT_CITIES_MAP: Record<string, string[]> = {
  CEILANDIA: ['TAGUATINGA', 'SAMAMBAIA', 'SOL NASCENTE', 'BRAZLANDIA'],
  TAGUATINGA: ['CEILANDIA', 'SAMAMBAIA', 'VICENTE PIRES', 'AGUAS CLARAS', 'RIACHO FUNDO'],
  AGUAS_CLARAS: ['TAGUATINGA', 'VICENTE PIRES', 'RIACHO FUNDO', 'NUCLEO BANDEIRANTE', 'CANDANGLANDIA'],
  PLANO_PILOTO: ['CRUZEIRO', 'SOUTH WING', 'NORTH WING', 'SUDOESTE', 'LAGO SUL', 'LAGO NORTE', 'CANDANGLANDIA'],
  // Adicione outros mapeamentos conforme necessário
};

export function calculateFixedFare(params: CalculateFareParams): number {
  const { originCity, destinationCity, isEntorno } = params;

  // 1. Qualquer viagem envolvendo o Entorno tem valor fixo de R$ 7,00
  if (isEntorno) {
    return 7.00;
  }

  const originNormalized = originCity.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
  const destNormalized = destinationCity.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');

  // Mesma RA/Cidade ou Cidades lado a lado
  if (originNormalized === destNormalized) {
    return 3.80;
  }

  const adjacentList = ADJACENT_CITIES_MAP[originNormalized] || [];
  const isAdjacent = adjacentList.includes(destNormalized);

  // 2. R$ 3,80 para cidades lado a lado | R$ 5,50 para qualquer outro destino do DF
  return isAdjacent ? 3.80 : 5.50;
}