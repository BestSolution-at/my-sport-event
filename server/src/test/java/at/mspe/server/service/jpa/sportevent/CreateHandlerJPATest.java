package at.mspe.server.service.jpa.sportevent;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.ZonedDateTime;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.InvalidDataException;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class CreateHandlerJPATest extends SportEventHandlerTest<CreateHandlerJPA> {

    @Inject
    public CreateHandlerJPATest(CreateHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void simple() {
        var date = ZonedDateTime.parse("2000-01-01T10:00:00Z");
        var name = "Simple New Event";
        var dto = newBuilder()
                .date(date)
                .name(name)
                .build();
        var key = handler.create(builderFactory, dto);
        assertNotNull(key);
        var entity = getSportEventEntity(key);
        assertEquals(entity.key.toString(), key);
        assertEquals(entity.name, name);
        assertEquals(entity.date, date);
    }

    @Test
    public void emptyName() {
        var dto = newBuilder()
                .date(ZonedDateTime.parse("2020-01-01T10:00:00Z"))
                .name("")
                .build();
        assertThrows(InvalidDataException.class, () -> handler.create(builderFactory, dto));
    }
}
