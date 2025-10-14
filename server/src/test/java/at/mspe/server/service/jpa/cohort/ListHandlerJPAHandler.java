package at.mspe.server.service.jpa.cohort;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.model.BirthyearCohort;
import at.mspe.server.service.model.GenericCohort;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class ListHandlerJPAHandler extends CohortHandlerTest<ListHandlerJPA> {
    @Inject
    public ListHandlerJPAHandler(ListHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void success() {
        var result = handler.list(builderFactory, FullEventKey);
        assertNotNull(result);
        assertEquals(3, result.size());

        var genericCohortOpt = result.stream().filter(c -> c.key().equals(FullEvent_GenericCohortKey)).findFirst();
        var birthyearCohortOpt = result.stream().filter(c -> c.key().equals(FullEvent_BirthyearCohortKey)).findFirst();

        assertTrue(genericCohortOpt::isPresent);
        assertTrue(birthyearCohortOpt::isPresent);

        var genericCohort = genericCohortOpt.get();
        var birthyearCohort = birthyearCohortOpt.get();

        assertInstanceOf(GenericCohort.Data.class, genericCohort);
        assertInstanceOf(BirthyearCohort.Data.class, birthyearCohort);
    }

    @Test
    public void emptySuccess() {
        var result = handler.list(builderFactory, SimpleEmptyEventKey);
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    @Test
    public void unknownEventKey() {
        assertThrows(NotFoundException.class, () -> handler.list(builderFactory, UUID.randomUUID().toString()));
    }

    @Test
    public void invalidEventKey() {
        assertThrows(NotFoundException.class, () -> handler.list(builderFactory, "abcd"));
    }
}
