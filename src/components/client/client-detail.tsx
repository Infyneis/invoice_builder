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
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import type { Client, Invoice } from "@/types/invoice";

interface ClientDetailProps {
  client: Client & { invoices: Invoice[] };
}

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SENT: "default",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export function ClientDetail({ client }: ClientDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/clients");
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalInvoiced = client.invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = client.invoices.filter((inv) => inv.status === "PAID");
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/clients">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux clients
            </Link>
          </Button>
          <h1 className="text-3xl font-bold gradient-text">{client.name}</h1>
          {client.companyName && (
            <p className="text-zinc-400 mt-1">{client.companyName}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/invoices/new?clientId=${client.id}`}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle facture
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || client.invoices.length > 0}
            title={client.invoices.length > 0 ? "Impossible de supprimer un client avec des factures" : "Supprimer le client"}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardHeader className="flex flex-row gap-3 items-center">
              <Mail className="w-5 h-5 text-primary-400" />
              <p className="text-md font-semibold">Coordonnées</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Email</p>
                  <a
                    href={`mailto:${client.email}`}
                    className="text-primary-400 hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
                {client.phone && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Téléphone</p>
                    <a
                      href={`tel:${client.phone}`}
                      className="text-primary-400 hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.contactName && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Contact</p>
                    <p>{client.contactName}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardHeader className="flex flex-row gap-3 items-center">
              <MapPin className="w-5 h-5 text-primary-400" />
              <p className="text-md font-semibold">Adresse</p>
            </CardHeader>
            <CardContent className="pt-0">
              <p>{client.address}</p>
              <p>
                {client.postalCode} {client.city}
              </p>
              <p>{client.country}</p>
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardHeader className="flex flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary-400" />
                <p className="text-md font-semibold">
                  Factures ({client.invoices.length})
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              {client.invoices.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune facture pour ce client</p>
                  <Button asChild className="mt-4" size="sm">
                    <Link href={`/invoices/new?clientId=${client.id}`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une facture
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numéro</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-zinc-800/50">
                        <TableCell>
                          <Link
                            href={`/invoices/${invoice.id}`}
                            className="text-primary-400 hover:underline font-medium"
                          >
                            {invoice.number}
                          </Link>
                        </TableCell>
                        <TableCell className="text-zinc-400">
                          {formatDate(invoice.issueDate)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariantMap[invoice.status] || "secondary"}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {client.notes && (
            <Card className="glass border border-zinc-800 rounded-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-zinc-400 whitespace-pre-wrap">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="glass border border-primary-500/20 rounded-lg">
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total facturé</p>
                <p className="text-2xl font-bold text-primary-400">
                  {formatCurrency(totalInvoiced, "EUR")}
                </p>
              </div>
              <Separator className="bg-zinc-700" />
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total payé</p>
                <p className="text-xl font-semibold text-green-400">
                  {formatCurrency(totalPaid, "EUR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Nombre de factures</p>
                <p className="text-xl font-semibold">{client.invoices.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          {(client.companyName || client.taxId) && (
            <Card className="glass border border-zinc-800 rounded-lg">
              <CardHeader className="flex flex-row gap-3 items-center">
                <Building2 className="w-5 h-5 text-primary-400" />
                <p className="text-md font-semibold">Entreprise</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {client.companyName && (
                  <div>
                    <p className="text-sm text-zinc-400">Raison sociale</p>
                    <p className="font-medium">{client.companyName}</p>
                  </div>
                )}
                {client.taxId && (
                  <div>
                    <p className="text-sm text-zinc-400">Numéro TVA / SIRET</p>
                    <p className="font-medium">{client.taxId}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Created Date */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400 mb-1">Client depuis</p>
              <p className="font-medium">{formatDate(client.createdAt)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
