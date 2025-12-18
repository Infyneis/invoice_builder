"use client";

import Link from "next/link";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import type { Invoice, Client, InvoiceItem } from "@/types/invoice";

interface InvoiceDetailProps {
  invoice: Invoice & { client: Client | null; items: InvoiceItem[] };
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Button
            as={Link}
            href="/invoices"
            variant="light"
            radius="lg"
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux factures
            </span>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold gradient-text">
              {invoice.number}
            </h1>
            <Chip
              color={getStatusColor(invoice.status)}
              variant="flat"
              size="lg"
            >
              {getStatusLabel(invoice.status)}
            </Chip>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            as={Link}
            href={`/api/pdf/${invoice.id}`}
            color="secondary"
            variant="flat"
            radius="lg"
          >
            <span className="inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </span>
          </Button>
          {invoice.status === "DRAFT" && (
            <Button color="primary" variant="shadow" radius="lg">
              <span className="inline-flex items-center gap-2">
                <Send className="w-4 h-4" />
                Marquer envoyée
              </span>
            </Button>
          )}
          {invoice.status === "SENT" && (
            <Button color="success" variant="shadow" radius="lg">
              <span className="inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Marquer payée
              </span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card className="glass border border-zinc-800" radius="lg">
            <CardHeader className="flex gap-3">
              <User className="w-5 h-5 text-primary-400" />
              <div className="flex flex-col">
                <p className="text-md font-semibold">Client</p>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
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
            </CardBody>
          </Card>

          {/* Invoice Items */}
          <Card className="glass border border-zinc-800" radius="lg">
            <CardHeader className="flex gap-3">
              <FileText className="w-5 h-5 text-primary-400" />
              <div className="flex flex-col">
                <p className="text-md font-semibold">Lignes de facture</p>
              </div>
            </CardHeader>
            <CardBody className="pt-0 px-0">
              <Table aria-label="Invoice items" removeWrapper>
                <TableHeader>
                  <TableColumn>Description</TableColumn>
                  <TableColumn className="text-center">Qté</TableColumn>
                  <TableColumn className="text-right">Prix unit.</TableColumn>
                  <TableColumn className="text-right">Montant</TableColumn>
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
            </CardBody>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card className="glass border border-zinc-800" radius="lg">
              <CardBody>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-zinc-400 whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </CardBody>
            </Card>
          )}

          {/* Terms */}
          {invoice.terms && (
            <Card className="glass border border-zinc-800" radius="lg">
              <CardBody>
                <h3 className="font-semibold mb-2">Conditions de paiement</h3>
                <p className="text-zinc-400 whitespace-pre-wrap">
                  {invoice.terms}
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dates */}
          <Card className="glass border border-zinc-800" radius="lg">
            <CardHeader className="flex gap-3">
              <Calendar className="w-5 h-5 text-primary-400" />
              <div className="flex flex-col">
                <p className="text-md font-semibold">Dates</p>
              </div>
            </CardHeader>
            <CardBody className="pt-0 space-y-3">
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
            </CardBody>
          </Card>

          {/* Totals */}
          <Card className="glass border border-primary-500/20" radius="lg">
            <CardBody className="space-y-3">
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
              <Divider className="bg-zinc-700" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary-400">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Type */}
          <Card className="glass border border-zinc-800" radius="lg">
            <CardBody>
              <p className="text-sm text-zinc-400 mb-1">Type de facture</p>
              <p className="font-medium">
                {invoice.type === "BUSINESS" ? "Entreprise" : "Freelancer"}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
