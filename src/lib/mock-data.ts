// Comprehensive mock data for Argos furniture industry dashboard

export interface KPIData {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
  icon: string;
}

export interface SalesChannelData {
  id: string;
  name: string;
  icon: string;
  revenue: number;
  orders: number;
  avgTicket: number;
  conversion: number;
  change: number;
}

export interface ProductionOrder {
  id: string;
  product: string;
  line: string;
  quantity: number;
  completed: number;
  status: "em_producao" | "aguardando" | "concluido" | "atrasado";
  dueDate: string;
  priority: "alta" | "media" | "baixa";
}

export interface SupplierData {
  id: string;
  name: string;
  category: string;
  leadTime: number;
  onTimeRate: number;
  qualityScore: number;
  status: "ativo" | "em_avaliacao" | "bloqueado";
  lastOrder: string;
  pendingOrders: number;
}

export interface LogisticsData {
  id: string;
  orderId: string;
  customer: string;
  city: string;
  state: string;
  carrier: string;
  status: "preparando" | "coletado" | "em_transito" | "entregue" | "devolvido";
  estimatedDate: string;
  channel: string;
}

export interface SupportTicket {
  id: string;
  customer: string;
  subject: string;
  category: "defeito" | "montagem" | "troca" | "duvida" | "reclamacao";
  priority: "alta" | "media" | "baixa";
  status: "aberto" | "em_andamento" | "aguardando_cliente" | "resolvido";
  createdAt: string;
  channel: string;
  sla: "dentro" | "proximo" | "estourado";
}

export interface ForecastData {
  month: string;
  predicted: number;
  actual: number | null;
  lowerBound: number;
  upperBound: number;
}

// Executive KPIs
export const executiveKPIs: KPIData[] = [
  { label: "Faturamento Mensal", value: "R$ 2.847.500", change: 12.3, trend: "up", icon: "💰" },
  { label: "Pedidos Totais", value: "1.842", change: 8.7, trend: "up", icon: "📦" },
  { label: "Ticket Médio", value: "R$ 1.546", change: 3.2, trend: "up", icon: "🎯" },
  { label: "Margem Bruta", value: "38,4%", change: -1.2, trend: "down", icon: "📊" },
  { label: "Produção Diária", value: "127 un", change: 5.1, trend: "up", icon: "🏭" },
  { label: "OTD (On-Time Delivery)", value: "94,2%", change: 2.8, trend: "up", icon: "🚚" },
  { label: "NPS Score", value: "72", change: 4.0, trend: "up", icon: "⭐" },
  { label: "Tickets Abertos", value: "47", change: -15.3, trend: "down", icon: "🎧" },
];

// Retail KPIs
export const retailKPIs: KPIData[] = [
  { label: "GMV Total", value: "R$ 3.215.800", change: 15.2, trend: "up", icon: "💳" },
  { label: "Pedidos Hoje", value: "89", change: 22.1, trend: "up", icon: "📋" },
  { label: "Taxa de Conversão", value: "3,8%", change: 0.4, trend: "up", icon: "🎯" },
  { label: "CAC Médio", value: "R$ 42,30", change: -8.5, trend: "down", icon: "📉" },
  { label: "LTV Médio", value: "R$ 2.180", change: 6.3, trend: "up", icon: "💎" },
  { label: "Devoluções", value: "2,1%", change: -0.3, trend: "down", icon: "↩️" },
  { label: "Avaliação Média", value: "4,6 ★", change: 0.2, trend: "up", icon: "⭐" },
  { label: "Estoque Disponível", value: "4.230 un", change: -3.1, trend: "down", icon: "📦" },
];

