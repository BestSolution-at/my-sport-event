package at.mspe.server.service.jpa.cohort;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.model.BirthyearCohort;
import at.mspe.server.service.model.GenericCohort;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class GetHandlerJPATest extends CohortHandlerTest<GetHandlerJPA> {

    @Inject
    public GetHandlerJPATest(GetHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void testGenericCohort() {
        var dto = handler.get(builderFactory, FullEventKey, FullEvent_GenericCohortKey);
        assertInstanceOf(GenericCohort.Data.class, dto);
        assertEquals(FullEvent_GenericCohortKey, dto.key());
        assertEquals("Generic Cohort", dto.name());
    }

    @Test
    public void testBirthyearCohort() {
        var dto = handler.get(builderFactory, FullEventKey, FullEvent_BirthyearCohortKey);
        assertInstanceOf(BirthyearCohort.Data.class, dto);
        var bdto = (BirthyearCohort.Data) dto;
        assertEquals(FullEvent_BirthyearCohortKey, bdto.key());
        assertEquals("Birthyear Cohort", bdto.name());
        assertEquals(1970, bdto.min());
        assertEquals(1980, bdto.max());
    }

    @Test
    public void testEventKeyMismatch() {
        assertThrows(NotFoundException.class,
                () -> handler.get(builderFactory, SimpleEmptyEventKey, FullEvent_BirthyearCohortKey));
    }

    @Test
    public void testUnknownEventKey() {
        assertThrows(NotFoundException.class,
                () -> handler.get(builderFactory, UUID.randomUUID().toString(), FullEvent_BirthyearCohortKey));
    }

    @Test
    public void testUnknownCohortKey() {
        assertThrows(NotFoundException.class,
                () -> handler.get(builderFactory, FullEventKey, UUID.randomUUID().toString()));
    }

    @Test
    public void testInvalidEventKey() {
        assertThrows(NotFoundException.class,
                () -> handler.get(builderFactory, "abcd", FullEvent_BirthyearCohortKey));
    }

    @Test
    public void testInvalidCohortKey() {
        assertThrows(NotFoundException.class,
                () -> handler.get(builderFactory, FullEventKey, "abcd"));
    }
}
