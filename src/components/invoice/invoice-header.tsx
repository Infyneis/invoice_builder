"use client";

import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import Link from "next/link";

export function InvoiceHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Factures</h1>
        <p className="text-zinc-400">Gérez et suivez toutes vos factures</p>
      </div>
      <Button
        as={Link}
        href="/invoices/new"
        color="primary"
        variant="shadow"
        radius="full"
      >
        <span className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle Facture
        </span>
      </Button>
    </div>
  );
}
