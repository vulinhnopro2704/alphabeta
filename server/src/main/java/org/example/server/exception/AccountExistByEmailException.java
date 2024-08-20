package org.example.server.exception;

public class AccountExistByEmailException extends RuntimeException {
    public AccountExistByEmailException(String message) {
        super(message);
    }
}
