package at.mspe.server.service.jpa.sportevent;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.ZonedDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.NotFoundException;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class GetHandlerJPATest extends SportEventHandlerTest<GetHandlerJPA> {
    @Inject
    public GetHandlerJPATest(GetHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void testSuccess() {
        var dto = handler.get(builderFactory, SimpleEmptyEventKey);
        assertNotNull(dto);
        assertEquals("Simple Event", dto.name());
        assertEquals(ZonedDateTime.parse("2000-01-01T10:00:00Z"), dto.date());
    }

    @Test
    public void testUnknownKey() {
        assertThrows(NotFoundException.class, () -> handler.get(builderFactory, UUID.randomUUID().toString()));
    }

    @Test
    public void testNoneUUIDKey() {
        assertThrows(NotFoundException.class, () -> handler.get(builderFactory, "abcd"));
    }
}
