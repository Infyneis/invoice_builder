import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Invoice, InvoiceItem, Client, Profile } from "@/types/invoice";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 700,
    color: "#8b5cf6",
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#8b5cf6",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#8b5cf6",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    width: "48%",
  },
  label: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 10,
    color: "#1f2937",
    marginBottom: 4,
  },
  valueBold: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: 4,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 600,
    color: "#374151",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  colDescription: {
    width: "45%",
  },
  colQuantity: {
    width: "15%",
    textAlign: "center",
  },
  colPrice: {
    width: "20%",
    textAlign: "right",
  },
  colAmount: {
    width: "20%",
    textAlign: "right",
  },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 250,
    paddingVertical: 6,
  },
  totalsLabel: {
    width: "50%",
    fontSize: 10,
    color: "#6b7280",
  },
  totalsValue: {
    width: "50%",
    fontSize: 10,
    textAlign: "right",
    color: "#1f2937",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 250,
    paddingVertical: 10,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#8b5cf6",
  },
  totalLabel: {
    width: "50%",
    fontSize: 14,
    fontWeight: 700,
    color: "#8b5cf6",
  },
  totalValue: {
    width: "50%",
    fontSize: 14,
    fontWeight: 700,
    textAlign: "right",
    color: "#8b5cf6",
  },
  notes: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#faf5ff",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#8b5cf6",
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#8b5cf6",
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bankDetails: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  bankTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 8,
  },
  bankRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bankLabel: {
    width: 60,
    fontSize: 9,
    color: "#6b7280",
  },
  bankValue: {
    flex: 1,
    fontSize: 9,
    color: "#1f2937",
  },
});

interface InvoicePDFProps {
  invoice: Invoice & { client: Client; items: InvoiceItem[] };
  profile: Profile;
}

function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  })
    .format(amount)
    // Replace narrow non-breaking space (U+202F) with regular space for PDF compatibility
    .replace(/\u202F/g, " ");
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function InvoicePDF({ invoice, profile }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>{profile.name}</Text>
            <Text style={styles.value}>{profile.address}</Text>
            <Text style={styles.value}>
              {profile.postalCode} {profile.city}
            </Text>
            <Text style={styles.value}>{profile.email}</Text>
            {profile.phone && <Text style={styles.value}>{profile.phone}</Text>}
            {profile.taxId && (
              <Text style={styles.value}>TVA: {profile.taxId}</Text>
            )}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceNumber}>{invoice.number}</Text>
          </View>
        </View>

        {/* Client & Dates */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Facturé à</Text>
            <Text style={styles.valueBold}>{invoice.client.name}</Text>
            {invoice.client.companyName && (
              <Text style={styles.value}>{invoice.client.companyName}</Text>
            )}
            <Text style={styles.value}>{invoice.client.address}</Text>
            <Text style={styles.value}>
              {invoice.client.postalCode} {invoice.client.city}
            </Text>
            <Text style={styles.value}>{invoice.client.email}</Text>
            {invoice.client.taxId && (
              <Text style={styles.value}>TVA: {invoice.client.taxId}</Text>
            )}
          </View>
          <View style={styles.column}>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Date d'émission</Text>
              <Text style={styles.valueBold}>
                {formatDate(invoice.issueDate)}
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Date d'échéance</Text>
              <Text style={styles.valueBold}>{formatDate(invoice.dueDate)}</Text>
            </View>
            <View>
              <Text style={styles.label}>Statut</Text>
              <Text style={styles.valueBold}>
                {invoice.status === "PAID"
                  ? "Payée"
                  : invoice.status === "SENT"
                    ? "Envoyée"
                    : invoice.status === "OVERDUE"
                      ? "En retard"
                      : "Brouillon"}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDescription]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderText, styles.colQuantity]}>
              Qté
            </Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>
              Prix unit.
            </Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>
              Montant
            </Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={[styles.colQuantity, { textAlign: "center" }]}>
                {Number(item.quantity)}
              </Text>
              <Text style={[styles.colPrice, { textAlign: "right" }]}>
                {formatCurrency(Number(item.unitPrice), invoice.currency)}
              </Text>
              <Text style={[styles.colAmount, { textAlign: "right" }]}>
                {formatCurrency(Number(item.amount), invoice.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Sous-total</Text>
            <Text style={styles.totalsValue}>
              {formatCurrency(Number(invoice.subtotal), invoice.currency)}
            </Text>
          </View>
          {Number(invoice.discount) > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Remise</Text>
              <Text style={styles.totalsValue}>
                -{formatCurrency(Number(invoice.discount), invoice.currency)}
              </Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>
              TVA ({Number(invoice.taxRate)}%)
            </Text>
            <Text style={styles.totalsValue}>
              {formatCurrency(Number(invoice.taxAmount), invoice.currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(Number(invoice.total), invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Bank Details */}
        {profile.iban && (
          <View style={styles.bankDetails}>
            <Text style={styles.bankTitle}>Coordonnées bancaires</Text>
            {profile.bankName && (
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Banque:</Text>
                <Text style={styles.bankValue}>{profile.bankName}</Text>
              </View>
            )}
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>IBAN:</Text>
              <Text style={styles.bankValue}>{profile.iban}</Text>
            </View>
            {profile.bic && (
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>BIC:</Text>
                <Text style={styles.bankValue}>{profile.bic}</Text>
              </View>
            )}
          </View>
        )}

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Terms */}
        {invoice.terms && (
          <View style={[styles.notes, { backgroundColor: "#f9fafb" }]}>
            <Text style={[styles.notesTitle, { color: "#374151" }]}>
              Conditions de paiement
            </Text>
            <Text style={styles.notesText}>{invoice.terms}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {profile.name} • {profile.address}, {profile.postalCode}{" "}
          {profile.city} • {profile.email}
          {profile.taxId && ` • TVA: ${profile.taxId}`}
        </Text>
      </Page>
    </Document>
  );
}
