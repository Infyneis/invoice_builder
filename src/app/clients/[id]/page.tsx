import { Navbar } from "@/components/ui/navbar";
import { ClientDetail } from "@/components/client/client-detail";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ClientDetail client={client} />
    </>
  );
}
