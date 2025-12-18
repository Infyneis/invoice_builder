"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Save, Eye, Building2, User } from "lucide-react";
import { LineItems } from "./line-items";
import { formatCurrency, calculateInvoiceTotals } from "@/lib/utils";
import type {
  InvoiceFormData,
  InvoiceItemFormData,
  InvoiceType,
  Client,
} from "@/types/invoice";

interface InvoiceFormProps {
  clients: Client[];
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  onPreview?: () => void;
  initialData?: Partial<InvoiceFormData>;
  isLoading?: boolean;
}

const currencies = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CHF", label: "CHF" },
  { value: "CAD", label: "CAD ($)" },
];

const formatDateForForm = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const parseDateFromForm = (dateStr: string): Date => {
  return new Date(dateStr);
};

export function InvoiceForm({
  clients,
  onSubmit,
  onPreview,
  initialData,
  isLoading = false,
}: InvoiceFormProps) {
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(
    initialData?.type || "BUSINESS"
  );
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientId: initialData?.clientId || "",
    type: initialData?.type || "BUSINESS",
    currency: initialData?.currency || "EUR",
    issueDate: initialData?.issueDate || formatDateForForm(new Date()),
    dueDate:
      initialData?.dueDate ||
      formatDateForForm(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    taxRate: initialData?.taxRate ?? 20,
    discount: initialData?.discount || 0,
    notes: initialData?.notes || "",
    terms: initialData?.terms || "Paiement à réception de la facture.",
    footer: initialData?.footer || "",
    items: initialData?.items || [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        unit: "unité",
        order: 0,
      },
    ],
  });

  const handleChange = (
    field: keyof InvoiceFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemsChange = (items: InvoiceItemFormData[]) => {
    setFormData((prev) => ({ ...prev, items }));
  };

  const handleTypeChange = (type: string) => {
    setInvoiceType(type as InvoiceType);
    setFormData((prev) => ({ ...prev, type: type as InvoiceType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const totals = calculateInvoiceTotals(
    formData.items.map((item) => ({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    formData.taxRate,
    formData.discount
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Invoice Type Selector */}
      <Card className="glass border border-zinc-800 rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Type de facture</h3>
          <Tabs value={invoiceType} onValueChange={handleTypeChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="BUSINESS" className="gap-2">
                <Building2 className="w-4 h-4" />
                Entreprise
              </TabsTrigger>
              <TabsTrigger value="FREELANCER" className="gap-2">
                <User className="w-4 h-4" />
                Freelancer
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-sm text-zinc-400 mt-3">
            {invoiceType === "BUSINESS"
              ? "Facture complète avec informations entreprise, TVA et numéro SIRET."
              : "Facture simplifiée pour les indépendants avec taux horaire."}
          </p>
        </CardContent>
      </Card>

      {/* Client Selection */}
      <Card className="glass border border-zinc-800 rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Client</h3>
          <div className="flex flex-col gap-2">
            <Label className="text-zinc-400">Sélectionner un client</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleChange("clientId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-zinc-400">{client.email}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {clients.length === 0 && (
            <p className="text-sm text-zinc-400 mt-3">
              Aucun client disponible.{" "}
              <a href="/clients/new" className="text-primary-400 hover:underline">
                Créer un client
              </a>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card className="glass border border-zinc-800 rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Détails de la facture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-zinc-400">
                Date d&apos;émission <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={parseDateFromForm(formData.issueDate)}
                onChange={(date) => {
                  if (date) {
                    handleChange("issueDate", formatDateForForm(date));
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-zinc-400">
                Date d&apos;échéance <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={parseDateFromForm(formData.dueDate)}
                onChange={(date) => {
                  if (date) {
                    handleChange("dueDate", formatDateForForm(date));
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-zinc-400">Devise</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card className="glass border border-zinc-800 rounded-lg">
        <CardContent className="p-6">
          <LineItems
            items={formData.items}
            onChange={handleItemsChange}
            currency={formData.currency}
          />
        </CardContent>
      </Card>

      {/* Totals & Tax */}
      <Card className="glass border border-zinc-800 rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Totaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <Label className="text-zinc-400">Taux de TVA (%)</Label>
                <Input
                  type="number"
                  value={formData.taxRate.toString()}
                  onChange={(e) =>
                    handleChange("taxRate", parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  max={100}
                  step={0.1}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-zinc-400">Remise (€)</Label>
                <Input
                  type="number"
                  value={formData.discount.toString()}
                  onChange={(e) =>
                    handleChange("discount", parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
            <div className="bg-zinc-800/30 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-zinc-400">
                <span>Sous-total</span>
                <span>{formatCurrency(totals.subtotal, formData.currency)}</span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Remise</span>
                  <span>-{formatCurrency(formData.discount, formData.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>TVA ({formData.taxRate}%)</span>
                <span>{formatCurrency(totals.taxAmount, formData.currency)}</span>
              </div>
              <Separator className="bg-zinc-700 my-2" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary-400">
                  {formatCurrency(totals.total, formData.currency)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <Card className="glass border border-zinc-800 rounded-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Notes & Conditions</h3>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label className="text-zinc-400">Notes pour le client</Label>
              <Textarea
                placeholder="Informations supplémentaires pour le client..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-zinc-400">Conditions de paiement</Label>
              <Textarea
                placeholder="Ex: Paiement à 30 jours..."
                value={formData.terms}
                onChange={(e) => handleChange("terms", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        {onPreview && (
          <Button type="button" variant="outline" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Aperçu PDF
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Enregistrement..." : "Enregistrer la facture"}
        </Button>
      </div>
    </form>
  );
}
