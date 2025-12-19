"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function ClientHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Clients</h1>
        <p className="text-zinc-400">Gérez votre carnet de clients</p>
      </div>
      <Button asChild className="rounded-full">
        <Link href="/clients/new">
          <Plus className="w-4 h-4" />
          Nouveau Client
        </Link>
      </Button>
    </div>
  );
}
