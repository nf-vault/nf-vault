import { useContext } from "react";
import { _ErrorContext } from "./ErrorProvider";

const useError = () => {
    const context = useContext(_ErrorContext);
    if (!context) {
        throw new Error("Check ErrorProvider existance");
    }
    return context;
};

export default useError;