// Industry KPIs
export const industryKPIs: KPIData[] = [
  { label: "OEE Geral", value: "78,5%", change: 3.2, trend: "up", icon: "⚙️" },
  { label: "Produção Mensal", value: "3.420 un", change: 7.8, trend: "up", icon: "🏭" },
  { label: "Refugo", value: "1,8%", change: -0.5, trend: "down", icon: "🗑️" },
  { label: "Lead Time Produção", value: "8,2 dias", change: -1.3, trend: "down", icon: "⏱️" },
  { label: "Utilização Máquinas", value: "82,3%", change: 2.1, trend: "up", icon: "🔧" },
  { label: "Custo por Unidade", value: "R$ 487", change: -2.4, trend: "down", icon: "💰" },
  { label: "Ordens em Produção", value: "34", change: 12.0, trend: "up", icon: "📋" },
  { label: "Manutenções Pendentes", value: "3", change: -2.0, trend: "down", icon: "🔩" },
];

// Sales by channel
export const salesChannels: SalesChannelData[] = [
  { id: "ml", name: "Mercado Livre", icon: "🟡", revenue: 892400, orders: 612, avgTicket: 1458, conversion: 4.2, change: 18.3 },
  { id: "amazon", name: "Amazon", icon: "🟠", revenue: 634200, orders: 398, avgTicket: 1594, conversion: 3.8, change: 24.1 },
  { id: "magalu", name: "Magazine Luiza", icon: "🔵", revenue: 521800, orders: 347, avgTicket: 1504, conversion: 3.5, change: 9.7 },
  { id: "shopee", name: "Shopee", icon: "🔴", revenue: 312500, orders: 285, avgTicket: 1096, conversion: 2.9, change: 31.2 },
  { id: "site", name: "Site Próprio", icon: "🟣", revenue: 298600, orders: 124, avgTicket: 2408, conversion: 5.1, change: 7.4 },
  { id: "b2b", name: "B2B / Atacado", icon: "🟢", revenue: 188000, orders: 76, avgTicket: 2474, conversion: 12.8, change: -3.2 },
];

// Production orders
export const productionOrders: ProductionOrder[] = [
  { id: "OP-2024-0891", product: "Sofá Retrátil 3 Lugares", line: "Linha A - Estofados", quantity: 45, completed: 32, status: "em_producao", dueDate: "2024-02-15", priority: "alta" },
  { id: "OP-2024-0892", product: "Mesa de Jantar 6 Lugares", line: "Linha B - Madeira", quantity: 30, completed: 30, status: "concluido", dueDate: "2024-02-12", priority: "media" },
  { id: "OP-2024-0893", product: "Rack para TV 180cm", line: "Linha C - MDF", quantity: 80, completed: 54, status: "em_producao", dueDate: "2024-02-18", priority: "media" },
  { id: "OP-2024-0894", product: "Guarda-Roupa 6 Portas", line: "Linha C - MDF", quantity: 25, completed: 8, status: "atrasado", dueDate: "2024-02-10", priority: "alta" },
  { id: "OP-2024-0895", product: "Cama Box Queen", line: "Linha A - Estofados", quantity: 60, completed: 0, status: "aguardando", dueDate: "2024-02-22", priority: "baixa" },
  { id: "OP-2024-0896", product: "Escrivaninha Home Office", line: "Linha B - Madeira", quantity: 100, completed: 67, status: "em_producao", dueDate: "2024-02-16", priority: "alta" },
  { id: "OP-2024-0897", product: "Painel para TV 220cm", line: "Linha C - MDF", quantity: 50, completed: 50, status: "concluido", dueDate: "2024-02-14", priority: "media" },
  { id: "OP-2024-0898", product: "Poltrona Decorativa", line: "Linha A - Estofados", quantity: 35, completed: 12, status: "em_producao", dueDate: "2024-02-20", priority: "baixa" },
];

