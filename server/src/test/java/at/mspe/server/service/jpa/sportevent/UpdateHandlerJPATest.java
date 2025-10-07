package at.mspe.server.service.jpa.sportevent;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.ZonedDateTime;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.StaleDataException;
import at.mspe.server.service.model.SportEvent;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class UpdateHandlerJPATest extends SportEventHandlerTest<UpdateHandlerJPA> {
    @Inject
    public UpdateHandlerJPATest(UpdateHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void testSuccess() {
        var patch = builderFactory.builder(SportEvent.PatchBuilder.class)
                .key(SimpleEmptyEventKey)
                .version(0)
                .date(ZonedDateTime.parse("1999-01-01T10:00:00Z"))
                .name("Update event")
                .build();
        var result = handler.update(builderFactory, SimpleEmptyEventKey, patch);
        assertEquals(SimpleEmptyEventKey, result.key());
        assertEquals(1l, result.version());

        var event = getSportEventEntity(SimpleEmptyEventKey);
        assertEquals("Update event", event.name());
        assertEquals(ZonedDateTime.parse("1999-01-01T10:00:00Z"), event.date());
    }

    @Test
    public void keyMismatch() {
        var patch = builderFactory.builder(SportEvent.PatchBuilder.class)
                .key(SimpleEmptyEventKey)
                .version(0)
                .date(ZonedDateTime.parse("1999-01-01T10:00:00Z"))
                .name("Update event")
                .build();
        assertThrows(InvalidDataException.class, () -> handler.update(builderFactory, FullEventKey, patch));
    }

    @Test
    public void versionMismatch() {
        var patch = builderFactory.builder(SportEvent.PatchBuilder.class)
                .key(SimpleEmptyEventKey)
                .version(1)
                .date(ZonedDateTime.parse("1999-01-01T10:00:00Z"))
                .name("Update event")
                .build();
        assertThrows(StaleDataException.class, () -> handler.update(builderFactory, SimpleEmptyEventKey, patch));
    }

    @Test
    public void emptyName() {
        var patch = builderFactory.builder(SportEvent.PatchBuilder.class)
                .key(SimpleEmptyEventKey)
                .version(0)
                .date(ZonedDateTime.parse("1999-01-01T10:00:00Z"))
                .name("")
                .build();
        assertThrows(InvalidDataException.class, () -> handler.update(builderFactory, SimpleEmptyEventKey, patch));
    }
}
