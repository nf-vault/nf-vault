package org.utils.image;

import java.util.LinkedHashMap;

public class LRUCache<K,V> extends LinkedHashMap<K,V> {
    private final int maxCapacity;

    public LRUCache(int capacity) {
        super(capacity + 1, 1.0f, true);
        this.maxCapacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(java.util.Map.Entry<K, V> eldest) {
        return size() > maxCapacity;
    }
}
