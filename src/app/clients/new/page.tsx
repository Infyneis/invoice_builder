"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Building2, User, MapPin, FileText } from "lucide-react";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    companyName: "",
    taxId: "",
    contactName: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/clients");
      } else {
        const error = await res.json();
        alert(error.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Failed to create client:", error);
      alert("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/clients">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux clients
            </Link>
          </Button>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Nouveau Client
          </h1>
          <p className="text-zinc-400">
            Ajoutez un nouveau client à votre carnet
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Info */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">Informations de contact</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">
                    Nom complet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="jean@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Téléphone</Label>
                  <Input
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Contact (si entreprise)</Label>
                  <Input
                    placeholder="Nom du contact"
                    value={formData.contactName}
                    onChange={(e) => handleChange("contactName", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">Adresse</h3>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">
                    Adresse <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="123 Rue Example"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-zinc-400">
                      Code postal <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="75001"
                      value={formData.postalCode}
                      onChange={(e) => handleChange("postalCode", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-zinc-400">
                      Ville <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Paris"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-zinc-400">Pays</Label>
                    <Input
                      placeholder="France"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">Informations entreprise (optionnel)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Nom de l&apos;entreprise</Label>
                  <Input
                    placeholder="ACME Inc."
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Numéro de TVA / SIRET</Label>
                  <Input
                    placeholder="FR12345678901"
                    value={formData.taxId}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">Notes</h3>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-zinc-400">Notes internes</Label>
                <Textarea
                  placeholder="Notes sur ce client..."
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Enregistrement..." : "Enregistrer le client"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
