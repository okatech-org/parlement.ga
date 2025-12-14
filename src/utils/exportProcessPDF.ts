import jsPDF from 'jspdf';

interface PhaseStep {
    phase: string;
    title: string;
    duration: string;
    description: string;
    details: string[];
}

interface ExportOptions {
    title: string;
    subtitle: string;
    institution: 'AN' | 'SN';
    phases: PhaseStep[];
    specificities?: { title: string; description: string; examples: string[] }[];
    cmpProcess?: { step: number; title: string; description: string }[];
}

export const exportProcessPDF = async (options: ExportOptions) => {
    const { title, subtitle, institution, phases, specificities, cmpProcess } = options;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Colors based on institution
    const primaryColor = institution === 'AN' ? [16, 185, 129] : [59, 130, 246]; // emerald-500 vs blue-500

    // Header
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageWidth / 2, 18, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(subtitle, pageWidth / 2, 28, { align: 'center' });

    y = 55;

    // Introduction
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    const introText = institution === 'AN' 
        ? "Ce document présente le processus législatif complet de l'Assemblée Nationale du Gabon."
        : "Ce document présente le processus législatif complet du Sénat de la République Gabonaise.";
    pdf.text(introText, margin, y);
    y += 15;

    // Phases
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text('Les Phases du Processus Législatif', margin, y);
    y += 10;

    phases.forEach((phase, index) => {
        // Check if we need a new page
        if (y > 250) {
            pdf.addPage();
            y = 20;
        }

        // Phase header
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.roundedRect(margin, y, pageWidth - margin * 2, 8, 2, 2, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${phase.phase}: ${phase.title} (${phase.duration})`, margin + 3, y + 5.5);
        y += 12;

        // Phase description
        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const descLines = pdf.splitTextToSize(phase.description, pageWidth - margin * 2);
        pdf.text(descLines, margin, y);
        y += descLines.length * 5 + 3;

        // Details
        phase.details.forEach((detail) => {
            if (y > 280) {
                pdf.addPage();
                y = 20;
            }
            pdf.setFontSize(9);
            pdf.text(`• ${detail}`, margin + 5, y);
            y += 5;
        });

        y += 8;
    });

    // Specificities section
    if (specificities && specificities.length > 0) {
        if (y > 200) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text('Spécificités', margin, y);
        y += 10;

        specificities.forEach((spec) => {
            if (y > 260) {
                pdf.addPage();
                y = 20;
            }

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(spec.title, margin, y);
            y += 6;

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(60, 60, 60);
            const specDescLines = pdf.splitTextToSize(spec.description, pageWidth - margin * 2);
            pdf.text(specDescLines, margin, y);
            y += specDescLines.length * 5 + 3;

            pdf.setFontSize(9);
            pdf.text(`Exemples: ${spec.examples.join(', ')}`, margin + 5, y);
            y += 10;
        });
    }

    // CMP section
    if (cmpProcess && cmpProcess.length > 0) {
        if (y > 200) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(245, 158, 11); // amber-500
        pdf.text('Commission Mixte Paritaire (CMP)', margin, y);
        y += 10;

        cmpProcess.forEach((step) => {
            if (y > 270) {
                pdf.addPage();
                y = 20;
            }

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(`${step.step}. ${step.title}`, margin, y);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(60, 60, 60);
            pdf.text(` - ${step.description}`, margin + 30, y);
            y += 7;
        });
    }

    // Footer
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
            `Page ${i} / ${totalPages} - ${institution === 'AN' ? 'Assemblée Nationale' : 'Sénat'} du Gabon - ${new Date().toLocaleDateString('fr-FR')}`,
            pageWidth / 2,
            pdf.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save
    pdf.save(`processus-legislatif-${institution.toLowerCase()}.pdf`);
};

export default exportProcessPDF;