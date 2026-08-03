export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const DEFAULT_WA_MESSAGE =
  process.env.NEXT_PUBLIC_WA_DEFAULT_MESSAGE ??
  "Halo, saya ingin bertanya tentang produk di Kutoharjo UMKM Hub";

/**
 * Builds a wa.me deep link with a prefilled message.
 * `umkmName` is appended to the default template when provided,
 * unless a custom `message` is passed in.
 */
export function buildWhatsAppLink(phoneNumber: string, umkmName?: string, message?: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const text = message ?? (umkmName ? `${DEFAULT_WA_MESSAGE} "${umkmName}".` : DEFAULT_WA_MESSAGE);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
