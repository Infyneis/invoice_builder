import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/profile - Get the profile
export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();

    if (!profile) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      ...profile,
      hourlyRate: profile.hourlyRate ? Number(profile.hourlyRate) : null,
      defaultTaxRate: Number(profile.defaultTaxRate),
    });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// POST /api/profile - Create or update profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      website,
      companyName,
      taxId,
      registrationNo,
      title,
      hourlyRate,
      bankName,
      iban,
      bic,
      logo,
      accentColor,
      defaultCurrency,
      defaultTaxRate,
      defaultPaymentTerms,
      invoicePrefix,
    } = body;

    // Validate required fields
    if (!name || !email || !address || !city || !postalCode) {
      return NextResponse.json(
        { error: "Name, email, address, city, and postal code are required" },
        { status: 400 }
      );
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst();

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          type: type || "BUSINESS",
          name,
          email,
          phone,
          address,
          city,
          postalCode,
          country: country || "France",
          website,
          companyName,
          taxId,
          registrationNo,
          title,
          hourlyRate: hourlyRate || null,
          bankName,
          iban,
          bic,
          logo,
          accentColor: accentColor || "#8B5CF6",
          defaultCurrency: defaultCurrency || "EUR",
          defaultTaxRate: defaultTaxRate ?? 20,
          defaultPaymentTerms: defaultPaymentTerms ?? 30,
          invoicePrefix: invoicePrefix || "INV",
        },
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          type: type || "BUSINESS",
          name,
          email,
          phone,
          address,
          city,
          postalCode,
          country: country || "France",
          website,
          companyName,
          taxId,
          registrationNo,
          title,
          hourlyRate: hourlyRate || null,
          bankName,
          iban,
          bic,
          logo,
          accentColor: accentColor || "#8B5CF6",
          defaultCurrency: defaultCurrency || "EUR",
          defaultTaxRate: defaultTaxRate ?? 20,
          defaultPaymentTerms: defaultPaymentTerms ?? 30,
          invoicePrefix: invoicePrefix || "INV",
          nextInvoiceNum: 1,
        },
      });
    }

    return NextResponse.json({
      ...profile,
      hourlyRate: profile.hourlyRate ? Number(profile.hourlyRate) : null,
      defaultTaxRate: Number(profile.defaultTaxRate),
    });
  } catch (error) {
    console.error("Failed to save profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
