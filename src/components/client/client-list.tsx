"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Plus, Users, Mail, Phone, MapPin, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Client } from "@/types/invoice";

interface ClientWithInvoiceCount extends Client {
  _count?: { invoices: number };
}

interface ClientListProps {
  clients: ClientWithInvoiceCount[];
}

export function ClientList({ clients }: ClientListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (client: ClientWithInvoiceCount) => {
    const invoiceCount = client._count?.invoices || 0;
    if (invoiceCount > 0) {
      alert(`Impossible de supprimer ce client car il a ${invoiceCount} facture(s).`);
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${client.name} ?`)) {
      return;
    }

    setDeletingId(client.id);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

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
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/clients/${client.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client)}
                        disabled={deletingId === client.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
