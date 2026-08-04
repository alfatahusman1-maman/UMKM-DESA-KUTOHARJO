import { describe, it, expect } from "vitest";
import { formatRupiah, buildWhatsAppLink } from "../lib/utils";

describe("Frontend Utility Functions Unit Tests", () => {
  it("formatRupiah - should format numbers into IDR currency format", () => {
    const result = formatRupiah(50000);
    // Standard IDR format replaces digits with Rp 50.000 or Rp50.000
    expect(result).toContain("50");
    expect(result).toMatch(/Rp\s?50\.000/);
  });

  it("buildWhatsAppLink - should clean non-numeric characters and format wa.me link", () => {
    const link = buildWhatsAppLink("+62 812-3456-7890", "Bandeng Presto");
    expect(link).toContain("https://wa.me/6281234567890");
    expect(link).toContain(encodeURIComponent("Bandeng Presto"));
  });

  it("buildWhatsAppLink - should handle custom message", () => {
    const link = buildWhatsAppLink("081234567890", undefined, "Halo Admin");
    expect(link).toContain("https://wa.me/081234567890");
    expect(link).toContain(encodeURIComponent("Halo Admin"));
  });
});
