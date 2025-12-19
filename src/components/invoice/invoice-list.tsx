"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Plus, FileText, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  formatCurrency,
  formatDate,
  getStatusLabel,
} from "@/lib/utils";
import type { Invoice, Client } from "@/types/invoice";

interface InvoiceListProps {
  invoices: (Invoice & { client: Client | null })[];
}

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SENT: "default",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export function InvoiceList({ invoices }: InvoiceListProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteInvoice = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/invoices/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Facture supprimée avec succès");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <Card className="glass border border-zinc-800 rounded-lg">
      <CardContent className="p-0">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg mb-2">Aucune facture</p>
            <p className="text-sm mb-4">
              Créez votre première facture pour commencer
            </p>
            <Button asChild className="rounded-full">
              <Link href="/invoices/new">
                <Plus className="w-4 h-4" />
                Créer une facture
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="hover:bg-zinc-800/50 cursor-pointer"
                  onClick={() => router.push(`/invoices/${invoice.id}`)}
                >
                  <TableCell>
                    <span className="text-primary-400 font-medium">
                      {invoice.number}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {invoice.client?.name || "—"}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {invoice.client?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(invoice.issueDate)}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(invoice.dueDate)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[invoice.status] || "secondary"}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button asChild variant="secondary" size="icon">
                        <Link href={`/api/pdf/${invoice.id}`}>
                          <Download className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(invoice)}
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
              <AlertDialogTitle>Supprimer la facture {deleteTarget?.number} ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. La facture sera définitivement supprimée
                ainsi que toutes les lignes associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteInvoice}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
