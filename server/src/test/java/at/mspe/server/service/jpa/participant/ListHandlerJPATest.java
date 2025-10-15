package at.mspe.server.service.jpa.participant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class ListHandlerJPATest extends ParticipantHandlerTest<ListHandlerJPA> {

    public ListHandlerJPATest(ListHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void list() {
        var result = handler.list(builderFactory, FullEventKey);
        assertNotNull(result);
        assertEquals(3, result.size());

        var participantOpt = result.stream()
                .filter(p -> FullEvent_ParticpantWithGenericCohortKey.equals(p.key()))
                .findFirst();
        assertTrue(participantOpt::isPresent);
        var participant = participantOpt.get();
        assertEquals(1, participant.teamMates().size());
    }
}
