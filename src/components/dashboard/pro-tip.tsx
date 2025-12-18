"use client";

import { TrendingUp } from "lucide-react";

export function ProTip() {
  return (
    <div className="glass border border-primary-500/20 rounded-xl p-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary-500/20">
          <TrendingUp className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Astuce Pro</h4>
          <p className="text-sm text-zinc-400">
            Configurez vos informations dans les paramètres pour pré-remplir
            automatiquement vos factures.
          </p>
        </div>
      </div>
    </div>
  );
}
