import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type Address = {
  id: string;
  customerId: string;
  title: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string | null;
  receiverName: string;
  receiverPhone: string;
  isDefault: boolean;
  createdAt: string;
};

type AddressRow = {
  id: string;
  customer_id: string;
  title: string;
  province: string;
  city: string;
  address_line: string;
  postal_code: string | null;
  receiver_name: string;
  receiver_phone: string;
  is_default: number;
  created_at: string;
};

function mapRow(row: AddressRow): Address {
  return {
    id: row.id,
    customerId: row.customer_id,
    title: row.title,
    province: row.province,
    city: row.city,
    addressLine: row.address_line,
    postalCode: row.postal_code,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
  };
}

export function listAddressesByCustomer(customerId: string): Address[] {
  const rows = db
    .prepare(
      "SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC"
    )
    .all(customerId) as AddressRow[];
  return rows.map(mapRow);
}

export function getAddressById(id: string): Address | undefined {
  const row = db.prepare("SELECT * FROM addresses WHERE id = ?").get(id) as
    | AddressRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function createAddress(input: {
  customerId: string;
  title: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode?: string;
  receiverName: string;
  receiverPhone: string;
  isDefault?: boolean;
}): Address {
  const id = newId("addr");
  if (input.isDefault) {
    db.prepare("UPDATE addresses SET is_default = 0 WHERE customer_id = ?").run(
      input.customerId
    );
  }
  db.prepare(
    `INSERT INTO addresses (id, customer_id, title, province, city, address_line, postal_code, receiver_name, receiver_phone, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.customerId,
    input.title,
    input.province,
    input.city,
    input.addressLine,
    input.postalCode ?? null,
    input.receiverName,
    input.receiverPhone,
    input.isDefault ? 1 : 0
  );
  return getAddressById(id)!;
}

export function updateAddress(
  id: string,
  input: {
    title: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode?: string;
    receiverName: string;
    receiverPhone: string;
    isDefault?: boolean;
  }
): void {
  const address = getAddressById(id);
  if (!address) return;
  if (input.isDefault) {
    db.prepare("UPDATE addresses SET is_default = 0 WHERE customer_id = ?").run(
      address.customerId
    );
  }
  db.prepare(
    `UPDATE addresses SET title = ?, province = ?, city = ?, address_line = ?, postal_code = ?, receiver_name = ?, receiver_phone = ?, is_default = ?
     WHERE id = ?`
  ).run(
    input.title,
    input.province,
    input.city,
    input.addressLine,
    input.postalCode ?? null,
    input.receiverName,
    input.receiverPhone,
    input.isDefault ? 1 : 0,
    id
  );
}

export function deleteAddress(id: string): void {
  db.prepare("DELETE FROM addresses WHERE id = ?").run(id);
}
