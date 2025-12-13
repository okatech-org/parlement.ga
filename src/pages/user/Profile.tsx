import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";

const Profile = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Mon Profil
                </h1>
                <p className="text-muted-foreground mt-1">
                    Gérez vos informations personnelles et vos préférences.
                </p>
            </div>

            <div className="neu-raised p-8 rounded-2xl space-y-8">
                <div className="flex flex-col items-center sm:flex-row gap-6">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-elegant">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">U</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-lg hover:scale-110 transition-transform">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                        <h2 className="text-xl font-bold">Utilisateur Démo</h2>
                        <p className="text-sm text-muted-foreground">user@presidence.ga</p>
                        <p className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full inline-block mt-2">
                            Compte Vérifié
                        </p>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Nom complet</Label>
                        <Input
                            id="fullName"
                            defaultValue="Utilisateur Démo"
                            className="neu-inset border-none focus-visible:ring-primary/20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            defaultValue="user@presidence.ga"
                            disabled
                            className="neu-inset border-none opacity-70"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="bio">Biographie</Label>
                        <Textarea
                            id="bio"
                            placeholder="Parlez-nous de vous..."
                            className="neu-inset border-none min-h-[120px] focus-visible:ring-primary/20 resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button className="neu-raised bg-primary text-primary-foreground hover:bg-primary/90 border-none px-8">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
