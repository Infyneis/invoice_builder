import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber, calculateInvoiceTotals } from "@/lib/utils";

// GET /api/invoices - List all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientId,
      type,
      currency,
      issueDate,
      dueDate,
      taxRate,
      discount,
      notes,
      terms,
      footer,
      items,
    } = body;

    // Validate required fields
    if (!clientId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Client and items are required" },
        { status: 400 }
      );
    }

    // Get or create default profile
    let profile = await prisma.profile.findFirst();
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          name: "Mon Entreprise",
          email: "contact@example.com",
          address: "123 Rue Example",
          city: "Paris",
          postalCode: "75001",
          country: "France",
          type: "BUSINESS",
          accentColor: "#8B5CF6",
          defaultCurrency: "EUR",
          defaultTaxRate: 20,
          defaultPaymentTerms: 30,
          invoicePrefix: "INV",
          nextInvoiceNum: 1,
        },
      });
    }

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber(
      profile.invoicePrefix,
      profile.nextInvoiceNum
    );

    // Calculate totals
    const itemsWithAmounts = items.map(
      (
        item: { description: string; quantity: number; unitPrice: number },
        index: number
      ) => ({
        ...item,
        amount: item.quantity * item.unitPrice,
        order: index,
      })
    );

    const totals = calculateInvoiceTotals(
      items.map((item: { quantity: number; unitPrice: number }) => ({
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      taxRate,
      discount
    );

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        profileId: profile.id,
        clientId,
        number: invoiceNumber,
        type,
        status: "DRAFT",
        currency,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        subtotal: totals.subtotal,
        taxRate,
        taxAmount: totals.taxAmount,
        discount,
        total: totals.total,
        notes,
        terms,
        footer,
        items: {
          create: itemsWithAmounts.map(
            (item: {
              description: string;
              quantity: number;
              unitPrice: number;
              amount: number;
              unit?: string;
              order: number;
            }) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: item.amount,
              unit: item.unit,
              order: item.order,
            })
          ),
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    // Update next invoice number
    await prisma.profile.update({
      where: { id: profile.id },
      data: { nextInvoiceNum: profile.nextInvoiceNum + 1 },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