// Suppliers
export const suppliers: SupplierData[] = [
  { id: "SUP-001", name: "MadeiraTech Ltda", category: "Madeira / MDF", leadTime: 7, onTimeRate: 96.2, qualityScore: 94, status: "ativo", lastOrder: "2024-02-08", pendingOrders: 3 },
  { id: "SUP-002", name: "TecidosBR S.A.", category: "Tecidos / Espumas", leadTime: 5, onTimeRate: 91.8, qualityScore: 88, status: "ativo", lastOrder: "2024-02-10", pendingOrders: 2 },
  { id: "SUP-003", name: "Ferragens Premium", category: "Ferragens / Acessórios", leadTime: 3, onTimeRate: 98.5, qualityScore: 97, status: "ativo", lastOrder: "2024-02-11", pendingOrders: 1 },
  { id: "SUP-004", name: "Cola & Acabamento", category: "Químicos / Acabamento", leadTime: 4, onTimeRate: 85.3, qualityScore: 82, status: "em_avaliacao", lastOrder: "2024-02-05", pendingOrders: 4 },
  { id: "SUP-005", name: "Vidros Especiais", category: "Vidro / Espelhos", leadTime: 10, onTimeRate: 78.9, qualityScore: 90, status: "em_avaliacao", lastOrder: "2024-01-28", pendingOrders: 2 },
  { id: "SUP-006", name: "EcoFoam Indústria", category: "Tecidos / Espumas", leadTime: 6, onTimeRate: 93.1, qualityScore: 91, status: "ativo", lastOrder: "2024-02-09", pendingOrders: 1 },
];

// Logistics
export const logistics: LogisticsData[] = [
  { id: "LOG-4521", orderId: "PED-89012", customer: "Maria Silva", city: "São Paulo", state: "SP", carrier: "Jadlog", status: "em_transito", estimatedDate: "2024-02-14", channel: "Mercado Livre" },
  { id: "LOG-4522", orderId: "PED-89013", customer: "João Santos", city: "Rio de Janeiro", state: "RJ", carrier: "Correios", status: "coletado", estimatedDate: "2024-02-16", channel: "Amazon" },
  { id: "LOG-4523", orderId: "PED-89014", customer: "Ana Oliveira", city: "Belo Horizonte", state: "MG", carrier: "Transportadora XYZ", status: "entregue", estimatedDate: "2024-02-12", channel: "Magazine Luiza" },
  { id: "LOG-4524", orderId: "PED-89015", customer: "Carlos Souza", city: "Curitiba", state: "PR", carrier: "Jadlog", status: "preparando", estimatedDate: "2024-02-18", channel: "Shopee" },
  { id: "LOG-4525", orderId: "PED-89016", customer: "Fernanda Lima", city: "Porto Alegre", state: "RS", carrier: "Correios", status: "em_transito", estimatedDate: "2024-02-15", channel: "Site Próprio" },
  { id: "LOG-4526", orderId: "PED-89017", customer: "Roberto Alves", city: "Salvador", state: "BA", carrier: "Transportadora XYZ", status: "devolvido", estimatedDate: "2024-02-11", channel: "Mercado Livre" },
  { id: "LOG-4527", orderId: "PED-89018", customer: "Loja Decor Plus", city: "Campinas", state: "SP", carrier: "Jadlog", status: "em_transito", estimatedDate: "2024-02-13", channel: "B2B / Atacado" },
  { id: "LOG-4528", orderId: "PED-89019", customer: "Patricia Costa", city: "Recife", state: "PE", carrier: "Correios", status: "coletado", estimatedDate: "2024-02-17", channel: "Amazon" },
];

// Support tickets
export const supportTickets: SupportTicket[] = [
  { id: "TK-3201", customer: "Maria Silva", subject: "Sofá com defeito no mecanismo retrátil", category: "defeito", priority: "alta", status: "aberto", createdAt: "2024-02-12 09:30", channel: "Mercado Livre", sla: "dentro" },
  { id: "TK-3202", customer: "João Santos", subject: "Dúvida sobre montagem da mesa", category: "montagem", priority: "baixa", status: "em_andamento", createdAt: "2024-02-11 14:15", channel: "Amazon", sla: "dentro" },
  { id: "TK-3203", customer: "Ana Oliveira", subject: "Solicita troca de cor do rack", category: "troca", priority: "media", status: "aguardando_cliente", createdAt: "2024-02-10 11:00", channel: "Magazine Luiza", sla: "proximo" },
  { id: "TK-3204", customer: "Carlos Souza", subject: "Guarda-roupa com porta desalinhada", category: "defeito", priority: "alta", status: "aberto", createdAt: "2024-02-12 08:45", channel: "Shopee", sla: "estourado" },
  { id: "TK-3205", customer: "Fernanda Lima", subject: "Reclamação sobre prazo de entrega", category: "reclamacao", priority: "alta", status: "em_andamento", createdAt: "2024-02-09 16:20", channel: "Site Próprio", sla: "estourado" },
  { id: "TK-3206", customer: "Roberto Alves", subject: "Peça faltando na embalagem", category: "defeito", priority: "media", status: "aberto", createdAt: "2024-02-12 10:10", channel: "Mercado Livre", sla: "dentro" },
];

