"use client";

import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
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
        <Button
          color="primary"
          variant="solid"
          size="sm"
          radius="lg"
          onPress={addItem}
        >
          <span className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter une ligne
          </span>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-zinc-400 border border-dashed border-zinc-700 rounded-xl">
          <p>Aucune ligne ajoutée</p>
          <Button
            color="primary"
            variant="solid"
            size="sm"
            radius="lg"
            className="mt-2"
            onPress={addItem}
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter la première ligne
            </span>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            aria-label="Line items"
            removeWrapper
            className="min-w-full"
          >
            <TableHeader>
              <TableColumn className="w-2/5">Description</TableColumn>
              <TableColumn className="w-1/6">Quantité</TableColumn>
              <TableColumn className="w-1/6">Prix unitaire</TableColumn>
              <TableColumn className="w-1/6">Montant</TableColumn>
              <TableColumn className="w-16"></TableColumn>
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
                      variant="bordered"
                      size="sm"
                      radius="lg"
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
                      variant="bordered"
                      size="sm"
                      radius="lg"
                    />
                  </TableCell>
                  <TableCell>
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
                      variant="bordered"
                      size="sm"
                      radius="lg"
                      startContent={
                        <span className="text-zinc-400 text-sm">€</span>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(calculateAmount(item), currency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="bordered"
                      size="sm"
                      radius="lg"
                      onPress={() => removeItem(index)}
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
