"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Plus, Users, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-primary-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary-500/20">
              <FileText className="w-5 h-5 text-primary-400" />
            </div>
            <span className="font-bold text-xl gradient-text">Invoice Builder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className={cn(
                "px-4 py-2 rounded-lg transition-all",
                isActive("/") && pathname === "/"
                  ? "bg-primary-500/20 text-primary-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/invoices"
              className={cn(
                "px-4 py-2 rounded-lg transition-all",
                isActive("/invoices")
                  ? "bg-primary-500/20 text-primary-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              Factures
            </Link>
            <Link
              href="/clients"
              className={cn(
                "px-4 py-2 rounded-lg transition-all",
                isActive("/clients")
                  ? "bg-primary-500/20 text-primary-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              Clients
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/invoices/new" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Nouvelle Facture
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/clients/new" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Nouveau Client
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild variant="ghost" size="icon">
              <Link href="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/invoices">Factures</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/clients">Clients</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/invoices/new">Nouvelle Facture</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Paramètres</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
