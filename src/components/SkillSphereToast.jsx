import { toast } from "sonner";

export const successToast = (message) => {
  toast.success(message, {
    action: {
      label: 'OK',
    },
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    action: {
      label: 'Dismiss',
      onClick: () => toast.dismiss(),
    },
  });
};