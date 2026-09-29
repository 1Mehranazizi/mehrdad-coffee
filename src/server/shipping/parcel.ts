/**
 * Builds the parcel description we send to Postex from the cart.
 * Variant weights are stored in grams (250 / 500 / 1000).
 */

const PACKAGING_GRAMS = 150; // box + filler for one order

export type Parcel = {
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  valueToman: number;
};

export function buildParcel(
  items: { weight: string; quantity: number; unitPrice: number }[]
): Parcel {
  const goodsGrams = items.reduce(
    (sum, i) => sum + (parseInt(i.weight, 10) || 250) * i.quantity,
    0
  );
  const weightGrams = goodsGrams + PACKAGING_GRAMS;
  const valueToman = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // Rough box size that grows with the order (roasted-coffee bags are bulky, not dense).
  let box: [number, number, number];
  if (weightGrams <= 500) box = [22, 15, 8];
  else if (weightGrams <= 1000) box = [26, 18, 12];
  else if (weightGrams <= 2500) box = [32, 24, 16];
  else if (weightGrams <= 5000) box = [40, 30, 22];
  else box = [50, 40, 30];

  return {
    weightGrams,
    lengthCm: box[0],
    widthCm: box[1],
    heightCm: box[2],
    valueToman,
  };
}
