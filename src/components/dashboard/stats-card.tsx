"use client";

import { Card, CardBody } from "@heroui/react";
import { cn } from "@/lib/utils";
import { FileText, Euro, Clock, AlertCircle } from "lucide-react";

const icons = {
  FileText,
  Euro,
  Clock,
  AlertCircle,
};

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof icons;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "success" | "warning" | "danger";
}

export function StatsCard({
  title,
  value,
  iconName,
  trend,
  color = "primary",
}: StatsCardProps) {
  const Icon = icons[iconName];

  const colorClasses = {
    primary: "bg-primary-500/20 text-primary-400",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-amber-500/20 text-amber-400",
    danger: "bg-red-500/20 text-red-400",
  };

  return (
    <Card className="glass border border-zinc-800 hover:border-primary-500/30 transition-all" radius="lg">
      <CardBody className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-zinc-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <p
                className={cn(
                  "text-xs mt-2",
                  trend.isPositive ? "text-green-400" : "text-red-400"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}% vs mois dernier
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
