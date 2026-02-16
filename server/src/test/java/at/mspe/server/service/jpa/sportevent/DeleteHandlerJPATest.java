package at.mspe.server.service.jpa.sportevent;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.OptionalLong;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.StaleDataException;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class DeleteHandlerJPATest extends SportEventHandlerTest<DeleteHandlerJPA> {
    @Inject
    public DeleteHandlerJPATest(DeleteHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void deleteEmptyEvent_NoVersion() {
        handler.delete(builderFactory, SimpleEmptyEventKey, OptionalLong.empty());
        assertNull(getSportEventEntity(SimpleEmptyEventKey));
    }

    @Test
    public void deleteEmptyEvent_Version() {
        handler.delete(builderFactory, SimpleEmptyEventKey, OptionalLong.of(0L));
        assertNull(getSportEventEntity(SimpleEmptyEventKey));
    }

    @Test
    public void deleteEmptyEvent_Stale() {
        assertThrows(StaleDataException.class,
                () -> handler.delete(builderFactory, SimpleEmptyEventKey, OptionalLong.of(1L)));
    }

    @Test
    public void deleteUnknownKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, UUID.randomUUID().toString(), OptionalLong.of(0L)));
    }

    @Test
    public void deleteInvalidKey() {
        assertThrows(NotFoundException.class, () -> handler.delete(builderFactory, "abcd", OptionalLong.of(0L)));
    }

    @Test
    public void deleteFullEvent() {
        handler.delete(builderFactory, FullEventKey, OptionalLong.of(0L));
        assertNull(getSportEventEntity(FullEventKey));
        assertNull(getCohortEntity(FullEvent_GenericCohortKey));
        assertNull(getCohortEntity(FullEvent_BirthyearCohortKey));
    }

}
