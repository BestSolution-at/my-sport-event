package at.mspe.server.service.jpa.sportevent;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.ZonedDateTime;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class ListHandlerJPATest extends SportEventHandlerTest<ListHandlerJPA> {
    @Inject
    public ListHandlerJPATest(ListHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void allEvents() {
        var result = handler.list(builderFactory);
        assertNotEquals(0, result.size());

        var simpleOpt = result.stream()
                .filter(e -> e.key().toString().equals(SimpleEmptyEventKey))
                .findFirst();
        var fullOpt = result.stream()
                .filter(e -> e.key().toString().equals(FullEventKey))
                .findFirst();
        assertTrue(simpleOpt::isPresent);
        assertTrue(fullOpt::isPresent);

        var simple = simpleOpt.get();
        assertEquals("Simple Event", simple.name());
        assertEquals(ZonedDateTime.parse("2000-01-01T10:00:00Z"), simple.date());

        var full = fullOpt.get();
        assertEquals("Simple Full Event", full.name());
        assertEquals(ZonedDateTime.parse("2000-01-02T10:00:00Z"), full.date());
        assertEquals(3, full.participantCount());
    }
}
