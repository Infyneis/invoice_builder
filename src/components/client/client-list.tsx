"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Plus, Users, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import type { Client } from "@/types/invoice";

interface ClientListProps {
  clients: Client[];
}

export function ClientList({ clients }: ClientListProps) {
  return (
    <Card className="glass border border-zinc-800 rounded-lg">
      <CardContent className="p-0">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Users className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg mb-2">Aucun client</p>
            <p className="text-sm mb-4">
              Ajoutez votre premier client pour créer des factures
            </p>
            <Button asChild className="rounded-full">
              <Link href="/clients/new">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un client
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Entreprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-zinc-800/50">
                  <TableCell>
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-primary-400 hover:underline font-medium"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {client.city}, {client.country}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.companyName || (
                      <span className="text-zinc-500">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
