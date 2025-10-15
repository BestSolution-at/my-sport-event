package at.mspe.server.service.jpa.participant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.model.Gender;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class CreateHandlerJPATest extends ParticipantHandlerTest<CreateHandlerJPA> {
    @Inject
    public CreateHandlerJPATest(CreateHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void full() {
        var association = "Sample Association";
        var birthday = LocalDate.of(1979, 5, 1);
        var firstname = "John";
        var gender = Gender.MALE;
        var lastname = "Doe";
        var team = "Pink Panther";
        var dto = newBuilder()
                .association(association)
                .birthday(birthday)
                .firstname(firstname)
                .gender(gender)
                .lastname(lastname)
                .team(team)
                .build();
        var key = handler.create(builderFactory, SimpleEmptyEventKey, dto);
        assertNotNull(key);
        var entity = getParticipantEntity(key);
        assertEquals(entity.key.toString(), key);
        assertEquals(association, entity.association);
        assertEquals(birthday, entity.birthday);
        assertEquals(firstname, entity.firstname);
        assertEquals(gender, Gender.valueOf(entity.gender.toString()));
        assertEquals(lastname, entity.lastname);
        assertEquals(team, entity.team);
    }

    @Test
    public void minimal() {
        var firstname = "John";
        var gender = Gender.MALE;
        var lastname = "Doe";
        var dto = newBuilder()
                .firstname(firstname)
                .gender(gender)
                .lastname(lastname)
                .build();
        var key = handler.create(builderFactory, SimpleEmptyEventKey, dto);
        assertNotNull(key);
        var entity = getParticipantEntity(key);
        assertEquals(entity.key.toString(), key);
        assertNull(entity.association);
        assertNull(entity.birthday);
        assertEquals(firstname, entity.firstname);
        assertEquals(gender, Gender.valueOf(entity.gender.toString()));
        assertEquals(lastname, entity.lastname);
        assertNull(entity.team);
    }

    @Test
    public void emptyFirstname() {
        var gender = Gender.MALE;
        var lastname = "Doe";
        var dto = newBuilder()
                .firstname("")
                .gender(gender)
                .lastname(lastname)
                .build();
        assertThrows(InvalidDataException.class, () -> handler.create(builderFactory, SimpleEmptyEventKey, dto));
    }

    @Test
    public void emptyLastname() {
        var firstname = "John";
        var gender = Gender.MALE;
        var dto = newBuilder()
                .firstname(firstname)
                .gender(gender)
                .lastname("")
                .build();
        assertThrows(InvalidDataException.class, () -> handler.create(builderFactory, SimpleEmptyEventKey, dto));
    }

    @Test
    public void unknownEventId() {
        var firstname = "John";
        var gender = Gender.MALE;
        var lastname = "Doe";
        var dto = newBuilder()
                .firstname(firstname)
                .gender(gender)
                .lastname(lastname)
                .build();
        assertThrows(NotFoundException.class, () -> handler.create(builderFactory, UUID.randomUUID().toString(), dto));
    }

    @Test
    public void invalidEventId() {
        var firstname = "John";
        var gender = Gender.MALE;
        var lastname = "Doe";
        var dto = newBuilder()
                .firstname(firstname)
                .gender(gender)
                .lastname(lastname)
                .build();
        assertThrows(NotFoundException.class, () -> handler.create(builderFactory, "abcd", dto));
    }
}
