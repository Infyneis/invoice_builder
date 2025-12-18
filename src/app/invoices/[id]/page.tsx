import { notFound } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { InvoiceDetail } from "@/components/invoice/invoice-detail";
import { prisma } from "@/lib/prisma";

async function getInvoice(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!invoice) return null;

    return {
      ...invoice,
      subtotal: Number(invoice.subtotal),
      taxRate: Number(invoice.taxRate),
      taxAmount: Number(invoice.taxAmount),
      discount: Number(invoice.discount),
      total: Number(invoice.total),
      items: invoice.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        amount: Number(item.amount),
      })),
    };
  } catch {
    return null;
  }
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <InvoiceDetail invoice={invoice} />
    </>
  );
}
