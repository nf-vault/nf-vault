import useError from "@/06-shared/lib/error/useError";

const extractErrorMessage = (error: unknown): string | null => {
  if (!error) {
    return null;
  }

  if (typeof error === "string") {
    return error.trim() || null;
  }

  if (error instanceof Error) {
    const message = error.message?.trim();
    if (!message) {
      return null;
    }

    try {
      const parsed = JSON.parse(message);
      return parsed.message.trim() ?? null
    } catch {
      // fall back to the plain message below
    }

    return message;
  }

  return null;
};

export const useNotifyError = () => {
  const { showError } = useError();

  return (error: unknown) => {
    const message = extractErrorMessage(error);
    if (message) {
      showError(message);
    }
  };
};