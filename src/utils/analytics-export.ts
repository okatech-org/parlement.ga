// Analytics Export Utilities - PDF and CSV generation

interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  documentsGenerated: number;
  activeUsers: number;
  avgSessionDuration: number;
  conversationsToday: number;
  conversationsThisWeek: number;
  conversationsThisMonth: number;
}

interface ChartData {
  name: string;
  conversations: number;
  messages: number;
  documents: number;
}

export const exportToCSV = (analytics: AnalyticsData, weeklyData: ChartData[]): void => {
  const now = new Date();
  const filename = `iasted-analytics-${now.toISOString().split('T')[0]}.csv`;

  // KPI Summary
  let csvContent = "=== RAPPORT ANALYTIQUE iAsted ===\n";
  csvContent += `Date de génération,${now.toLocaleDateString('fr-FR')}\n\n`;
  
  csvContent += "=== INDICATEURS CLÉS ===\n";
  csvContent += "Métrique,Valeur\n";
  csvContent += `Conversations totales,${analytics.totalConversations}\n`;
  csvContent += `Messages échangés,${analytics.totalMessages}\n`;
  csvContent += `Documents générés,${analytics.documentsGenerated}\n`;
  csvContent += `Utilisateurs actifs,${analytics.activeUsers}\n`;
  csvContent += `Durée moyenne de session (min),${analytics.avgSessionDuration}\n\n`;

  csvContent += "=== ACTIVITÉ RÉCENTE ===\n";
  csvContent += "Période,Conversations\n";
  csvContent += `Aujourd'hui,${analytics.conversationsToday}\n`;
  csvContent += `Cette semaine,${analytics.conversationsThisWeek}\n`;
  csvContent += `Ce mois,${analytics.conversationsThisMonth}\n\n`;

  csvContent += "=== DONNÉES HEBDOMADAIRES ===\n";
  csvContent += "Jour,Conversations,Messages,Documents\n";
  weeklyData.forEach(day => {
    csvContent += `${day.name},${day.conversations},${day.messages},${day.documents}\n`;
  });

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToPDF = async (analytics: AnalyticsData, weeklyData: ChartData[]): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const now = new Date();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // Primary blue
  doc.text('Rapport Analytique iAsted', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`, 20, 35);
  
  // Line separator
  doc.setDrawColor(200);
  doc.line(20, 40, 190, 40);
  
  // KPI Section
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Indicateurs Clés de Performance', 20, 55);
  
  doc.setFontSize(11);
  const kpis = [
    ['Conversations totales', analytics.totalConversations.toString()],
    ['Messages échangés', analytics.totalMessages.toString()],
    ['Documents générés', analytics.documentsGenerated.toString()],
    ['Utilisateurs actifs', analytics.activeUsers.toString()],
    ['Durée moyenne de session', `${analytics.avgSessionDuration} min`],
  ];
  
  let yPos = 65;
  kpis.forEach(([label, value]) => {
    doc.setTextColor(80);
    doc.text(label, 25, yPos);
    doc.setTextColor(59, 130, 246);
    doc.text(value, 120, yPos);
    yPos += 8;
  });
  
  // Activity Section
  yPos += 10;
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Activité Récente', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  const activities = [
    ["Aujourd'hui", analytics.conversationsToday.toString()],
    ['Cette semaine', analytics.conversationsThisWeek.toString()],
    ['Ce mois', analytics.conversationsThisMonth.toString()],
  ];
  
  activities.forEach(([label, value]) => {
    doc.setTextColor(80);
    doc.text(label, 25, yPos);
    doc.setTextColor(34, 197, 94); // Green
    doc.text(`${value} conversations`, 120, yPos);
    yPos += 8;
  });
  
  // Weekly Data Table
  yPos += 15;
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Données Hebdomadaires', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Jour', 25, yPos);
  doc.text('Conv.', 60, yPos);
  doc.text('Msg.', 90, yPos);
  doc.text('Docs.', 120, yPos);
  
  yPos += 2;
  doc.line(20, yPos, 150, yPos);
  yPos += 6;
  
  doc.setTextColor(60);
  weeklyData.forEach(day => {
    doc.text(day.name, 25, yPos);
    doc.text(day.conversations.toString(), 60, yPos);
    doc.text(day.messages.toString(), 90, yPos);
    doc.text(day.documents.toString(), 120, yPos);
    yPos += 7;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('© iAsted - Assemblée Nationale du Gabon', 20, 280);
  doc.text(`Page 1/1`, 180, 280);
  
  // Download
  const filename = `iasted-rapport-${now.toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
