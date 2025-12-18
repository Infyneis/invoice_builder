import { Navbar } from "@/components/ui/navbar";
import { ClientList } from "@/components/client/client-list";
import { ClientHeader } from "@/components/client/client-header";
import { prisma } from "@/lib/prisma";

async function getClients() {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) return [];

    const clients = await prisma.client.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { invoices: true },
        },
      },
    });
    return clients;
  } catch {
    return [];
  }
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ClientHeader />
        <ClientList clients={clients} />
      </div>
    </>
  );
}
