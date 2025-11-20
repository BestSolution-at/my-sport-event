package at.mspe.server.service.jpa.participant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.model.Gender;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class GetHandlerJPATest extends ParticipantHandlerTest<GetHandlerJPA> {

    public GetHandlerJPATest(GetHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void getMinimal() {
        var participant = handler.get(builderFactory, FullEventKey, FullEvent_ParticpantKey);
        assertNotNull(participant);
        assertNull(participant.association());
        assertNull(participant.birthday());
        assertEquals("John", participant.firstname());
        assertEquals(Gender.MALE, participant.gender());
        assertEquals("Doe", participant.lastname());
        assertEquals(FullEvent_ParticpantKey, participant.key());
        assertNull(participant.team());
        assertNotNull(participant.teamMates());
        assertTrue(participant.teamMates().isEmpty());
        assertNull(participant.cohortKey());
    }

    @Test
    public void testFull() {
        var participant = handler.get(builderFactory, FullEventKey, FullEvent_ParticpantWithGenericCohortKey);
        assertEquals("Association", participant.association());
        assertEquals(LocalDate.of(1991, 10, 25), participant.birthday());
        assertEquals("Jane", participant.firstname());
        assertEquals(Gender.FEMALE, participant.gender());
        assertEquals("Dune", participant.lastname());
        assertEquals(FullEvent_ParticpantWithGenericCohortKey, participant.key());
        assertEquals("Team", participant.team());
        assertNotNull(participant.teamMates());
        assertEquals(1, participant.teamMates().size());
        assertEquals(FullEvent_GenericCohortKey, participant.cohortKey());
    }

    @Test
    public void testUnknownEventKey() {
        assertThrows(NotFoundException.class, () -> {
            handler.get(builderFactory, UUID.randomUUID().toString(), FullEvent_ParticpantKey);
        });
    }

    @Test
    public void testInvalidEventKey() {
        assertThrows(NotFoundException.class, () -> {
            handler.get(builderFactory, "abcd", FullEvent_ParticpantKey);
        });
    }

    @Test
    public void testUnknownKey() {
        assertThrows(NotFoundException.class, () -> {
            handler.get(builderFactory, FullEventKey, UUID.randomUUID().toString());
        });
    }

    @Test
    public void testInvalidKey() {
        assertThrows(NotFoundException.class, () -> {
            handler.get(builderFactory, FullEventKey, "abcd");
        });
    }

    @Test
    public void testEventKeyMismatchKey() {
        assertThrows(NotFoundException.class, () -> {
            handler.get(builderFactory, SimpleEmptyEventKey, FullEvent_ParticpantKey);
        });
    }

}
