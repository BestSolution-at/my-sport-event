package at.mspe.server.service.jpa.cohort;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
public class DeleteHandlerJPATest extends CohortHandlerTest<DeleteHandlerJPA> {

    @Inject
    public DeleteHandlerJPATest(DeleteHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void deleteNoReferencedNoVersion() {
        handler.delete(builderFactory, FullEventKey, FullEvent_GenericCohortNotReferencedKey, OptionalLong.empty());
        assertNull(getCohortEntity(FullEvent_GenericCohortNotReferencedKey));
    }

    @Test
    public void deleteNoReferencedVersion() {
        handler.delete(builderFactory, FullEventKey, FullEvent_GenericCohortNotReferencedKey, OptionalLong.of(0l));
        assertNull(getCohortEntity(FullEvent_GenericCohortNotReferencedKey));
    }

    @Test
    public void deleteNoReferencedInvalidVersion() {
        assertThrows(StaleDataException.class,
                () -> handler.delete(builderFactory, FullEventKey, FullEvent_GenericCohortNotReferencedKey,
                        OptionalLong.of(1l)));
    }

    @Test
    public void deleteUnknownEventKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, UUID.randomUUID().toString(),
                        FullEvent_GenericCohortNotReferencedKey, OptionalLong.empty()));
    }

    @Test
    public void deleteUnknownCohortKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, FullEventKey, UUID.randomUUID().toString(), OptionalLong.empty()));
    }

    @Test
    public void deleteInvalidEventKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, "abcd",
                        FullEvent_GenericCohortNotReferencedKey, OptionalLong.empty()));
    }

    @Test
    public void deleteInvalidCohortKey() {
        assertThrows(NotFoundException.class,
                () -> handler.delete(builderFactory, FullEventKey, "abcd", OptionalLong.empty()));
    }

    @Test
    public void deleteReferencedCohort() {
        assertEquals(FullEvent_GenericCohortKey,
                getParticipantEntity(FullEvent_ParticpantWithGenericCohortKey).cohort.key().toString());
        handler.delete(builderFactory, FullEventKey, FullEvent_GenericCohortKey, OptionalLong.empty());
        assertNull(getCohortEntity(FullEvent_GenericCohortKey));
        assertNull(getParticipantEntity(FullEvent_ParticpantWithGenericCohortKey).cohort);
    }
}
