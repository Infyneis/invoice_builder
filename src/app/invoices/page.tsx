import { Navbar } from "@/components/ui/navbar";
import { InvoiceList } from "@/components/invoice/invoice-list";
import { InvoiceHeader } from "@/components/invoice/invoice-header";
import { prisma } from "@/lib/prisma";

async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
    });
    return invoices.map((inv) => ({
      ...inv,
      subtotal: Number(inv.subtotal),
      taxRate: Number(inv.taxRate),
      taxAmount: Number(inv.taxAmount),
      discount: Number(inv.discount),
      total: Number(inv.total),
    }));
  } catch {
    return [];
  }
}

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <InvoiceHeader />
        <InvoiceList invoices={invoices} />
      </div>
    </>
  );
}
