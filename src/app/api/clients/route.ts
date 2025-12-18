import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clients - List all clients
export async function GET() {
  try {
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

    const clients = await prisma.client.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create a new client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      companyName,
      taxId,
      contactName,
      notes,
    } = body;

    // Validate required fields
    if (!name || !email || !address || !city || !postalCode) {
      return NextResponse.json(
        { error: "Name, email, address, city, and postal code are required" },
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

    const client = await prisma.client.create({
      data: {
        profileId: profile.id,
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        country: country || "France",
        companyName,
        taxId,
        contactName,
        notes,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Failed to create client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
