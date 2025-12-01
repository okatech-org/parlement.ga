import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IAstedButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  variant?: "desktop" | "mobile";
}

export const IAstedButton = ({
  isOpen,
  onToggle,
  variant = "desktop",
}: IAstedButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleActivate = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "iAsted désactivé" : "iAsted activé",
      description: isListening
        ? "L'assistant vocal est maintenant en pause"
        : "L'assistant vocal est à votre écoute",
    });
  };

  if (variant === "mobile") {
    return (
      <>
        <Button
          size="lg"
          className={`h-14 w-14 rounded-full shadow-elegant ${
            isListening
              ? "bg-primary animate-pulse"
              : "bg-gradient-primary hover:shadow-glow"
          }`}
          onClick={handleActivate}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        <Dialog open={isOpen} onOpenChange={onToggle}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assistant iAsted</DialogTitle>
              <DialogDescription>
                L'assistant vocal intelligent pour vous accompagner dans vos démarches parlementaires.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Version de démonstration - Fonctionnalités complètes à venir
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        size="lg"
        className={`h-16 w-16 rounded-full shadow-elegant ${
          isListening
            ? "bg-primary animate-pulse"
            : "bg-gradient-primary hover:shadow-glow"
        }`}
        onClick={handleActivate}
      >
        {isListening ? (
          <MicOff className="h-7 w-7" />
        ) : (
          <Mic className="h-7 w-7" />
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={onToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assistant iAsted</DialogTitle>
            <DialogDescription>
              L'assistant vocal intelligent pour vous accompagner dans vos démarches parlementaires.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Version de démonstration - Fonctionnalités complètes à venir
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
