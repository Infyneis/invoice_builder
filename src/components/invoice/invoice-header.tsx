"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function InvoiceHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Factures</h1>
        <p className="text-zinc-400">Gérez et suivez toutes vos factures</p>
      </div>
      <Button asChild className="rounded-full">
        <Link href="/invoices/new">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Facture
        </Link>
      </Button>
    </div>
  );
}
