import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";

// Initialisation du Système Nerveux (NeoCortex)
import './neocortex/actors/CommunicationActor';
import './neocortex/actors/LegislativeActor';
import './neocortex/actors/PrefrontalActor';
import './neocortex/actors/SocialActor';
import './neocortex/NeuralLogger';

createRoot(document.getElementById("root")!).render(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <App />
    </ThemeProvider>
);
