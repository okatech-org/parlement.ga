import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  avatarInitial?: string;
  avatarUrl?: string;
}

export const DashboardHeader = ({
  title,
  subtitle,
  avatarInitial = "P",
  avatarUrl,
}: DashboardHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-14 w-14 border-2 border-primary/20">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
          {avatarInitial}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};
