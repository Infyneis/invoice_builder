"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Divider,
  DatePicker,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { Save, Eye, Building2, User } from "lucide-react";
import { LineItems } from "./line-items";
import { formatCurrency, calculateInvoiceTotals, formatDateInput } from "@/lib/utils";
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
    issueDate: initialData?.issueDate || formatDateInput(new Date()),
    dueDate:
      initialData?.dueDate ||
      formatDateInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
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

  const handleTypeChange = (type: InvoiceType) => {
    setInvoiceType(type);
    setFormData((prev) => ({ ...prev, type }));
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
      <Card className="glass border border-zinc-800" radius="lg">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold mb-4">Type de facture</h3>
          <Tabs
            selectedKey={invoiceType}
            onSelectionChange={(key) => handleTypeChange(key as InvoiceType)}
            color="primary"
            variant="bordered"
            radius="md"
            classNames={{
              tabList: "bg-zinc-900 p-1 gap-2",
              cursor: "bg-primary-500",
              tab: "px-4 py-2",
              tabContent: "group-data-[selected=true]:text-white",
            }}
          >
            <Tab
              key="BUSINESS"
              title={
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Entreprise</span>
                </div>
              }
            />
            <Tab
              key="FREELANCER"
              title={
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Freelancer</span>
                </div>
              }
            />
          </Tabs>
          <p className="text-sm text-zinc-400 mt-3">
            {invoiceType === "BUSINESS"
              ? "Facture complète avec informations entreprise, TVA et numéro SIRET."
              : "Facture simplifiée pour les indépendants avec taux horaire."}
          </p>
        </CardBody>
      </Card>

      {/* Client Selection */}
      <Card className="glass border border-zinc-800" radius="lg">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold mb-6">Client</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Sélectionner un client</label>
            <Select
              placeholder="Choisir un client"
              selectedKeys={formData.clientId ? [formData.clientId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                if (selected) handleChange("clientId", selected.toString());
              }}
              variant="flat"
              radius="md"
            >
              {clients.map((client) => (
                <SelectItem key={client.id} textValue={client.name}>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-zinc-400">{client.email}</p>
                  </div>
                </SelectItem>
              ))}
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
        </CardBody>
      </Card>

      {/* Invoice Details */}
      <Card className="glass border border-zinc-800" radius="lg">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold mb-6">Détails de la facture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">
                Date d'émission <span className="text-danger">*</span>
              </label>
              <DatePicker
                // @ts-expect-error - HeroUI DatePicker type issue with CalendarDate
                value={parseDate(formData.issueDate)}
                onChange={(date) => {
                  if (date) {
                    handleChange("issueDate", date.toString());
                  }
                }}
                variant="flat"
                radius="md"
                showMonthAndYearPickers
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">
                Date d'échéance <span className="text-danger">*</span>
              </label>
              <DatePicker
                // @ts-expect-error - HeroUI DatePicker type issue with CalendarDate
                value={parseDate(formData.dueDate)}
                onChange={(date) => {
                  if (date) {
                    handleChange("dueDate", date.toString());
                  }
                }}
                variant="flat"
                radius="md"
                showMonthAndYearPickers
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Devise</label>
              <Select
                selectedKeys={[formData.currency]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (selected) handleChange("currency", selected.toString());
                }}
                variant="flat"
                radius="md"
              >
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} textValue={currency.label}>
                    {currency.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Line Items */}
      <Card className="glass border border-zinc-800" radius="lg">
        <CardBody className="p-6">
          <LineItems
            items={formData.items}
            onChange={handleItemsChange}
            currency={formData.currency}
          />
        </CardBody>
      </Card>

      {/* Totals & Tax */}
      <Card className="glass border border-zinc-800" radius="lg">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold mb-6">Totaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-400">Taux de TVA (%)</label>
                <Input
                  type="number"
                  value={formData.taxRate.toString()}
                  onChange={(e) =>
                    handleChange("taxRate", parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  max={100}
                  step={0.1}
                  variant="flat"
                  radius="md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-400">Remise (€)</label>
                <Input
                  type="number"
                  value={formData.discount.toString()}
                  onChange={(e) =>
                    handleChange("discount", parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  step={0.01}
                  variant="flat"
                  radius="md"
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
              <Divider className="bg-zinc-700 my-2" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary-400">
                  {formatCurrency(totals.total, formData.currency)}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Notes & Terms */}
      <Card className="glass border border-zinc-800" radius="lg">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold mb-6">Notes & Conditions</h3>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Notes pour le client</label>
              <Textarea
                placeholder="Informations supplémentaires pour le client..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                variant="flat"
                radius="md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Conditions de paiement</label>
              <Textarea
                placeholder="Ex: Paiement à 30 jours..."
                value={formData.terms}
                onChange={(e) => handleChange("terms", e.target.value)}
                variant="flat"
                radius="md"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        {onPreview && (
          <Button
            variant="bordered"
            radius="lg"
            className="border-zinc-600 px-6"
            onPress={onPreview}
          >
            <span className="inline-flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Aperçu PDF
            </span>
          </Button>
        )}
        <Button
          type="submit"
          color="primary"
          variant="shadow"
          radius="lg"
          className="px-6"
          isLoading={isLoading}
        >
          <span className="inline-flex items-center gap-2">
            <Save className="w-4 h-4" />
            Enregistrer la facture
          </span>
        </Button>
      </div>
    </form>
  );
}
