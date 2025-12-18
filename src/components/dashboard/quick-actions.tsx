"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { FileText, Users, Settings, Download } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Nouvelle Facture",
      description: "Créer une facture professionnelle",
      icon: FileText,
      href: "/invoices/new",
      color: "primary" as const,
    },
    {
      title: "Nouveau Client",
      description: "Ajouter un client à votre carnet",
      icon: Users,
      href: "/clients/new",
      color: "secondary" as const,
    },
    {
      title: "Paramètres",
      description: "Configurer votre profil",
      icon: Settings,
      href: "/settings",
      color: "secondary" as const,
    },
  ];

  return (
    <Card className="glass border border-zinc-800" radius="lg">
      <CardBody className="p-6">
        <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
        <div className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              as={Link}
              href={action.href}
              variant="flat"
              color={action.color}
              radius="lg"
              className="w-full justify-start h-auto py-3"
            >
              <span className="inline-flex items-center gap-3 w-full">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <action.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-zinc-400">{action.description}</p>
                </div>
              </span>
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
