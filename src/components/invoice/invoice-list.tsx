"use client";

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
import { Plus, FileText, Download, Eye } from "lucide-react";
import Link from "next/link";
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
                <TableRow key={invoice.id} className="hover:bg-zinc-800/50">
                  <TableCell>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="text-primary-400 hover:underline font-medium"
                    >
                      {invoice.number}
                    </Link>
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
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant="secondary" size="icon">
                        <Link href={`/invoices/${invoice.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="secondary" size="icon">
                        <Link href={`/api/pdf/${invoice.id}`}>
                          <Download className="w-4 h-4" />
                        </Link>
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
