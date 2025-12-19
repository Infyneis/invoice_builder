"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceItemFormData } from "@/types/invoice";

interface LineItemsProps {
  items: InvoiceItemFormData[];
  onChange: (items: InvoiceItemFormData[]) => void;
  currency?: string;
}

export function LineItems({
  items,
  onChange,
  currency = "EUR",
}: LineItemsProps) {
  const addItem = () => {
    onChange([
      ...items,
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        unit: "unité",
        order: items.length,
      },
    ]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItemFormData,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    onChange(newItems);
  };

  const calculateAmount = (item: InvoiceItemFormData) => {
    return item.quantity * item.unitPrice;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Lignes de facture</h3>
        <Button size="sm" onClick={addItem}>
          <Plus className="w-4 h-4" />
          Ajouter une ligne
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-zinc-400 border border-dashed border-zinc-700 rounded-xl">
          <p>Aucune ligne ajoutée</p>
          <Button size="sm" className="mt-2" onClick={addItem}>
            <Plus className="w-4 h-4" />
            Ajouter la première ligne
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">Description</TableHead>
                <TableHead className="w-1/6">Quantité</TableHead>
                <TableHead className="w-1/6">Prix unitaire</TableHead>
                <TableHead className="w-1/6">Montant</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder="Description du service ou produit"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity.toString()}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min={0}
                      step={0.01}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">€</span>
                      <Input
                        type="number"
                        value={item.unitPrice.toString()}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min={0}
                        step={0.01}
                        className="pl-7"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(calculateAmount(item), currency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
