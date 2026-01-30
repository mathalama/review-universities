package dev.mathalama.backend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class RateLimitingService {

    private final Map<String, BucketWrapper> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String key) {
        return buckets.compute(key, (k, v) -> {
            if (v == null) {
                return new BucketWrapper(newBucket(), System.currentTimeMillis());
            }
            v.lastAccessed = System.currentTimeMillis();
            return v;
        }).bucket;
    }

    private Bucket newBucket() {
        // Limit: 5 requests per 10 minutes per IP
        return Bucket.builder()
                .addLimit(Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(10))))
                .build();
    }

    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupBuckets() {
        long now = System.currentTimeMillis();
        int sizeBefore = buckets.size();
        buckets.entrySet().removeIf(entry -> (now - entry.getValue().lastAccessed) > 3600000); // Remove if older than 1 hour
        log.info("Rate limit cleanup: Removed {} old entries. Current size: {}", sizeBefore - buckets.size(), buckets.size());
    }

    private static class BucketWrapper {
        final Bucket bucket;
        long lastAccessed;

        BucketWrapper(Bucket bucket, long lastAccessed) {
            this.bucket = bucket;
            this.lastAccessed = lastAccessed;
        }
    }
}
