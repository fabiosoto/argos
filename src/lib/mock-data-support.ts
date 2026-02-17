// Extended mock data for the technical support & pós-venda portal

export interface SupportTicketDetail {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  orderNumber: string;
  product: string;
  subject: string;
  description: string;
  category: "defeito" | "montagem" | "troca" | "duvida" | "reclamacao" | "garantia";
  priority: "alta" | "media" | "baixa" | "critica";
  status: "aberto" | "em_andamento" | "aguardando_cliente" | "aguardando_peca" | "visita_agendada" | "resolvido" | "fechado";
  channel: string;
  sla: "dentro" | "proximo" | "estourado";
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  resolution?: string;
  satisfactionScore?: number;
  messages: TicketMessage[];
  timeline: TimelineEvent[];
}

export interface TicketMessage {
  id: string;
  sender: string;
  senderType: "agent" | "customer" | "system";
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface TimelineEvent {
  id: string;
  type: "created" | "assigned" | "status_change" | "message" | "escalated" | "resolved" | "visit_scheduled";
  description: string;
  timestamp: string;
  actor: string;
}

export interface WarrantyRecord {
  id: string;
  orderNumber: string;
  product: string;
  customer: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: "ativa" | "expirada" | "acionada";
  claims: number;
  channel: string;
}

export interface TechnicalVisit {
  id: string;
  ticketId: string;
  customer: string;
  address: string;
  city: string;
  state: string;
  scheduledDate: string;
  scheduledTime: string;
  technician: string;
  status: "agendada" | "em_rota" | "concluida" | "cancelada" | "reagendada";
  type: "montagem" | "reparo" | "troca" | "vistoria";
  product: string;
  notes?: string;
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  reason: "defeito" | "arrependimento" | "produto_errado" | "avaria_transporte" | "incompleto";
  status: "solicitada" | "aprovada" | "coleta_agendada" | "em_transito" | "recebida" | "reembolsada" | "negada";
  requestDate: string;
  channel: string;
  refundAmount: number;
}

// Detailed support tickets
export const supportTicketsDetailed: SupportTicketDetail[] = [
  {
    id: "TK-3201",
    customer: "Maria Silva",
    customerEmail: "maria.silva@email.com",
    customerPhone: "(11) 98765-4321",
    orderNumber: "PED-89012",
    product: "Sofá Retrátil 3 Lugares - Cinza",
    subject: "Sofá com defeito no mecanismo retrátil",
    description: "O mecanismo retrátil do lado esquerdo do sofá travou após 2 semanas de uso. Não retrai completamente e faz barulho ao tentar.",
    category: "defeito",
    priority: "alta",
    status: "em_andamento",
    channel: "Mercado Livre",
    sla: "dentro",
    createdAt: "2024-02-12 09:30",
    updatedAt: "2024-02-13 11:20",
    assignedTo: "Carlos Técnico",
    messages: [
      { id: "m1", sender: "Maria Silva", senderType: "customer", message: "O mecanismo retrátil do lado esquerdo travou. Não consigo retrair o sofá.", timestamp: "2024-02-12 09:30" },
      { id: "m2", sender: "Carlos Técnico", senderType: "agent", message: "Olá Maria! Lamento pelo inconveniente. Vamos resolver isso. Pode enviar um vídeo do problema?", timestamp: "2024-02-12 10:15" },
      { id: "m3", sender: "Maria Silva", senderType: "customer", message: "Enviei o vídeo por WhatsApp conforme orientado.", timestamp: "2024-02-12 14:30" },
      { id: "m4", sender: "Sistema", senderType: "system", message: "Visita técnica agendada para 15/02/2024 às 14:00", timestamp: "2024-02-13 11:20" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Ticket criado via Mercado Livre", timestamp: "2024-02-12 09:30", actor: "Sistema" },
      { id: "t2", type: "assigned", description: "Atribuído a Carlos Técnico", timestamp: "2024-02-12 09:35", actor: "Sistema" },
      { id: "t3", type: "message", description: "Resposta enviada ao cliente", timestamp: "2024-02-12 10:15", actor: "Carlos Técnico" },
      { id: "t4", type: "visit_scheduled", description: "Visita técnica agendada", timestamp: "2024-02-13 11:20", actor: "Carlos Técnico" },
    ],
  },
  {
    id: "TK-3202",
    customer: "João Santos",
    customerEmail: "joao.santos@email.com",
    customerPhone: "(21) 99876-5432",
    orderNumber: "PED-89013",
    product: "Mesa de Jantar 6 Lugares - Carvalho",
    subject: "Dúvida sobre montagem da mesa",
    description: "Recebi a mesa mas o manual de montagem está confuso. Preciso de ajuda com o passo 5.",
    category: "montagem",
    priority: "baixa",
    status: "em_andamento",
    channel: "Amazon",
    sla: "dentro",
    createdAt: "2024-02-11 14:15",
    updatedAt: "2024-02-12 09:00",
    assignedTo: "Ana Suporte",
    messages: [
      { id: "m1", sender: "João Santos", senderType: "customer", message: "O manual de montagem está confuso no passo 5. Quais parafusos usar?", timestamp: "2024-02-11 14:15" },
      { id: "m2", sender: "Ana Suporte", senderType: "agent", message: "Olá João! No passo 5, use os parafusos do pacote B (os maiores). Envio um vídeo tutorial.", timestamp: "2024-02-12 09:00" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Ticket criado via Amazon", timestamp: "2024-02-11 14:15", actor: "Sistema" },
      { id: "t2", type: "assigned", description: "Atribuído a Ana Suporte", timestamp: "2024-02-11 14:20", actor: "Sistema" },
      { id: "t3", type: "message", description: "Resposta com tutorial enviada", timestamp: "2024-02-12 09:00", actor: "Ana Suporte" },
    ],
  },
  {
    id: "TK-3203",
    customer: "Ana Oliveira",
    customerEmail: "ana.oliveira@email.com",
    customerPhone: "(31) 98765-1234",
    orderNumber: "PED-89014",
    product: "Rack para TV 180cm - Branco",
    subject: "Solicita troca de cor do rack",
    description: "Gostaria de trocar o rack branco por um na cor carvalho. O produto ainda está na embalagem original.",
    category: "troca",
    priority: "media",
    status: "aguardando_cliente",
    channel: "Magazine Luiza",
    sla: "proximo",
    createdAt: "2024-02-10 11:00",
    updatedAt: "2024-02-12 16:00",
    assignedTo: "Pedro Logística",
    messages: [
      { id: "m1", sender: "Ana Oliveira", senderType: "customer", message: "Quero trocar a cor do rack de branco para carvalho.", timestamp: "2024-02-10 11:00" },
      { id: "m2", sender: "Pedro Logística", senderType: "agent", message: "Olá Ana! A troca é possível. Preciso que confirme se o produto está na embalagem original e sem uso.", timestamp: "2024-02-10 15:30" },
      { id: "m3", sender: "Ana Oliveira", senderType: "customer", message: "Sim, está na embalagem original, nem abri.", timestamp: "2024-02-11 08:00" },
      { id: "m4", sender: "Pedro Logística", senderType: "agent", message: "Perfeito! Vou agendar a coleta. Preciso que confirme o melhor horário.", timestamp: "2024-02-12 16:00" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Solicitação de troca criada", timestamp: "2024-02-10 11:00", actor: "Sistema" },
      { id: "t2", type: "assigned", description: "Atribuído a Pedro Logística", timestamp: "2024-02-10 11:05", actor: "Sistema" },
      { id: "t3", type: "status_change", description: "Status: Aguardando Cliente", timestamp: "2024-02-12 16:00", actor: "Pedro Logística" },
    ],
  },
  {
    id: "TK-3204",
    customer: "Carlos Souza",
    customerEmail: "carlos.souza@email.com",
    customerPhone: "(41) 99654-3210",
    orderNumber: "PED-89015",
    product: "Guarda-Roupa 6 Portas - Nogueira",
    subject: "Guarda-roupa com porta desalinhada",
    description: "A porta do meio do guarda-roupa está desalinhada e não fecha corretamente. Parece problema de dobradiça.",
    category: "defeito",
    priority: "critica",
    status: "aberto",
    channel: "Shopee",
    sla: "estourado",
    createdAt: "2024-02-12 08:45",
    updatedAt: "2024-02-12 08:45",
    assignedTo: "",
    messages: [
      { id: "m1", sender: "Carlos Souza", senderType: "customer", message: "A porta do meio não fecha! Está completamente desalinhada. Preciso de solução urgente.", timestamp: "2024-02-12 08:45" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Ticket criado via Shopee - SLA Estourado", timestamp: "2024-02-12 08:45", actor: "Sistema" },
    ],
  },
  {
    id: "TK-3205",
    customer: "Fernanda Lima",
    customerEmail: "fernanda.lima@email.com",
    customerPhone: "(51) 98432-1098",
    orderNumber: "PED-89016",
    product: "Cama Box Queen - Bege",
    subject: "Reclamação sobre prazo de entrega",
    description: "Minha cama deveria ter chegado há 5 dias e até agora nada. Rastreamento não atualiza.",
    category: "reclamacao",
    priority: "alta",
    status: "em_andamento",
    channel: "Site Próprio",
    sla: "estourado",
    createdAt: "2024-02-09 16:20",
    updatedAt: "2024-02-12 14:00",
    assignedTo: "Marcos Logística",
    messages: [
      { id: "m1", sender: "Fernanda Lima", senderType: "customer", message: "Já se passaram 5 dias do prazo e minha cama não chegou!", timestamp: "2024-02-09 16:20" },
      { id: "m2", sender: "Marcos Logística", senderType: "agent", message: "Fernanda, peço desculpas pelo atraso. Estou verificando com a transportadora.", timestamp: "2024-02-10 09:00" },
      { id: "m3", sender: "Marcos Logística", senderType: "agent", message: "Identifiquei que houve um problema na rota. Nova previsão: 14/02. Vou acompanhar pessoalmente.", timestamp: "2024-02-12 14:00" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Reclamação criada - prazo excedido", timestamp: "2024-02-09 16:20", actor: "Sistema" },
      { id: "t2", type: "assigned", description: "Atribuído a Marcos Logística", timestamp: "2024-02-09 16:25", actor: "Sistema" },
      { id: "t3", type: "escalated", description: "Escalado para gerência de logística", timestamp: "2024-02-11 10:00", actor: "Sistema" },
    ],
  },
  {
    id: "TK-3206",
    customer: "Roberto Alves",
    customerEmail: "roberto.alves@email.com",
    customerPhone: "(71) 99321-6543",
    orderNumber: "PED-89017",
    product: "Escrivaninha Home Office - Branco/Carvalho",
    subject: "Peça faltando na embalagem",
    description: "Faltam 4 parafusos e a gaveta lateral na embalagem. Não consigo finalizar a montagem.",
    category: "defeito",
    priority: "media",
    status: "aguardando_peca",
    channel: "Mercado Livre",
    sla: "dentro",
    createdAt: "2024-02-12 10:10",
    updatedAt: "2024-02-13 09:00",
    assignedTo: "Ana Suporte",
    messages: [
      { id: "m1", sender: "Roberto Alves", senderType: "customer", message: "Faltam peças na embalagem: 4 parafusos e a gaveta lateral.", timestamp: "2024-02-12 10:10" },
      { id: "m2", sender: "Ana Suporte", senderType: "agent", message: "Roberto, lamento pelo ocorrido. Já solicitei o envio das peças faltantes. Previsão: 2 dias úteis.", timestamp: "2024-02-12 14:00" },
      { id: "m3", sender: "Sistema", senderType: "system", message: "Peças de reposição enviadas - Rastreio: JD123456789BR", timestamp: "2024-02-13 09:00" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Ticket criado - peças faltantes", timestamp: "2024-02-12 10:10", actor: "Sistema" },
      { id: "t2", type: "assigned", description: "Atribuído a Ana Suporte", timestamp: "2024-02-12 10:15", actor: "Sistema" },
      { id: "t3", type: "status_change", description: "Status: Aguardando Peça - envio solicitado", timestamp: "2024-02-13 09:00", actor: "Ana Suporte" },
    ],
  },
  {
    id: "TK-3207",
    customer: "Patrícia Costa",
    customerEmail: "patricia.costa@email.com",
    customerPhone: "(81) 98765-9876",
    orderNumber: "PED-89019",
    product: "Poltrona Decorativa - Veludo Verde",
    subject: "Garantia - tecido descascando",
    description: "O tecido da poltrona começou a descascar após 4 meses de uso. Produto dentro da garantia.",
    category: "garantia",
    priority: "media",
    status: "visita_agendada",
    channel: "Amazon",
    sla: "dentro",
    createdAt: "2024-02-08 11:30",
    updatedAt: "2024-02-12 15:00",
    assignedTo: "Carlos Técnico",
    messages: [
      { id: "m1", sender: "Patrícia Costa", senderType: "customer", message: "O tecido da poltrona está descascando. Comprei há 4 meses apenas.", timestamp: "2024-02-08 11:30" },
      { id: "m2", sender: "Carlos Técnico", senderType: "agent", message: "Patrícia, vamos agendar uma visita técnica para avaliar. Qual o melhor dia?", timestamp: "2024-02-09 09:00" },
      { id: "m3", sender: "Patrícia Costa", senderType: "customer", message: "Pode ser quinta-feira à tarde.", timestamp: "2024-02-09 14:00" },
      { id: "m4", sender: "Sistema", senderType: "system", message: "Visita técnica agendada: 15/02/2024 às 15:00", timestamp: "2024-02-12 15:00" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Acionamento de garantia", timestamp: "2024-02-08 11:30", actor: "Sistema" },
      { id: "t2", type: "assigned", description: "Atribuído a Carlos Técnico", timestamp: "2024-02-08 11:35", actor: "Sistema" },
      { id: "t3", type: "visit_scheduled", description: "Visita agendada para 15/02", timestamp: "2024-02-12 15:00", actor: "Carlos Técnico" },
    ],
  },
  {
    id: "TK-3208",
    customer: "Loja Decor Plus",
    customerEmail: "compras@decorplus.com.br",
    customerPhone: "(19) 3456-7890",
    orderNumber: "PED-89018",
    product: "Lote 20x Rack para TV 180cm",
    subject: "3 unidades com avaria no transporte",
    description: "Do lote de 20 racks, 3 unidades chegaram com avarias visíveis na embalagem e no produto.",
    category: "defeito",
    priority: "critica",
    status: "em_andamento",
    channel: "B2B / Atacado",
    sla: "dentro",
    createdAt: "2024-02-11 08:00",
    updatedAt: "2024-02-12 17:00",
    assignedTo: "Marcos Logística",
    messages: [
      { id: "m1", sender: "Loja Decor Plus", senderType: "customer", message: "3 dos 20 racks vieram avariados. Preciso de reposição urgente para não perder vendas.", timestamp: "2024-02-11 08:00" },
      { id: "m2", sender: "Marcos Logística", senderType: "agent", message: "Já acionamos a produção para reposição prioritária. Previsão de envio: 48h.", timestamp: "2024-02-11 10:00" },
      { id: "m3", sender: "Sistema", senderType: "system", message: "Ordem de produção emergencial OP-2024-0899 criada", timestamp: "2024-02-12 17:00" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Ticket B2B criado - avaria em lote", timestamp: "2024-02-11 08:00", actor: "Sistema" },
      { id: "t2", type: "assigned", description: "Atribuído a Marcos Logística", timestamp: "2024-02-11 08:05", actor: "Sistema" },
      { id: "t3", type: "escalated", description: "Escalado - ordem de produção emergencial", timestamp: "2024-02-12 17:00", actor: "Marcos Logística" },
    ],
  },
];

// Warranty records
export const warrantyRecords: WarrantyRecord[] = [
  { id: "GAR-001", orderNumber: "PED-87001", product: "Sofá Retrátil 3 Lugares", customer: "Maria Silva", purchaseDate: "2024-01-15", warrantyExpiry: "2025-01-15", status: "acionada", claims: 1, channel: "Mercado Livre" },
  { id: "GAR-002", orderNumber: "PED-87045", product: "Mesa de Jantar 6 Lugares", customer: "João Santos", purchaseDate: "2023-11-20", warrantyExpiry: "2024-11-20", status: "ativa", claims: 0, channel: "Amazon" },
  { id: "GAR-003", orderNumber: "PED-86890", product: "Guarda-Roupa 6 Portas", customer: "Carlos Souza", purchaseDate: "2023-08-10", warrantyExpiry: "2024-08-10", status: "acionada", claims: 2, channel: "Shopee" },
  { id: "GAR-004", orderNumber: "PED-85200", product: "Poltrona Decorativa", customer: "Patrícia Costa", purchaseDate: "2023-10-05", warrantyExpiry: "2024-10-05", status: "acionada", claims: 1, channel: "Amazon" },
  { id: "GAR-005", orderNumber: "PED-84100", product: "Rack para TV 180cm", customer: "Fernanda Lima", purchaseDate: "2023-06-15", warrantyExpiry: "2024-06-15", status: "ativa", claims: 0, channel: "Site Próprio" },
  { id: "GAR-006", orderNumber: "PED-83500", product: "Cama Box Queen", customer: "Roberto Alves", purchaseDate: "2023-03-20", warrantyExpiry: "2024-03-20", status: "expirada", claims: 0, channel: "Mercado Livre" },
  { id: "GAR-007", orderNumber: "PED-88100", product: "Escrivaninha Home Office", customer: "Luciana Mendes", purchaseDate: "2024-01-28", warrantyExpiry: "2025-01-28", status: "ativa", claims: 0, channel: "Magazine Luiza" },
  { id: "GAR-008", orderNumber: "PED-88500", product: "Painel para TV 220cm", customer: "André Pereira", purchaseDate: "2024-02-01", warrantyExpiry: "2025-02-01", status: "ativa", claims: 0, channel: "Shopee" },
];

// Technical visits
export const technicalVisits: TechnicalVisit[] = [
  { id: "VT-101", ticketId: "TK-3201", customer: "Maria Silva", address: "Rua das Flores, 123", city: "São Paulo", state: "SP", scheduledDate: "2024-02-15", scheduledTime: "14:00", technician: "Carlos Técnico", status: "agendada", type: "reparo", product: "Sofá Retrátil 3 Lugares" },
  { id: "VT-102", ticketId: "TK-3207", customer: "Patrícia Costa", address: "Av. Boa Viagem, 456", city: "Recife", state: "PE", scheduledDate: "2024-02-15", scheduledTime: "15:00", technician: "Carlos Técnico", status: "agendada", type: "vistoria", product: "Poltrona Decorativa" },
  { id: "VT-103", ticketId: "TK-3100", customer: "Lucas Ferreira", address: "Rua XV de Novembro, 789", city: "Curitiba", state: "PR", scheduledDate: "2024-02-14", scheduledTime: "10:00", technician: "Ricardo Montador", status: "concluida", type: "montagem", product: "Guarda-Roupa 6 Portas", notes: "Montagem concluída com sucesso. Cliente satisfeito." },
  { id: "VT-104", ticketId: "TK-3150", customer: "Camila Rodrigues", address: "Rua Augusta, 321", city: "São Paulo", state: "SP", scheduledDate: "2024-02-14", scheduledTime: "16:00", technician: "Carlos Técnico", status: "concluida", type: "reparo", product: "Mesa de Jantar 6 Lugares", notes: "Pé da mesa ajustado. Problema de nivelamento resolvido." },
  { id: "VT-105", ticketId: "TK-3180", customer: "Bruno Martins", address: "Av. Paulista, 1000", city: "São Paulo", state: "SP", scheduledDate: "2024-02-16", scheduledTime: "09:00", technician: "Ricardo Montador", status: "agendada", type: "troca", product: "Rack para TV 180cm" },
  { id: "VT-106", ticketId: "TK-3190", customer: "Juliana Almeida", address: "Rua da Bahia, 567", city: "Belo Horizonte", state: "MG", scheduledDate: "2024-02-13", scheduledTime: "11:00", technician: "Ricardo Montador", status: "cancelada", type: "montagem", product: "Escrivaninha Home Office", notes: "Cliente cancelou - conseguiu montar sozinho." },
];

// Return requests
export const returnRequests: ReturnRequest[] = [
  { id: "DEV-401", orderNumber: "PED-89014", customer: "Ana Oliveira", product: "Rack para TV 180cm - Branco", reason: "arrependimento", status: "coleta_agendada", requestDate: "2024-02-10", channel: "Magazine Luiza", refundAmount: 1199.90 },
  { id: "DEV-402", orderNumber: "PED-89017", customer: "Roberto Alves", product: "Escrivaninha Home Office", reason: "incompleto", status: "em_transito", requestDate: "2024-02-08", channel: "Mercado Livre", refundAmount: 899.90 },
  { id: "DEV-403", orderNumber: "PED-88900", customer: "Marcos Pereira", product: "Sofá Retrátil 3 Lugares - Bege", reason: "defeito", status: "recebida", requestDate: "2024-02-05", channel: "Amazon", refundAmount: 1999.90 },
  { id: "DEV-404", orderNumber: "PED-88850", customer: "Carla Mendes", product: "Mesa de Jantar 6 Lugares", reason: "avaria_transporte", status: "reembolsada", requestDate: "2024-02-01", channel: "Shopee", refundAmount: 1989.00 },
  { id: "DEV-405", orderNumber: "PED-89020", customer: "Felipe Nunes", product: "Painel para TV 220cm", reason: "produto_errado", status: "solicitada", requestDate: "2024-02-12", channel: "Site Próprio", refundAmount: 749.90 },
  { id: "DEV-406", orderNumber: "PED-88700", customer: "Renata Dias", product: "Cama Box Queen", reason: "arrependimento", status: "negada", requestDate: "2024-02-03", channel: "Mercado Livre", refundAmount: 1599.00 },
];

// Support performance metrics
export const supportMetrics = {
  avgResponseTime: 2.4, // hours
  avgResolutionTime: 18.6, // hours
  firstContactResolution: 42.3, // percent
  slaCompliance: 87.3, // percent
  csat: 4.2, // out of 5
  nps: 68,
  ticketsByCategory: [
    { category: "Defeito", count: 18, percentage: 38.3 },
    { category: "Montagem", count: 9, percentage: 19.1 },
    { category: "Troca", count: 7, percentage: 14.9 },
    { category: "Reclamação", count: 6, percentage: 12.8 },
    { category: "Garantia", count: 4, percentage: 8.5 },
    { category: "Dúvida", count: 3, percentage: 6.4 },
  ],
  ticketsByChannel: [
    { channel: "Mercado Livre", count: 15, percentage: 31.9 },
    { channel: "Amazon", count: 10, percentage: 21.3 },
    { channel: "Shopee", count: 8, percentage: 17.0 },
    { channel: "Magazine Luiza", count: 6, percentage: 12.8 },
    { channel: "Site Próprio", count: 5, percentage: 10.6 },
    { channel: "B2B / Atacado", count: 3, percentage: 6.4 },
  ],
  weeklyTrend: [32, 28, 35, 41, 38, 47, 43],
  resolutionRate: [78, 82, 79, 85, 83, 87, 84],
  technicianPerformance: [
    { name: "Carlos Técnico", resolved: 24, avgTime: 14.2, satisfaction: 4.5 },
    { name: "Ana Suporte", resolved: 31, avgTime: 8.6, satisfaction: 4.3 },
    { name: "Pedro Logística", resolved: 18, avgTime: 22.1, satisfaction: 4.0 },
    { name: "Marcos Logística", resolved: 15, avgTime: 19.8, satisfaction: 4.1 },
    { name: "Ricardo Montador", resolved: 12, avgTime: 6.4, satisfaction: 4.7 },
  ],
};
