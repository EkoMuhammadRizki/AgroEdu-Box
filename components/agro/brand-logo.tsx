import Image from "next/image";

/** Ikon logo (lingkaran daun + huruf A) untuk slot kecil. Ukuran diatur lewat className. */
export function BrandIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <Image
      src="/logo/agro-edu-box-icon.png"
      alt="Logo Agro-Edu Box"
      width={256}
      height={256}
      className={`object-contain ${className}`}
    />
  );
}

/** Logo lengkap dengan tulisan dan tagline, hanya untuk area yang cukup lebar. */
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo/agro-edu-box-full.png"
      alt="Agro Edu Box: Belajar Sains, Bertani, Berwirausaha"
      width={921}
      height={617}
      priority
      className={`h-auto ${className}`}
    />
  );
}
