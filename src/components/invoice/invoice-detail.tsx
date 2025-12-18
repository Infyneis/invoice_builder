"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  Calendar,
  User,
  FileText,
  MoreHorizontal,
  XCircle,
  Clock,
  FileEdit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  formatCurrency,
  formatDate,
  getStatusLabel,
} from "@/lib/utils";
import type { Invoice, Client, InvoiceItem, InvoiceStatus } from "@/types/invoice";

interface InvoiceDetailProps {
  invoice: Invoice & { client: Client | null; items: InvoiceItem[] };
}

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SENT: "default",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateStatus = async (newStatus: InvoiceStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Facture marquée comme "${getStatusLabel(newStatus)}"`);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Failed to update invoice:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteInvoice = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Facture supprimée avec succès");
        router.push("/invoices");
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/invoices">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux factures
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold gradient-text">
              {invoice.number}
            </h1>
            <Badge variant={statusVariantMap[invoice.status] || "secondary"} className="text-sm">
              {getStatusLabel(invoice.status)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`/api/pdf/${invoice.id}`}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Link>
          </Button>
          {invoice.status === "DRAFT" && (
            <Button
              onClick={() => updateStatus("SENT")}
              disabled={isUpdating}
            >
              <Send className="w-4 h-4 mr-2" />
              {isUpdating ? "..." : "Marquer envoyée"}
            </Button>
          )}
          {invoice.status === "SENT" && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => updateStatus("PAID")}
              disabled={isUpdating}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isUpdating ? "..." : "Marquer payée"}
            </Button>
          )}
          {invoice.status === "SENT" && (
            <Button
              variant="destructive"
              onClick={() => updateStatus("OVERDUE")}
              disabled={isUpdating}
            >
              <Clock className="w-4 h-4 mr-2" />
              {isUpdating ? "..." : "Marquer en retard"}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled={isUpdating}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {invoice.status !== "DRAFT" && (
                <DropdownMenuItem onClick={() => updateStatus("DRAFT")}>
                  <FileEdit className="w-4 h-4 mr-2" />
                  Remettre en brouillon
                </DropdownMenuItem>
              )}
              {invoice.status !== "SENT" && invoice.status !== "DRAFT" && (
                <DropdownMenuItem onClick={() => updateStatus("SENT")}>
                  <Send className="w-4 h-4 mr-2" />
                  Marquer envoyée
                </DropdownMenuItem>
              )}
              {invoice.status !== "PAID" && (
                <DropdownMenuItem onClick={() => updateStatus("PAID")}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marquer payée
                </DropdownMenuItem>
              )}
              {invoice.status !== "OVERDUE" && invoice.status !== "PAID" && (
                <DropdownMenuItem onClick={() => updateStatus("OVERDUE")}>
                  <Clock className="w-4 h-4 mr-2" />
                  Marquer en retard
                </DropdownMenuItem>
              )}
              {invoice.status !== "CANCELLED" && (
                <DropdownMenuItem
                  onClick={() => updateStatus("CANCELLED")}
                  className="text-red-400"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Annuler la facture
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer la facture
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer la facture {invoice.number} ?</AlertDialogTitle>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardHeader className="flex flex-row gap-3 items-center">
              <User className="w-5 h-5 text-primary-400" />
              <p className="text-md font-semibold">Client</p>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-semibold text-lg">{invoice.client?.name}</p>
              {invoice.client?.companyName && (
                <p className="text-zinc-400">{invoice.client.companyName}</p>
              )}
              <p className="text-zinc-400 mt-2">
                {invoice.client?.address}
                <br />
                {invoice.client?.postalCode} {invoice.client?.city}
                <br />
                {invoice.client?.country}
              </p>
              <p className="text-zinc-400 mt-2">{invoice.client?.email}</p>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardHeader className="flex flex-row gap-3 items-center">
              <FileText className="w-5 h-5 text-primary-400" />
              <p className="text-md font-semibold">Lignes de facture</p>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Qté</TableHead>
                    <TableHead className="text-right">Prix unit.</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unitPrice, invoice.currency)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.amount, invoice.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card className="glass border border-zinc-800 rounded-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-zinc-400 whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Terms */}
          {invoice.terms && (
            <Card className="glass border border-zinc-800 rounded-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Conditions de paiement</h3>
                <p className="text-zinc-400 whitespace-pre-wrap">
                  {invoice.terms}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dates */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardHeader className="flex flex-row gap-3 items-center">
              <Calendar className="w-5 h-5 text-primary-400" />
              <p className="text-md font-semibold">Dates</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div>
                <p className="text-sm text-zinc-400">Date d&apos;émission</p>
                <p className="font-medium">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Date d&apos;échéance</p>
                <p className="font-medium">{formatDate(invoice.dueDate)}</p>
              </div>
              {invoice.paidDate && (
                <div>
                  <p className="text-sm text-zinc-400">Date de paiement</p>
                  <p className="font-medium text-green-400">
                    {formatDate(invoice.paidDate)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card className="glass border border-primary-500/20 rounded-lg">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-zinc-400">
                <span>Sous-total</span>
                <span>
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Remise</span>
                  <span>
                    -{formatCurrency(invoice.discount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>TVA ({invoice.taxRate}%)</span>
                <span>
                  {formatCurrency(invoice.taxAmount, invoice.currency)}
                </span>
              </div>
              <Separator className="bg-zinc-700" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary-400">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Type */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400 mb-1">Type de facture</p>
              <p className="font-medium">
                {invoice.type === "BUSINESS" ? "Entreprise" : "Freelancer"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
