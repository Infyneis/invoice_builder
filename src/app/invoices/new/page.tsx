"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { InvoiceFormData, Client } from "@/types/invoice";

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleSubmit = async (data: InvoiceFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const invoice = await res.json();
        router.push(`/invoices/${invoice.id}`);
      } else {
        const error = await res.json();
        alert(error.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
      alert("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
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
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Nouvelle Facture
          </h1>
          <p className="text-zinc-400">
            Créez une facture professionnelle en quelques minutes
          </p>
        </div>

        {/* Form */}
        {isLoadingClients ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <InvoiceForm
            clients={clients}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
}
