"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Building2,
  User,
  CreditCard,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types/invoice";

const currencies = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CHF", label: "CHF" },
  { value: "CAD", label: "CAD ($)" },
];

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileType, setProfileType] = useState<"BUSINESS" | "FREELANCER">(
    "BUSINESS"
  );
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    website: "",
    companyName: "",
    taxId: "",
    registrationNo: "",
    title: "",
    hourlyRate: 0,
    bankName: "",
    iban: "",
    bic: "",
    accentColor: "#8B5CF6",
    defaultCurrency: "EUR",
    defaultTaxRate: 20,
    defaultPaymentTerms: 30,
    invoicePrefix: "INV",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const profile = await res.json();
        if (profile) {
          setFormData(profile);
          setProfileType(profile.type || "BUSINESS");
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: profileType }),
      });

      if (res.ok) {
        toast.success("Profil enregistré avec succès");
      } else {
        toast.error("Une erreur est survenue");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Paramètres</h1>
          <p className="text-zinc-400">
            Configurez votre profil et vos préférences de facturation
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Type */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Type de profil</h3>
              <Tabs
                value={profileType}
                onValueChange={(value) =>
                  setProfileType(value as "BUSINESS" | "FREELANCER")
                }
              >
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
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">
                  Informations{" "}
                  {profileType === "BUSINESS" ? "entreprise" : "personnelles"}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">
                    {profileType === "BUSINESS" ? "Nom de l'entreprise" : "Nom complet"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder={profileType === "BUSINESS" ? "ACME Inc." : "Jean Dupont"}
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Téléphone</Label>
                  <Input
                    placeholder="+33 1 23 45 67 89"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Site web</Label>
                  <Input
                    placeholder="https://example.com"
                    value={formData.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
                {profileType === "BUSINESS" && (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label className="text-zinc-400">Numéro TVA / SIRET</Label>
                      <Input
                        placeholder="FR12345678901"
                        value={formData.taxId || ""}
                        onChange={(e) => handleChange("taxId", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-zinc-400">Numéro RCS</Label>
                      <Input
                        placeholder="Paris B 123 456 789"
                        value={formData.registrationNo || ""}
                        onChange={(e) => handleChange("registrationNo", e.target.value)}
                      />
                    </div>
                  </>
                )}
                {profileType === "FREELANCER" && (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label className="text-zinc-400">Titre professionnel</Label>
                      <Input
                        placeholder="Développeur Web"
                        value={formData.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-zinc-400">Taux horaire par défaut (€)</Label>
                      <Input
                        type="number"
                        placeholder="75"
                        value={formData.hourlyRate?.toString() || ""}
                        onChange={(e) =>
                          handleChange("hourlyRate", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">
                    Adresse <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="123 Rue Example"
                    value={formData.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">
                    Code postal <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="75001"
                    value={formData.postalCode || ""}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">
                    Ville <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Paris"
                    value={formData.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Pays</Label>
                  <Input
                    placeholder="France"
                    value={formData.country || ""}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">Coordonnées bancaires</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Nom de la banque</Label>
                  <Input
                    placeholder="BNP Paribas"
                    value={formData.bankName || ""}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">BIC / SWIFT</Label>
                  <Input
                    placeholder="BNPAFRPP"
                    value={formData.bic || ""}
                    onChange={(e) => handleChange("bic", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">IBAN</Label>
                  <Input
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                    value={formData.iban || ""}
                    onChange={(e) => handleChange("iban", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Settings */}
          <Card className="glass border border-zinc-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">Paramètres de facturation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Préfixe des factures</Label>
                  <Input
                    placeholder="INV"
                    value={formData.invoicePrefix || ""}
                    onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Devise par défaut</Label>
                  <Select
                    value={formData.defaultCurrency || "EUR"}
                    onValueChange={(value) => handleChange("defaultCurrency", value)}
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
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Taux de TVA par défaut (%)</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={formData.defaultTaxRate?.toString() || ""}
                    onChange={(e) =>
                      handleChange("defaultTaxRate", parseFloat(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-zinc-400">Délai de paiement par défaut (jours)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.defaultPaymentTerms?.toString() || ""}
                    onChange={(e) =>
                      handleChange("defaultPaymentTerms", parseInt(e.target.value) || 30)
                    }
                    min={0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Enregistrement..." : "Enregistrer les paramètres"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
