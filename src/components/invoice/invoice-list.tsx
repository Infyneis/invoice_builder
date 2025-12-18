"use client";

import {
  Card,
  CardBody,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Plus, FileText, Download, Eye } from "lucide-react";
import Link from "next/link";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import type { Invoice, Client } from "@/types/invoice";

interface InvoiceListProps {
  invoices: (Invoice & { client: Client | null })[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <Card className="glass border border-zinc-800" radius="lg">
      <CardBody className="p-0">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg mb-2">Aucune facture</p>
            <p className="text-sm mb-4">
              Créez votre première facture pour commencer
            </p>
            <Button
              as={Link}
              href="/invoices/new"
              color="primary"
              variant="shadow"
              radius="full"
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Créer une facture
              </span>
            </Button>
          </div>
        ) : (
          <Table aria-label="Invoices" removeWrapper>
            <TableHeader>
              <TableColumn>Numéro</TableColumn>
              <TableColumn>Client</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Échéance</TableColumn>
              <TableColumn>Montant</TableColumn>
              <TableColumn>Statut</TableColumn>
              <TableColumn>Actions</TableColumn>
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
                    <Chip
                      size="sm"
                      color={getStatusColor(invoice.status)}
                      variant="flat"
                    >
                      {getStatusLabel(invoice.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        as={Link}
                        href={`/invoices/${invoice.id}`}
                        size="sm"
                        variant="flat"
                        radius="lg"
                        isIconOnly
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        as={Link}
                        href={`/api/pdf/${invoice.id}`}
                        size="sm"
                        variant="flat"
                        color="primary"
                        radius="lg"
                        isIconOnly
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
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
