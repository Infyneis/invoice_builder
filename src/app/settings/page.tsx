"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import {
  Card,
  CardBody,
  Button,
  Input,
  Tabs,
  Tab,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Save,
  Building2,
  User,
  CreditCard,
  FileText,
} from "lucide-react";
import { FormField } from "@/components/ui/form-field";
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
        alert("Profil enregistré avec succès !");
      } else {
        alert("Une erreur est survenue");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Une erreur est survenue");
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
          <Card className="glass border border-zinc-800" radius="lg">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold mb-4">Type de profil</h3>
              <Tabs
                selectedKey={profileType}
                onSelectionChange={(key) =>
                  setProfileType(key as "BUSINESS" | "FREELANCER")
                }
                color="primary"
                variant="solid"
                radius="lg"
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
            </CardBody>
          </Card>

          {/* Basic Info */}
          <Card className="glass border border-zinc-800" radius="lg">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">
                  Informations{" "}
                  {profileType === "BUSINESS" ? "entreprise" : "personnelles"}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  label={profileType === "BUSINESS" ? "Nom de l'entreprise" : "Nom complet"}
                  required
                >
                  <Input
                    placeholder={profileType === "BUSINESS" ? "ACME Inc." : "Jean Dupont"}
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                <FormField label="Email" required>
                  <Input
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                <FormField label="Téléphone">
                  <Input
                    placeholder="+33 1 23 45 67 89"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                <FormField label="Site web">
                  <Input
                    placeholder="https://example.com"
                    value={formData.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                {profileType === "BUSINESS" && (
                  <>
                    <FormField label="Numéro TVA / SIRET">
                      <Input
                        placeholder="FR12345678901"
                        value={formData.taxId || ""}
                        onChange={(e) => handleChange("taxId", e.target.value)}
                        variant="bordered"
                        radius="lg"
                        size="lg"
                          />
                    </FormField>
                    <FormField label="Numéro RCS">
                      <Input
                        placeholder="Paris B 123 456 789"
                        value={formData.registrationNo || ""}
                        onChange={(e) => handleChange("registrationNo", e.target.value)}
                        variant="bordered"
                        radius="lg"
                        size="lg"
                          />
                    </FormField>
                  </>
                )}
                {profileType === "FREELANCER" && (
                  <>
                    <FormField label="Titre professionnel">
                      <Input
                        placeholder="Développeur Web"
                        value={formData.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        variant="bordered"
                        radius="lg"
                        size="lg"
                          />
                    </FormField>
                    <FormField label="Taux horaire par défaut (€)">
                      <Input
                        type="number"
                        placeholder="75"
                        value={formData.hourlyRate?.toString() || ""}
                        onChange={(e) =>
                          handleChange("hourlyRate", parseFloat(e.target.value) || 0)
                        }
                        variant="bordered"
                        radius="lg"
                        size="lg"
                          />
                    </FormField>
                  </>
                )}
              </div>
              <div className="mt-8">
                <FormField label="Adresse" required>
                  <Input
                    placeholder="123 Rue Example"
                    value={formData.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <FormField label="Code postal" required>
                  <Input
                    placeholder="75001"
                    value={formData.postalCode || ""}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                <FormField label="Ville" required>
                  <Input
                    placeholder="Paris"
                    value={formData.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                <FormField label="Pays">
                  <Input
                    placeholder="France"
                    value={formData.country || ""}
                    onChange={(e) => handleChange("country", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
              </div>
            </CardBody>
          </Card>

          {/* Bank Details */}
          <Card className="glass border border-zinc-800" radius="lg">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">Coordonnées bancaires</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Nom de la banque">
                  <Input
                    placeholder="BNP Paribas"
                    value={formData.bankName || ""}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                <FormField label="BIC / SWIFT">
                  <Input
                    placeholder="BNPAFRPP"
                    value={formData.bic || ""}
                    onChange={(e) => handleChange("bic", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
              </div>
              <div className="mt-8">
                <FormField label="IBAN">
                  <Input
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                    value={formData.iban || ""}
                    onChange={(e) => handleChange("iban", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
              </div>
            </CardBody>
          </Card>

          {/* Invoice Settings */}
          <Card className="glass border border-zinc-800" radius="lg">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold">Paramètres de facturation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Préfixe des factures">
                  <Input
                    placeholder="INV"
                    value={formData.invoicePrefix || ""}
                    onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                <FormField label="Devise par défaut">
                  <Select
                    selectedKeys={[formData.defaultCurrency || "EUR"]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      if (selected) handleChange("defaultCurrency", selected.toString());
                    }}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  >
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} textValue={currency.label}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Taux de TVA par défaut (%)">
                  <Input
                    type="number"
                    placeholder="20"
                    value={formData.defaultTaxRate?.toString() || ""}
                    onChange={(e) =>
                      handleChange("defaultTaxRate", parseFloat(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
                <FormField label="Délai de paiement par défaut (jours)">
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.defaultPaymentTerms?.toString() || ""}
                    onChange={(e) =>
                      handleChange("defaultPaymentTerms", parseInt(e.target.value) || 30)
                    }
                    min={0}
                    variant="bordered"
                    radius="lg"
                    size="lg"
                  />
                </FormField>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <div className="flex justify-end">
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
                Enregistrer les paramètres
              </span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
