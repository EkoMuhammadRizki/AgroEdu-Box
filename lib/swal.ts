import Swal, { SweetAlertIcon } from "sweetalert2";

// AgroEdu Box custom SweetAlert presets
export const AgroSwal = Swal.mixin({
  customClass: {
    popup: "rounded-2xl border border-line shadow-2xl p-5 font-sans bg-surface text-ink",
    title: "text-lg font-bold text-ink mb-1",
    htmlContainer: "text-xs text-ink-muted leading-relaxed",
    confirmButton: "swal-btn-siswa",
    cancelButton: "swal-btn-cancel",
    denyButton: "swal-btn-danger",
  },
  buttonsStyling: false,
});

export const showSuccessAlert = async (title: string, text?: string, timer = 1600) => {
  return AgroSwal.fire({
    icon: "success",
    title,
    text,
    timer,
    timerProgressBar: true,
    showConfirmButton: timer ? false : true,
    confirmButtonText: "Selesai",
    customClass: {
      confirmButton: "swal-btn-siswa",
    },
  });
};

export const showErrorAlert = async (title: string, text?: string) => {
  return AgroSwal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Tutup",
    customClass: {
      confirmButton: "swal-btn-danger",
    },
  });
};

export const showWarningAlert = async (title: string, text?: string) => {
  return AgroSwal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "Mengerti",
    customClass: {
      confirmButton: "swal-btn-siswa",
    },
  });
};

export const showConfirmDialog = async ({
  title,
  text,
  icon = "question",
  confirmButtonText = "Ya, Lanjutkan",
  cancelButtonText = "Batal",
  isDanger = false,
  role = "siswa",
}: {
  title: string;
  text: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDanger?: boolean;
  role?: "siswa" | "guru";
}) => {
  const confirmClass = isDanger
    ? "swal-btn-danger"
    : role === "guru"
    ? "swal-btn-guru"
    : "swal-btn-siswa";

  return AgroSwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup: "rounded-2xl border border-line shadow-2xl p-5 font-sans bg-surface text-ink",
      title: "text-lg font-bold text-ink mb-1",
      htmlContainer: "text-xs text-ink-muted leading-relaxed",
      confirmButton: confirmClass,
      cancelButton: "swal-btn-cancel",
    },
  });
};

export const showToast = (title: string, icon: SweetAlertIcon = "success", timer = 2000) => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    icon,
    title,
    customClass: {
      popup: "rounded-xl border border-line shadow-lg font-sans text-xs bg-surface text-ink p-3",
    },
  });
};

export default Swal;
