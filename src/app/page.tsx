import { Navbar } from "@/components/ui/navbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProTip } from "@/components/dashboard/pro-tip";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

async function getDashboardData() {
  try {
    // Get all invoices with clients
    const invoices = await prisma.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Calculate stats
    const allInvoices = await prisma.invoice.findMany();

    const totalRevenue = allInvoices
      .filter((inv) => inv.status === "PAID")
      .reduce((sum, inv) => sum + Number(inv.total), 0);

    const pendingAmount = allInvoices
      .filter((inv) => inv.status === "SENT")
      .reduce((sum, inv) => sum + Number(inv.total), 0);

    const overdueAmount = allInvoices
      .filter((inv) => inv.status === "OVERDUE")
      .reduce((sum, inv) => sum + Number(inv.total), 0);

    return {
      invoices: invoices.map((inv) => ({
        ...inv,
        subtotal: Number(inv.subtotal),
        taxRate: Number(inv.taxRate),
        taxAmount: Number(inv.taxAmount),
        discount: Number(inv.discount),
        total: Number(inv.total),
      })),
      stats: {
        totalInvoices: allInvoices.length,
        totalRevenue,
        pendingAmount,
        overdueAmount,
      },
    };
  } catch {
    // Database not ready yet
    return {
      invoices: [],
      stats: {
        totalInvoices: 0,
        totalRevenue: 0,
        pendingAmount: 0,
        overdueAmount: 0,
      },
    };
  }
}

export default async function DashboardPage() {
  const { invoices, stats } = await getDashboardData();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Tableau de bord
          </h1>
          <p className="text-zinc-400">
            Gérez vos factures et suivez vos revenus
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Factures"
            value={stats.totalInvoices}
            iconName="FileText"
            color="primary"
          />
          <StatsCard
            title="Revenus Payés"
            value={formatCurrency(stats.totalRevenue)}
            iconName="Euro"
            color="success"
          />
          <StatsCard
            title="En Attente"
            value={formatCurrency(stats.pendingAmount)}
            iconName="Clock"
            color="warning"
          />
          <StatsCard
            title="En Retard"
            value={formatCurrency(stats.overdueAmount)}
            iconName="AlertCircle"
            color="danger"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Invoices */}
          <div className="lg:col-span-2">
            <RecentInvoices invoices={invoices} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />

            {/* Pro tip card */}
            <ProTip />
          </div>
        </div>
      </div>
    </>
  );
}
