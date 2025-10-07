package at.mspe.server.service.jpa.eventcohort;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.jpa.model.cohort.BirthyearCohortEntity;
import at.mspe.server.service.jpa.model.cohort.GenericCohortEntity;
import at.mspe.server.service.model.BirthyearCohortNew;
import at.mspe.server.service.model.GenericCohortNew;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class CreateHandlerJPATest extends CohortHandlerTest<CreateHandlerJPA> {

    @Inject
    public CreateHandlerJPATest(CreateHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void createGeneric() {
        var dto = builderFactory.builder(GenericCohortNew.DataBuilder.class)
                .name("New Generic Cohort")
                .build();
        var key = handler.create(builderFactory, SimpleEmptyEventKey, dto);
        assertNotNull(key);
        var entity = getCohortEntity(key);
        assertEquals(key, entity.key().toString());
        assertInstanceOf(GenericCohortEntity.class, entity);
        assertEquals("New Generic Cohort", entity.name());
    }

    @Test
    public void failGenericEmptyName() {
        var dto = builderFactory.builder(GenericCohortNew.DataBuilder.class)
                .name("")
                .build();
        assertThrows(InvalidDataException.class, () -> handler.create(builderFactory, SimpleEmptyEventKey, dto));
    }

    @Test
    public void createBirthyear() {
        var dto = builderFactory.builder(BirthyearCohortNew.DataBuilder.class)
                .name("New Birthyear Cohort")
                .min(1980)
                .max(1981)
                .build();
        var key = handler.create(builderFactory, SimpleEmptyEventKey, dto);
        assertNotNull(key);
        var entity = getCohortEntity(key);
        assertEquals(key, entity.key().toString());
        assertInstanceOf(BirthyearCohortEntity.class, entity);
        var bEntity = (BirthyearCohortEntity) entity;
        assertEquals("New Birthyear Cohort", bEntity.name());
        assertEquals(1980, bEntity.min());
        assertEquals(1981, bEntity.max());
    }

    @Test
    public void failBirthyearEmptyName() {
        var dto = builderFactory.builder(BirthyearCohortNew.DataBuilder.class)
                .name("")
                .min(1980)
                .max(1981)
                .build();
        assertThrows(InvalidDataException.class, () -> handler.create(builderFactory, SimpleEmptyEventKey, dto));
    }

    @Test
    public void failBirthyearInvalidMin() {
        var dto = builderFactory.builder(BirthyearCohortNew.DataBuilder.class)
                .name("New Birthyear Cohort")
                .min(-1)
                .max(1981)
                .build();
        assertThrows(InvalidDataException.class, () -> handler.create(builderFactory, SimpleEmptyEventKey, dto));
    }

    @Test
    public void failBirthyearInvalidMax() {
        var dto = builderFactory.builder(BirthyearCohortNew.DataBuilder.class)
                .name("New Birthyear Cohort")
                .min(1980)
                .max(-1)
                .build();
        assertThrows(InvalidDataException.class, () -> handler.create(builderFactory, SimpleEmptyEventKey, dto));
    }

    @Test
    public void failBirthyearInvalidMinMax() {
        var dto = builderFactory.builder(BirthyearCohortNew.DataBuilder.class)
                .name("New Birthyear Cohort")
                .min(1980)
                .max(1979)
                .build();
        assertThrows(InvalidDataException.class, () -> handler.create(builderFactory, SimpleEmptyEventKey, dto));
    }
}
