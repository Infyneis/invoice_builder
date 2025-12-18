"use client";

import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
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
    <HeroNavbar
      maxWidth="xl"
      className="glass border-b border-primary-500/10"
      position="sticky"
    >
      <NavbarBrand>
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary-500/20">
            <FileText className="w-5 h-5 text-primary-400" />
          </div>
          <span className="font-bold text-xl gradient-text">Invoice Builder</span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
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
        </NavbarItem>
        <NavbarItem>
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
        </NavbarItem>
        <NavbarItem>
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
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Dropdown>
            <DropdownTrigger>
              <Button
                color="primary"
                variant="shadow"
                radius="full"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouveau
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Create new">
              <DropdownItem
                key="invoice"
                startContent={<FileText className="w-4 h-4" />}
                href="/invoices/new"
              >
                Nouvelle Facture
              </DropdownItem>
              <DropdownItem
                key="client"
                startContent={<Users className="w-4 h-4" />}
                href="/clients/new"
              >
                Nouveau Client
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Button
            as={Link}
            href="/settings"
            variant="flat"
            isIconOnly
            radius="lg"
            className="text-zinc-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </NavbarItem>

        {/* Mobile menu */}
        <NavbarItem className="sm:hidden">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" isIconOnly radius="lg">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Navigation">
              <DropdownItem key="dashboard" href="/">
                Dashboard
              </DropdownItem>
              <DropdownItem key="invoices" href="/invoices">
                Factures
              </DropdownItem>
              <DropdownItem key="clients" href="/clients">
                Clients
              </DropdownItem>
              <DropdownItem key="new-invoice" href="/invoices/new">
                Nouvelle Facture
              </DropdownItem>
              <DropdownItem key="settings" href="/settings">
                Paramètres
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
