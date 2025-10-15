package at.mspe.server.service.jpa.participant;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.StaleDataException;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class DeleteHandlerJPATest extends ParticipantHandlerTest<DeleteHandlerJPA> {

    public DeleteHandlerJPATest(DeleteHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void delete_NoVersion() {
        handler.delete(builderFactory, FullEventKey, FullEvent_ParticpantKey, null);
    }

    @Test
    public void delete_Version() {
        handler.delete(builderFactory, FullEventKey, FullEvent_ParticpantKey, 0L);
    }

    @Test
    void delete_Stale() {
        assertThrows(StaleDataException.class,
                () -> handler.delete(builderFactory, FullEventKey, FullEvent_ParticpantKey, 1L));
    }

    @Test
    void delete_UnknownEventId() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, UUID.randomUUID().toString(), FullEvent_ParticpantKey, 0L));
    }

    @Test
    void delete_InvalidEventId() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, "abcd", FullEvent_ParticpantKey, 0L));
    }

    @Test
    void delete_UnknownParticipantId() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, FullEventKey, UUID.randomUUID().toString(), 0L));
    }

    @Test
    void delete_InvalidParticipantId() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, FullEventKey, "abcd", 0L));
    }
}
