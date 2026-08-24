type AvatarUserProps = {
  name: string;
  subtitle?: string | null;
  avatarUrl?: string | null;
};

export function AvatarUser({ name, subtitle, avatarUrl }: AvatarUserProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="size-full object-cover" />
        ) : (
          <span className="text-xs font-semibold text-primary">{initials}</span>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">{name}</span>
        {subtitle && (
          <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
