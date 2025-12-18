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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Users, Mail, Phone, MapPin, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Client } from "@/types/invoice";

interface ClientWithInvoiceCount extends Client {
  _count?: { invoices: number };
}

interface ClientListProps {
  clients: ClientWithInvoiceCount[];
}

export function ClientList({ clients }: ClientListProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<ClientWithInvoiceCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteClient = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/clients/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Client supprimé avec succès");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getInvoiceCount = (client: ClientWithInvoiceCount) => client._count?.invoices || 0;

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
                <TableRow
                  key={client.id}
                  className="hover:bg-zinc-800/50 cursor-pointer"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  <TableCell>
                    <span className="text-primary-400 font-medium">
                      {client.name}
                    </span>
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
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(client);
                        }}
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

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <AlertDialogTitle className="text-red-400">
                  {deleteTarget && getInvoiceCount(deleteTarget) > 0
                    ? `Impossible de supprimer ${deleteTarget?.name}`
                    : `Supprimer ${deleteTarget?.name} ?`}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="pt-2">
                {deleteTarget && getInvoiceCount(deleteTarget) > 0 ? (
                  <>
                    Ce client possède <strong className="text-red-400">{getInvoiceCount(deleteTarget)} facture(s)</strong> associée(s).
                    Vous devez d&apos;abord supprimer toutes les factures liées à ce client avant de pouvoir le supprimer.
                  </>
                ) : (
                  "Cette action est irréversible. Le client sera définitivement supprimé."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {deleteTarget && getInvoiceCount(deleteTarget) > 0 ? "Fermer" : "Annuler"}
              </AlertDialogCancel>
              {deleteTarget && getInvoiceCount(deleteTarget) === 0 && (
                <AlertDialogAction
                  onClick={deleteClient}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
