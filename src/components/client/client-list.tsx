"use client";

import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Plus, Users, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import type { Client } from "@/types/invoice";

interface ClientListProps {
  clients: Client[];
}

export function ClientList({ clients }: ClientListProps) {
  return (
    <Card className="glass border border-zinc-800" radius="lg">
      <CardBody className="p-0">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Users className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg mb-2">Aucun client</p>
            <p className="text-sm mb-4">
              Ajoutez votre premier client pour créer des factures
            </p>
            <Button
              as={Link}
              href="/clients/new"
              color="primary"
              variant="shadow"
              radius="full"
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter un client
              </span>
            </Button>
          </div>
        ) : (
          <Table aria-label="Clients" removeWrapper>
            <TableHeader>
              <TableColumn>Nom</TableColumn>
              <TableColumn>Contact</TableColumn>
              <TableColumn>Adresse</TableColumn>
              <TableColumn>Entreprise</TableColumn>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-zinc-800/50">
                  <TableCell>
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-primary-400 hover:underline font-medium"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {client.city}, {client.country}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.companyName || (
                      <span className="text-zinc-500">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
