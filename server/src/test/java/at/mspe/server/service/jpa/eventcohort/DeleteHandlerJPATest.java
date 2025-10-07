package at.mspe.server.service.jpa.eventcohort;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.StaleDataException;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class DeleteHandlerJPATest extends CohortHandlerTest<DeleteHandlerJPA> {

    @Inject
    public DeleteHandlerJPATest(DeleteHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void deleteNoReferencedNoVersion() {
        handler.delete(builderFactory, FullEventKey, FullEvent_GenericCohortNotReferencedKey, null);
        assertNull(getCohortEntity(FullEvent_GenericCohortNotReferencedKey));
    }

    @Test
    public void deleteNoReferencedVersion() {
        handler.delete(builderFactory, FullEventKey, FullEvent_GenericCohortNotReferencedKey, 0l);
        assertNull(getCohortEntity(FullEvent_GenericCohortNotReferencedKey));
    }

    @Test
    public void deleteNoReferencedInvalidVersion() {
        assertThrows(StaleDataException.class,
                () -> handler.delete(builderFactory, FullEventKey, FullEvent_GenericCohortNotReferencedKey, 1l));
    }

    @Test
    public void deleteUnknownEventKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, UUID.randomUUID().toString(),
                        FullEvent_GenericCohortNotReferencedKey, null));
    }

    @Test
    public void deleteUnknownCohortKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, FullEventKey, UUID.randomUUID().toString(), null));
    }

    @Test
    public void deleteInvalidEventKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, "abcd",
                        FullEvent_GenericCohortNotReferencedKey, null));
    }

    @Test
    public void deleteInvalidCohortKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, FullEventKey, "abcd", null));
    }

    @Test
    public void deleteReferencedCohort() {
        assertEquals(FullEvent_GenericCohortKey,
                getParticipantEntity(FullEvent_ParticpantWithGenericCohortKey).cohort.key().toString());
        handler.delete(builderFactory, FullEventKey, FullEvent_GenericCohortKey, null);
        assertNull(getCohortEntity(FullEvent_GenericCohortKey));
        assertNull(getParticipantEntity(FullEvent_ParticpantWithGenericCohortKey).cohort);
    }
}
