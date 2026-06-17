import { Logo } from "@/components/ui";
import { UserMenu } from "@/components/app/UserMenu";
import type { AppUser } from "@/lib/auth";

/** Header ligero (logo + usuario) para páginas sin proyecto activo. */
export function AppHeader({ user }: { user: AppUser }) {
  return (
    <header className="sticky top-0 z-40 flex h-12 items-center border-b border-line bg-surface px-4">
      <Logo size={24} />
      <div className="ml-auto">
        <UserMenu user={user} />
      </div>
    </header>
  );
}
