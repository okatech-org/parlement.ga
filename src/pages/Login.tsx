import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Phone,
    Lock,
    Fingerprint,
    Scan,
    Home,
    ArrowRight,
    Shield,
    AlertCircle,
    Sun,
    Moon,
    Loader2,
    Building2,
    Landmark,
    Scale,
    Settings
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();

    const [mode, setMode] = useState<"login" | "register">("login");
    const [step, setStep] = useState<"phone" | "pin" | "biometric" | "account-type">("account-type");

    // Initialize userType based on route: Specific environments prioritize Official (Members), Generic route prioritizes Citizen
    const [userType, setUserType] = useState<"citizen" | "official">(() => {
        const path = location.pathname;
        if (path.includes('/an') || path.includes('/senat') || path.includes('/congres') || path.includes('/parlement')) {
            return 'official';
        }
        return 'citizen';
    });
    const [accountType, setAccountType] = useState<"citoyen" | "parlement" | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [isNewUser, setIsNewUser] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [biometricAvailable, setBiometricAvailable] = useState(true);

    const PHONE_LENGTH = 9;
    const PIN_LENGTH = 7;

    useEffect(() => {
        const checkBiometric = async () => {
            if (window.PublicKeyCredential) {
                try {
                    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                    setBiometricAvailable(available);
                } catch (e) {
                    console.error("Biometric check failed:", e);
                    setBiometricAvailable(false);
                }
            } else {
                setBiometricAvailable(false);
            }
        };
        checkBiometric();
    }, []);

    // Initial step adjustment based on mode
    useEffect(() => {
        if (mode === "login") {
            setStep("phone");
        } else {
            setStep("account-type");
        }
    }, [mode]);

    // Environment Detection
    const getEnvironmentConfig = () => {
        // If Citizen tab is active, use Unified Republic Styling
        if (userType === 'citizen') {
            return { name: "République Gabonaise", color: "text-[#04CDB9]", bg: "from-[#04CDB9]", icon: Shield };
        }

        const path = location.pathname;
        if (path.includes('/an')) return { name: "Assemblée Nationale", color: "text-[#3A87FD]", bg: "from-[#3A87FD]", icon: Building2 };
        if (path.includes('/senat')) return { name: "Sénat", color: "text-[#D19C00]", bg: "from-[#D19C00]", icon: Landmark };
        if (path.includes('/congres') || path.includes('/parlement')) return { name: "Parlement", color: "text-[#77BA41]", bg: "from-[#77BA41]", icon: Scale };
        return { name: "République Gabonaise", color: "text-[#04CDB9]", bg: "from-[#04CDB9]", icon: Shield };
    };

    const envConfig = getEnvironmentConfig();
    const EnvIcon = envConfig.icon;

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (phoneNumber.length < PHONE_LENGTH) {
            const msg = `${t('login.invalidPhone')} (${PHONE_LENGTH} ${t('common.required')})`;
            setError(msg);
            toast.error(msg);
            return;
        }

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (mode === "register") {
                setIsNewUser(true);
                setStep("pin");
                toast.success(t('common.success'));
            } else {
                const userExists = sessionStorage.getItem(`user_${phoneNumber}`);

                if (userExists) {
                    setIsNewUser(false);
                    setStep("pin");
                    toast.success(t('login.welcomeBack'));
                } else {
                    const msg = t('login.noAccount');
                    setError(msg);
                    toast.error(msg);
                }
            }
        } catch (err) {
            console.error("Phone submit error:", err);
            setError(t('common.error'));
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handlePinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const pinRegex = /^[0-9]{6}[A-Za-z]$/;
        if (!pinRegex.test(pinCode)) {
            const msg = `${t('login.invalidPin')} (Format: 123456A)`;
            setError(msg);
            toast.error(msg);
            return;
        }

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (isNewUser) {
                // If creating new user, respect the tab selection for account type hint if not explicitly set
                const type = accountType || (userType === 'official' ? 'parlement' : 'citoyen');

                sessionStorage.setItem(`pin_${phoneNumber}`, pinCode);
                sessionStorage.setItem(`user_${phoneNumber}`, "true");
                sessionStorage.setItem(`account_type_${phoneNumber}`, type);
                toast.success(t('common.success'));

                if (biometricAvailable) {
                    setStep("biometric");
                } else {
                    handleSuccessfulLogin();
                }
            } else {
                const savedPin = sessionStorage.getItem(`pin_${phoneNumber}`);
                if (savedPin !== pinCode) {
                    const msg = t('login.invalidPin');
                    setError(msg);
                    toast.error(msg);
                    setLoading(false);
                    return;
                }

                if (biometricAvailable) {
                    setStep("biometric");
                } else {
                    handleSuccessfulLogin();
                }
            }
        } catch (err) {
            console.error("PIN submit error:", err);
            setError(t('common.error'));
            toast.error(t('common.error'));
            setLoading(false);
        }
    };

    const handleBiometricAuth = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success(t('common.success'));
            handleSuccessfulLogin();
        } catch (err) {
            setError(t('common.error'));
            setLoading(false);
        }
    };

    const { login } = useUser();

    const handleSuccessfulLogin = () => {
        // Persist the origin environment for logout redirection
        let origin = '/parlement';
        if (location.pathname.includes('/an')) origin = '/an';
        else if (location.pathname.includes('/senat')) origin = '/senat';
        else if (location.pathname.includes('/congres') || location.pathname.includes('/parlement')) origin = '/parlement';

        sessionStorage.setItem('auth_origin', origin);

        // Here we could enforce checking if the user actually has the role corresponding to the tab
        // For now, we just login
        login(phoneNumber, accountType || (userType === 'official' ? 'parlement' : 'citoyen'));
    };

    const getHomePath = () => {
        const path = location.pathname;
        if (path.includes('/an')) return '/an';
        if (path.includes('/senat')) return '/senat';
        if (path.includes('/parlement')) return '/parlement';
        return '/';
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col relative overflow-hidden" dir={dir}>
            {/* Background Pattern */}
            <div className={`absolute inset-0 bg-gradient-to-br ${envConfig.bg}/10 via-background to-background z-0`} />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(getHomePath())}
                    className="hover:bg-background/50 backdrop-blur-sm"
                >
                    <Home className="w-4 h-4 mr-2" />
                    {t('common.backToHome')}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="rounded-full hover:bg-background/50 backdrop-blur-sm"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{t('common.changeTheme')}</span>
                </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">

                {/* Environment Branding */}
                <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className={`w-16 h-16 rounded-2xl ${envConfig.color.replace('text-', 'bg-')}/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-border/50`}>
                        <EnvIcon className={`w-8 h-8 ${envConfig.color}`} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-foreground">{envConfig.name}</h1>
                    <p className="text-muted-foreground">Portail d'Authentification</p>
                </div>

                <Card className="w-full max-w-md p-0 shadow-2xl border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">

                    {/* User Type Tabs */}
                    <Tabs value={userType} onValueChange={(v: any) => setUserType(v)} className="w-full">
                        <TabsList className="w-full grid grid-cols-2 rounded-none p-0 h-14 bg-muted/50">
                            <TabsTrigger
                                value="citizen"
                                className="h-full rounded-none data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all rounded-tl-lg"
                            >
                                <span className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Citoyen
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="official"
                                className="h-full rounded-none data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all rounded-tr-lg"
                            >
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Institution
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-8">
                            {/* Mode Switcher */}
                            <div className="flex justify-center mb-8">
                                <div className="bg-muted p-1 rounded-full flex">
                                    <button
                                        onClick={() => setMode("login")}
                                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "login"
                                            ? "bg-background shadow-sm text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {t('login.login')}
                                    </button>
                                    <button
                                        onClick={() => setMode("register")}
                                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "register"
                                            ? "bg-background shadow-sm text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {t('login.createAccount')}
                                    </button>
                                </div>
                            </div>

                            {/* Forms */}
                            {/* Step Indicator */}
                            <div className="flex justify-center mb-8 gap-2">
                                {mode === "register" && (
                                    <div className={`w-2 h-2 rounded-full transition-all ${step === "account-type" ? "bg-primary w-8" : "bg-muted"}`}></div>
                                )}
                                <div className={`w-2 h-2 rounded-full transition-all ${step === "phone" ? "bg-primary w-8" : "bg-muted"}`}></div>
                                <div className={`w-2 h-2 rounded-full transition-all ${step === "pin" ? "bg-primary w-8" : "bg-muted"}`}></div>
                                {biometricAvailable && (
                                    <div className={`w-2 h-2 rounded-full transition-all ${step === "biometric" ? "bg-primary w-8" : "bg-muted"}`}></div>
                                )}
                            </div>

                            {/* Account Type Selection (Only for Register) */}
                            {mode === "register" && step === "account-type" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="text-center mb-6">
                                        <h2 className="text-xl font-bold mb-2">{t('common.create')} ({userType === 'official' ? 'Institution' : 'Citoyen'})</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {t('login.subtitle')}
                                        </p>
                                    </div>

                                    <div className="grid gap-4">
                                        {userType === 'citizen' ? (
                                            <button
                                                onClick={() => {
                                                    setAccountType("citoyen");
                                                    setStep("phone");
                                                }}
                                                className="group p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left w-full"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 rounded-xl bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors">
                                                        <Shield className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg mb-1">{t('hub.roles.citizen.title')}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {t('hub.roles.citizen.desc')}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setAccountType("parlement");
                                                    setStep("phone");
                                                }}
                                                className="group p-6 border-2 border-border rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all text-left w-full"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 rounded-xl bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors">
                                                        <Shield className="w-6 h-6 text-purple-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg mb-1">{t('hub.roles.deputy.title')}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {t('hub.roles.deputy.desc')}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Phone Step */}
                            {step === "phone" && (
                                <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex p-4 rounded-full bg-primary/10 neu-inset mb-4">
                                            <Phone className="w-8 h-8 text-primary" />
                                        </div>
                                        <h2 className="text-xl font-bold mb-2">{t('login.phoneLabel')}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {userType === 'official' ? 'Compte Institutionnel' : 'Compte Citoyen'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('login.phoneLabel')}</label>
                                        <div className="flex gap-2">
                                            <div className="flex items-center px-3 border border-border rounded-md bg-muted/30">
                                                <span className="text-sm font-medium">+241</span>
                                            </div>
                                            <Input
                                                type="tel"
                                                placeholder="XX XX XX XX"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                                className="flex-1 text-center text-lg tracking-wider"
                                                maxLength={9}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full shadow-lg" size="lg" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                {t('common.loading')}
                                            </>
                                        ) : (
                                            <>
                                                {t('common.continue')}
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    {mode === "register" && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full"
                                            onClick={() => setStep("account-type")}
                                            disabled={loading}
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                    )}
                                </form>
                            )}

                            {/* PIN Step */}
                            {step === "pin" && (
                                <form onSubmit={handlePinSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex p-4 rounded-full bg-secondary/10 neu-inset mb-4">
                                            <Lock className="w-8 h-8 text-secondary" />
                                        </div>
                                        <h2 className="text-xl font-bold mb-2">
                                            {isNewUser ? t('common.create') : t('login.enterPin')}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            6 chiffres + 1 lettre (ex: 123456A)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('login.pinLabel')}</label>
                                        <Input
                                            type="text"
                                            placeholder="• • • • • • A"
                                            value={pinCode}
                                            onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                                            className="text-center text-2xl tracking-widest font-mono"
                                            maxLength={7}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full shadow-lg" size="lg" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                {t('common.loading')}
                                            </>
                                        ) : (
                                            <>
                                                {isNewUser ? t('common.create') : t('login.login')}
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => setStep("phone")}
                                        disabled={loading}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                </form>
                            )}

                            {/* Biometric Step */}
                            {step === "biometric" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex p-4 rounded-full bg-green-600/10 neu-inset mb-4">
                                            <Scan className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h2 className="text-xl font-bold mb-2">{t('login.biometric')}</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-32 flex-col gap-3 border-2 hover:border-primary hover:bg-primary/5"
                                            onClick={handleBiometricAuth}
                                            disabled={loading}
                                        >
                                            <Fingerprint className="w-12 h-12 text-primary" />
                                            <span className="text-sm font-semibold">Touch ID</span>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="h-32 flex-col gap-3 border-2 hover:border-secondary hover:bg-secondary/5"
                                            onClick={handleBiometricAuth}
                                            disabled={loading}
                                        >
                                            <Scan className="w-12 h-12 text-secondary" />
                                            <span className="text-sm font-semibold">Face ID</span>
                                        </Button>
                                    </div>

                                    {loading && (
                                        <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg animate-in fade-in">
                                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                            <span className="text-sm font-medium">{t('common.loading')}</span>
                                        </div>
                                    )}

                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={handleSuccessfulLogin}
                                        disabled={loading}
                                    >
                                        {t('login.continueWithoutBio')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Tabs>

                    {/* Security Info */}
                    <div className="p-4 bg-muted/30 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                            <Shield className="w-3 h-3" />
                            <span>{t('home.security.encryption')}</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Footer Admin Shortcut - Absolute Bottom */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-muted-foreground/80 hover:text-foreground transition-colors flex items-center gap-1.5 mx-auto"
                    onClick={() => navigate("/admin")}
                >
                    <Settings className="h-3 w-3" />
                    Accès Administration Système
                </Button>
            </div>
        </div>
    );
}

