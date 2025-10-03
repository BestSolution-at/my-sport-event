package at.mspe.server.service.jpa;

import java.util.UUID;
import java.util.function.Function;

import at.mspe.server.service.NotFoundException;

public class Utils {
    private static final String STALE_TEMPLATE = "%s(%s) is stale. Expected version was %s, got %s";
    private static final String NOT_FOUND_TEMPLATE = "%s(%s) not found";

    public static UUID parseUUID(String value, Function<String, String> errorMessage) {
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException e) {
            throw new NotFoundException(errorMessage.apply(value));
        }
    }

    public static String createStaleMessage(String objectType, String key, Long entityVersion, Long serviceVersion) {
        return STALE_TEMPLATE.formatted(objectType, key, entityVersion, serviceVersion);
    }

    public static String createNotFound(String objectType, String key) {
        return NOT_FOUND_TEMPLATE.formatted(objectType, key);
    }

    public static Function<String, String> createNotFound(String objectType) {
        return key -> createNotFound(objectType, key);
    }
}
