"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Settings } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Nouvelle Facture",
      description: "Créer une facture professionnelle",
      icon: FileText,
      href: "/invoices/new",
    },
    {
      title: "Nouveau Client",
      description: "Ajouter un client à votre carnet",
      icon: Users,
      href: "/clients/new",
    },
    {
      title: "Paramètres",
      description: "Configurer votre profil",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <Card className="glass border border-zinc-800 rounded-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
        <div className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant="secondary"
              className="w-full justify-start h-auto py-3"
            >
              <Link href={action.href}>
                <div className="p-2 rounded-lg bg-primary-500/10 mr-3">
                  <action.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-zinc-400">{action.description}</p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
