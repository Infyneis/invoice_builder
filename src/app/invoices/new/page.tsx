"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { InvoiceFormData, Client } from "@/types/invoice";

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdFromUrl = searchParams.get("clientId");

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
        toast.success("Facture créée avec succès");
        router.push(`/invoices/${invoice.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast.error("Une erreur est survenue");
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
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/invoices">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux factures
            </Link>
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
            initialData={clientIdFromUrl ? { clientId: clientIdFromUrl } : undefined}
          />
        )}
      </div>
    </>
  );
}