// Revenue by month (last 12 months)
export const monthlyRevenue = [
  { month: "Mar", revenue: 1820000, orders: 1180 },
  { month: "Abr", revenue: 1950000, orders: 1250 },
  { month: "Mai", revenue: 2100000, orders: 1340 },
  { month: "Jun", revenue: 1890000, orders: 1210 },
  { month: "Jul", revenue: 2250000, orders: 1420 },
  { month: "Ago", revenue: 2380000, orders: 1510 },
  { month: "Set", revenue: 2150000, orders: 1380 },
  { month: "Out", revenue: 2420000, orders: 1560 },
  { month: "Nov", revenue: 2890000, orders: 1820 },
  { month: "Dez", revenue: 3150000, orders: 1980 },
  { month: "Jan", revenue: 2540000, orders: 1650 },
  { month: "Fev", revenue: 2847500, orders: 1842 },
];

// Forecast data
export const forecastData: ForecastData[] = [
  { month: "Jan", predicted: 2480000, actual: 2540000, lowerBound: 2200000, upperBound: 2760000 },
  { month: "Fev", predicted: 2790000, actual: 2847500, lowerBound: 2500000, upperBound: 3080000 },
  { month: "Mar", predicted: 3050000, actual: null, lowerBound: 2720000, upperBound: 3380000 },
  { month: "Abr", predicted: 2920000, actual: null, lowerBound: 2580000, upperBound: 3260000 },
  { month: "Mai", predicted: 3180000, actual: null, lowerBound: 2800000, upperBound: 3560000 },
  { month: "Jun", predicted: 2850000, actual: null, lowerBound: 2480000, upperBound: 3220000 },
];

// Production lines utilization
export const productionLines = [
  { name: "Linha A - Estofados", utilization: 87, capacity: 50, producing: 44, efficiency: 91.2 },
  { name: "Linha B - Madeira", utilization: 72, capacity: 40, producing: 29, efficiency: 85.7 },
  { name: "Linha C - MDF", utilization: 93, capacity: 60, producing: 56, efficiency: 78.5 },
];

// Top products
export const topProducts = [
  { name: "Sofá Retrátil 3 Lugares", sales: 312, revenue: 623688, margin: 42.1 },
  { name: "Rack para TV 180cm", sales: 287, revenue: 344113, margin: 38.5 },
  { name: "Mesa de Jantar 6 Lugares", sales: 198, revenue: 394020, margin: 35.8 },
  { name: "Escrivaninha Home Office", sales: 245, revenue: 220255, margin: 44.2 },
  { name: "Guarda-Roupa 6 Portas", sales: 156, revenue: 389844, margin: 33.6 },
];

// Inventory alerts
export const inventoryAlerts = [
  { material: "MDF Branco 15mm", current: 120, minimum: 200, unit: "chapas", daysToStockout: 3 },
  { material: "Espuma D33", current: 85, minimum: 150, unit: "blocos", daysToStockout: 5 },
  { material: "Tecido Suede Cinza", current: 45, minimum: 100, unit: "metros", daysToStockout: 2 },
  { material: "Dobradiça 35mm", current: 340, minimum: 500, unit: "pares", daysToStockout: 7 },
];
