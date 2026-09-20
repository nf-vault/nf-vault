package org.nfVault.shared.exceptions;

public class ExpiredException extends RuntimeException {
    public ExpiredException(String message) {
        super(message);
    }
    public ExpiredException() {
        super("Expired");
    };
}
