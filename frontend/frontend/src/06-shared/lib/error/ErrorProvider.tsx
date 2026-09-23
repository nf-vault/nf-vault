import { createContext, useState, useCallback, ReactNode } from "react";
import ErrorPopup from "@/06-shared/ui/notifyPopup";

type ErrorContext = {
    showError: (text: string, duration?: number) => void
}
type props = {
    children: ReactNode
}

const ErrorProvider = (
    {
        children
    }: props
) => {
    const [errorText, setErrorText] = useState<string | null>(null);
    const [errorDuration, setErrorDuration] = useState<number>(5000);

    const showError = useCallback((text: string, duration = 5000) => {
        setErrorText(text);
        setErrorDuration(duration);
    }, []);

    const handleClose = () => setErrorText(null);

    return (
        <_ErrorContext.Provider value={{ showError }}>
            {children}
            {errorText && (
                <ErrorPopup text={errorText} onClose={handleClose} duration={errorDuration} />
            )}
        </_ErrorContext.Provider>
    );
};

export default ErrorProvider;
export const _ErrorContext = createContext<ErrorContext | undefined>(undefined);
