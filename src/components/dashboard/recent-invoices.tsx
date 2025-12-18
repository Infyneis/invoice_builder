"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@heroui/react";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface RecentInvoicesProps {
  invoices: Invoice[];
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <Card className="glass border border-zinc-800" radius="lg">
      <CardHeader className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold">Factures Récentes</h3>
        </div>
        <Button
          as={Link}
          href="/invoices"
          variant="light"
          size="sm"
          radius="full"
        >
          <span className="inline-flex items-center gap-2">
            Voir tout
            <ExternalLink className="w-4 h-4" />
          </span>
        </Button>
      </CardHeader>
      <CardBody className="px-0 py-0">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>Aucune facture pour le moment</p>
            <Button
              as={Link}
              href="/invoices/new"
              color="primary"
              variant="shadow"
              radius="full"
              className="mt-4"
            >
              <span className="inline-flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Créer une facture
              </span>
            </Button>
          </div>
        ) : (
          <Table
            aria-label="Recent invoices"
            removeWrapper
            className="min-w-full"
          >
            <TableHeader>
              <TableColumn>Numéro</TableColumn>
              <TableColumn>Client</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Montant</TableColumn>
              <TableColumn>Statut</TableColumn>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="hover:bg-zinc-800/50 cursor-pointer"
                >
                  <TableCell>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="text-primary-400 hover:underline"
                    >
                      {invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.client?.name || "—"}</TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(invoice.issueDate)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={getStatusColor(invoice.status)}
                      variant="flat"
                    >
                      {getStatusLabel(invoice.status)}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
