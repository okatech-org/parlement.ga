import React, { useState } from 'react';
import { Users, FileText, Landmark, ArrowRight, Eye, Scale, BookOpen, Shield, Radio, Gavel, UserCheck, ScrollText, Building2, Briefcase } from 'lucide-react';
import { cn } from "@/lib/utils";

const AssemblyOrgChart = () => {
    const [activeTab, setActiveTab] = useState('organigramme');

    return (
        <div className="flex flex-col h-full bg-background p-4 md:p-8 font-sans text-foreground overflow-y-auto transition-colors duration-300">

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Assemblée Nationale du Gabon</h1>
                <p className="text-muted-foreground">Organisation & Chaîne de Collaboration - XIVe Législature (IIIe République)</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('organigramme')}
                    className={cn(
                        "px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2",
                        activeTab === 'organigramme'
                            ? "neu-inset text-primary"
                            : "neu-raised text-muted-foreground hover:text-primary"
                    )}
                >
                    <Users size={18} /> Organigramme & Services
                </button>
                <button
                    onClick={() => setActiveTab('collaboration')}
                    className={cn(
                        "px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2",
                        activeTab === 'collaboration'
                            ? "neu-inset text-blue-600"
                            : "neu-raised text-muted-foreground hover:text-blue-600"
                    )}
                >
                    <FileText size={18} /> Chaîne Législative
                </button>
                <button
                    onClick={() => setActiveTab('citoyen')}
                    className={cn(
                        "px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2",
                        activeTab === 'citoyen'
                            ? "neu-inset text-yellow-600"
                            : "neu-raised text-muted-foreground hover:text-yellow-600"
                    )}
                >
                    <Landmark size={18} /> Espace Citoyen
                </button>
            </div>

            {/* Content Area */}
            <div className="neu-card p-8 min-h-[500px]">

                {/* --- VUE 1: ORGANIGRAMME --- */}
                {activeTab === 'organigramme' && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <h2 className="text-xl font-bold text-foreground mb-6 border-b-2 border-primary pb-2">Architecture Institutionnelle</h2>

                        {/* Niveau 0: Assemblée Plénière (Les Députés) */}
                        <div className="relative mb-12 group w-full max-w-2xl">
                            <div className="neu-raised bg-primary/5 text-foreground p-6 rounded-2xl w-full text-center border-t-4 border-primary relative z-10">
                                <div className="flex justify-center mb-3">
                                    <div className="p-4 rounded-full neu-inset text-primary bg-background">
                                        <Users size={32} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-2xl text-primary">L'Assemblée Plénière</h3>
                                <p className="text-lg font-semibold mt-1">L'ensemble des Députés</p>
                                <p className="text-sm mt-3 text-muted-foreground max-w-lg mx-auto">
                                    Organe suprême et souverain. Elle est composée de tous les députés élus au suffrage universel.
                                    Elle élit le Président et le Bureau, vote la loi, consent l'impôt et contrôle l'action du Gouvernement.
                                </p>
                            </div>
                            <div className="absolute top-full left-1/2 h-8 w-0.5 bg-border -translate-x-1/2"></div>
                        </div>

                        {/* Niveau 1: Président */}
                        <div className="relative mb-8 group">
                            <div className="neu-raised bg-card text-foreground p-6 rounded-2xl w-80 text-center border-l-4 border-yellow-500 relative z-10">
                                <div className="flex justify-center mb-3">
                                    <div className="p-3 rounded-full neu-inset text-yellow-500">
                                        <Gavel size={24} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg">Président de l'Assemblée</h3>
                                <p className="text-sm font-medium mt-1">Michel Régis Onanga Ndiaye</p>
                                <p className="text-xs mt-2 text-muted-foreground italic">Chef de l'administration, Police de l'Assemblée, Représentation Extérieure</p>
                            </div>
                            <div className="absolute top-full left-1/2 h-8 w-0.5 bg-border -translate-x-1/2"></div>
                        </div>

                        {/* Niveau 2: Bureau */}
                        <div className="relative mb-12 w-full max-w-5xl">
                            <div className="absolute top-0 left-1/2 w-full max-w-3xl h-0.5 bg-border -translate-x-1/2 -z-0"></div>
                            <div className="flex justify-between items-start gap-6 flex-wrap md:flex-nowrap">

                                {/* 1er Vice-Président */}
                                <div className="flex-1 min-w-[220px] flex flex-col items-center">
                                    <div className="h-4 w-0.5 bg-border mb-0"></div>
                                    <div className="neu-raised p-4 rounded-xl w-full text-center hover:scale-[1.02] transition-transform">
                                        <h4 className="font-bold text-foreground">1er Vice-Président</h4>
                                        <p className="text-xs font-medium mt-1">François Ndong Obiang</p>
                                        <p className="text-xs mt-2 text-primary">Remplace le Président en cas d'absence</p>
                                    </div>
                                </div>

                                {/* Questeurs */}
                                <div className="flex-1 min-w-[220px] flex flex-col items-center">
                                    <div className="h-4 w-0.5 bg-border mb-0"></div>
                                    <div className="neu-raised p-4 rounded-xl w-full text-center hover:scale-[1.02] transition-transform">
                                        <h4 className="font-bold text-foreground flex items-center justify-center gap-2"><Briefcase size={14} /> Les Questeurs</h4>
                                        <p className="text-xs mt-1 text-muted-foreground font-semibold">Service Administratif & Financier</p>
                                        <ul className="text-xs text-left mt-3 space-y-1 list-disc pl-4 text-muted-foreground">
                                            <li>Gestion du Budget</li>
                                            <li>Gestion du Personnel</li>
                                            <li>Matériel & Logistique</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Secrétaires */}
                                <div className="flex-1 min-w-[220px] flex flex-col items-center">
                                    <div className="h-4 w-0.5 bg-border mb-0"></div>
                                    <div className="neu-raised p-4 rounded-xl w-full text-center hover:scale-[1.02] transition-transform">
                                        <h4 className="font-bold text-foreground flex items-center justify-center gap-2"><ScrollText size={14} /> Les Secrétaires</h4>
                                        <p className="text-xs mt-1 text-muted-foreground font-semibold">Service du Greffe Législatif</p>
                                        <ul className="text-xs text-left mt-3 space-y-1 list-disc pl-4 text-muted-foreground">
                                            <li>Procès-Verbaux (PV)</li>
                                            <li>Contrôle des votes</li>
                                            <li>Archives des séances</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Connecteur vers Commissions */}
                        <div className="w-0.5 h-8 bg-border mb-2"></div>
                        <div className="neu-inset px-6 py-2 rounded-full text-xs font-bold text-muted-foreground mb-2">Conférence des Présidents (Organe de liaison)</div>
                        <div className="w-0.5 h-6 bg-border mb-6"></div>

                        {/* Niveau 3: Les Commissions (Usines à Lois) */}
                        <div className="w-full">
                            <h3 className="text-center font-bold text-lg mb-6 text-foreground">Les Commissions Permanentes (Lieu de fabrication de la loi)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <CommissionCard
                                    icon={<Scale className="text-primary" />}
                                    title="Finances & Budget"
                                    desc="Examen de la Loi de Finances, contrôle du budget de l'État."
                                />
                                <CommissionCard
                                    icon={<BookOpen className="text-primary" />}
                                    title="Lois & Affaires Admin."
                                    desc="Conformité juridique, Droits de l'Homme, Régime électoral."
                                />
                                <CommissionCard
                                    icon={<Shield className="text-primary" />}
                                    title="Affaires Étrangères & Défense"
                                    desc="Traités internationaux, Souveraineté, Coopération."
                                />
                                <CommissionCard
                                    icon={<Building2 className="text-primary" />}
                                    title="Affaires Économiques"
                                    desc="Production, Échanges, Infrastructures."
                                />
                                <CommissionCard
                                    icon={<Users className="text-primary" />}
                                    title="Affaires Sociales & Culturelles"
                                    desc="Éducation, Santé, Communication."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VUE 2: CHAINE DE COLLABORATION --- */}
                {activeTab === 'collaboration' && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-foreground mb-8 border-b-2 border-blue-500 pb-2 text-center">La Chaîne de Fabrication de la Loi (Navette)</h2>

                        <div className="space-y-8 relative max-w-4xl mx-auto">
                            {/* Connecting Line Vertical */}
                            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 md:block hidden"></div>

                            {/* Step 1 */}
                            <div className="flex flex-col md:flex-row items-center gap-6 relative">
                                <div className="hidden md:block w-1/2 text-right pr-10">
                                    <h3 className="font-bold text-lg">1. L'Initiative</h3>
                                    <p className="text-sm text-muted-foreground">Le texte arrive à l'Assemblée.</p>
                                </div>
                                <div className="neu-raised bg-blue-600 text-white p-3 rounded-full z-10">
                                    <div className="font-bold text-lg w-8 h-8 flex items-center justify-center">1</div>
                                </div>
                                <div className="flex-1 neu-raised p-6 rounded-xl w-full md:w-auto">
                                    <div className="md:hidden font-bold mb-2">1. L'Initiative</div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="neu-inset p-3 rounded-lg text-center">
                                            <span className="block font-bold text-blue-600">Projet de Loi</span>
                                            <span className="text-xs text-muted-foreground">Vient du Gouvernement</span>
                                        </div>
                                        <div className="neu-inset p-3 rounded-lg text-center">
                                            <span className="block font-bold text-blue-600">Proposition</span>
                                            <span className="text-xs text-muted-foreground">Vient d'un Député</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col md:flex-row items-center gap-6 relative">
                                <div className="flex-1 neu-raised p-6 rounded-xl w-full md:w-auto md:text-right">
                                    <div className="md:hidden font-bold mb-2">2. Bureau de l'Assemblée</div>
                                    <h4 className="font-bold text-foreground">Le Filtre (Recevabilité)</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Le Bureau vérifie le texte et l'oriente vers la commission compétente.</p>
                                </div>
                                <div className="neu-raised bg-blue-600 text-white p-3 rounded-full z-10">
                                    <div className="font-bold text-lg w-8 h-8 flex items-center justify-center">2</div>
                                </div>
                                <div className="hidden md:block w-1/2 pl-10">
                                    <h3 className="font-bold text-lg">2. Le Bureau</h3>
                                    <p className="text-sm text-muted-foreground">Enregistrement et Orientation</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col md:flex-row items-center gap-6 relative">
                                <div className="hidden md:block w-1/2 text-right pr-10">
                                    <h3 className="font-bold text-lg">3. La Commission</h3>
                                    <p className="text-sm text-muted-foreground">Le cœur du travail technique.</p>
                                </div>
                                <div className="neu-raised bg-yellow-500 text-white p-3 rounded-full z-10 animate-pulse">
                                    <div className="font-bold text-lg w-8 h-8 flex items-center justify-center">3</div>
                                </div>
                                <div className="flex-1 neu-raised border-l-4 border-yellow-500 p-6 rounded-xl w-full md:w-auto">
                                    <div className="md:hidden font-bold mb-2">3. La Commission</div>
                                    <h4 className="font-bold text-yellow-600">Examen & Amendements</h4>
                                    <ul className="text-sm list-disc pl-4 text-muted-foreground mt-2 space-y-1">
                                        <li>Audition des Ministres / Experts</li>
                                        <li>Modification du texte (Amendements)</li>
                                        <li>Rédaction du Rapport final</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col md:flex-row items-center gap-6 relative">
                                <div className="flex-1 neu-raised p-6 rounded-xl w-full md:w-auto md:text-right">
                                    <div className="md:hidden font-bold mb-2">4. La Séance Plénière</div>
                                    <h4 className="font-bold text-foreground">Le Vote Solennel</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Débat général devant les 145 députés, puis vote article par article.</p>
                                </div>
                                <div className="neu-raised bg-blue-600 text-white p-3 rounded-full z-10">
                                    <div className="font-bold text-lg w-8 h-8 flex items-center justify-center">4</div>
                                </div>
                                <div className="hidden md:block w-1/2 pl-10">
                                    <h3 className="font-bold text-lg">4. L'Hémicycle</h3>
                                    <p className="text-sm text-muted-foreground">Adoption ou Rejet</p>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex flex-col md:flex-row items-center gap-6 relative">
                                <div className="hidden md:block w-1/2 text-right pr-10">
                                    <h3 className="font-bold text-lg">5. Transmission</h3>
                                    <p className="text-sm text-muted-foreground">La fin du parcours à l'Assemblée.</p>
                                </div>
                                <div className="neu-raised bg-green-600 text-white p-3 rounded-full z-10">
                                    <div className="font-bold text-lg w-8 h-8 flex items-center justify-center">5</div>
                                </div>
                                <div className="flex-1 neu-raised border-l-4 border-green-500 p-6 rounded-xl w-full md:w-auto">
                                    <div className="md:hidden font-bold mb-2">5. La Suite</div>
                                    <div className="flex gap-4 text-sm mt-2">
                                        <div className="flex-1 neu-inset p-3 rounded-lg text-center">
                                            <span className="block font-bold">Vers le Sénat</span>
                                            <span className="text-xs text-muted-foreground">Pour 2ème lecture</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground"><ArrowRight size={20} /></div>
                                        <div className="flex-1 neu-inset p-3 rounded-lg text-center">
                                            <span className="block font-bold">Promulgation</span>
                                            <span className="text-xs text-muted-foreground">Par le Président</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* --- VUE 3: ESPACE CITOYEN --- */}
                {activeTab === 'citoyen' && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-foreground mb-8 border-b-2 border-yellow-500 pb-2 text-center">Démarches & Services Citoyens</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Carte 1 */}
                            <div className="neu-raised border-l-4 border-blue-500 p-6 rounded-xl hover:scale-[1.01] transition-transform">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="neu-inset p-3 rounded-full text-blue-600"><Eye size={24} /></div>
                                    <h3 className="font-bold text-lg">Assister aux Séances</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Les séances plénières sont publiques. C'est un droit constitutionnel de voir vos élus travailler.
                                </p>
                                <div className="neu-inset p-4 rounded-lg text-xs text-foreground">
                                    <strong>Procédure :</strong> Présentez-vous au Palais Léon Mba (Blvd Triomphal) avec une <u>pièce d'identité valide</u>. Une tenue correcte est exigée.
                                </div>
                            </div>

                            {/* Carte 2 */}
                            <div className="neu-raised border-l-4 border-green-500 p-6 rounded-xl hover:scale-[1.01] transition-transform">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="neu-inset p-3 rounded-full text-green-600"><UserCheck size={24} /></div>
                                    <h3 className="font-bold text-lg">Saisir son Député</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Bien que le mandat soit national, le député représente sa circonscription pour les doléances locales (eau, route, école).
                                </p>
                                <div className="neu-inset p-4 rounded-lg text-xs text-foreground">
                                    <strong>Lieu :</strong> Rendez-vous à la <u>Permanence Parlementaire</u> de votre député (située dans votre quartier/ville) lors des intersessions.
                                </div>
                            </div>

                            {/* Carte 3 */}
                            <div className="neu-raised border-l-4 border-yellow-500 p-6 rounded-xl hover:scale-[1.01] transition-transform">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="neu-inset p-3 rounded-full text-yellow-600"><Radio size={24} /></div>
                                    <h3 className="font-bold text-lg">S'informer à distance</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Suivez les débats budgétaires ou les Questions au Gouvernement sans vous déplacer.
                                </p>
                                <div className="neu-inset p-4 rounded-lg text-xs text-foreground">
                                    <strong>Canaux :</strong> Gabon 1ère, Gabon 24 (TV) ou le site web officiel <em>www.assemblee-nationale.ga</em>.
                                </div>
                            </div>

                            {/* Carte 4 */}
                            <div className="neu-raised border-l-4 border-slate-500 p-6 rounded-xl hover:scale-[1.01] transition-transform">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="neu-inset p-3 rounded-full text-slate-600"><Building2 size={24} /></div>
                                    <h3 className="font-bold text-lg">Administration</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Pour les chercheurs, étudiants ou demandes administratives spécifiques.
                                </p>
                                <div className="neu-inset p-4 rounded-lg text-xs text-foreground">
                                    <strong>Contact :</strong> +241 011 74 90 21 <br />
                                    <strong>Email :</strong> infos@assemblee-nationale.ga
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
            <div className="mt-6 text-center text-xs text-muted-foreground">
                Source : Structure et Fonctionnement - XIVe Législature (2025)
            </div>
        </div>
    );
};

// Helper Component for Commission Cards
const CommissionCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="neu-raised p-5 rounded-xl hover:text-primary transition-colors cursor-default">
        <div className="flex items-start gap-4">
            <div className="mt-1 p-2 rounded-lg neu-inset">{icon}</div>
            <div>
                <h4 className="font-bold text-sm text-foreground">{title}</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-snug">{desc}</p>
            </div>
        </div>
    </div>
);

export default AssemblyOrgChart;
