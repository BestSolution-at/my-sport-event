package at.mspe.server.service.jpa.cohort;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.model.cohort.GenericCohortEntity;
import at.mspe.server.service.model.BirthyearCohort;
import at.mspe.server.service.model.GenericCohort;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class UpdateHandlerJPATest extends CohortHandlerTest<UpdateHandlerJPA> {

    @Inject
    public UpdateHandlerJPATest(UpdateHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void updateGeneric() {
        var patch = builderFactory.builder(GenericCohort.PatchBuilder.class)
                .key(FullEvent_GenericCohortKey)
                .version(0)
                .name("Updated")
                .build();
        var result = handler.update(builderFactory, FullEventKey, FullEvent_GenericCohortKey, patch);
        assertNotNull(result);
        assertEquals(FullEvent_GenericCohortKey, result.key());
        assertEquals(1l, result.version());

        var event = getCohortEntity(FullEvent_GenericCohortKey);
        assertInstanceOf(GenericCohortEntity.class, event);
        assertEquals(FullEvent_GenericCohortKey, event.key().toString());
        assertEquals("Updated", event.name());
    }

    @Test
    public void updateBirthyear() {
        var patch = builderFactory.builder(BirthyearCohort.PatchBuilder.class)
                .key(FullEvent_BirthyearCohortKey)
                .version(0)
                .name("Updated")
                .min(1990)
                .max(2000)
                .build();
        var result = handler.update(builderFactory, FullEventKey, FullEvent_BirthyearCohortKey, patch);
        assertNotNull(result);
        assertEquals(FullEvent_BirthyearCohortKey, result.key());
        assertEquals(1l, result.version());

        var event = getCohortEntity(FullEvent_BirthyearCohortKey);
        assertInstanceOf(BirthyearCohortEntity.class, event);
        assertEquals(FullEvent_BirthyearCohortKey, event.key().toString());
        assertEquals("Updated", event.name());
    }

    @Test
    public void updateTypeMismatch_GenericOnBirthyear() {
        var patch = builderFactory.builder(GenericCohort.PatchBuilder.class)
                .key(FullEvent_BirthyearCohortKey)
                .version(0)
                .name("Updated")
                .build();
        assertThrows(InvalidDataException.class,
                () -> handler.update(builderFactory, FullEventKey, FullEvent_BirthyearCohortKey, patch));
    }

    @Test
    public void updateTypeMismatch_BirthyearOnGeneric() {
        var patch = builderFactory.builder(BirthyearCohort.PatchBuilder.class)
                .key(FullEvent_GenericCohortKey)
                .version(0)
                .name("Updated")
                .min(1990)
                .max(2000)
                .build();
        assertThrows(InvalidDataException.class,
                () -> handler.update(builderFactory, FullEventKey, FullEvent_GenericCohortKey, patch));
    }
}
