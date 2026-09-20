package org.caption;

public record Padding(int top, int right, int bottom, int left) {
    public Padding(int padding) {
        this(padding, padding, padding, padding);
    }
}
