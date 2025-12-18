"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import {
  formatCurrency,
  formatDate,
  getStatusLabel,
} from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface RecentInvoicesProps {
  invoices: Invoice[];
}

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SENT: "default",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  const router = useRouter();

  return (
    <Card className="glass border border-zinc-800 rounded-lg">
      <CardHeader className="flex flex-row justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold">Factures Récentes</h3>
        </div>
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/invoices">
            Voir tout
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>Aucune facture pour le moment</p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/invoices/new">
                <FileText className="w-4 h-4 mr-2" />
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
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
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
                  <TableCell>{invoice.client?.name || "—"}</TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(invoice.issueDate)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[invoice.status] || "secondary"}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
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
