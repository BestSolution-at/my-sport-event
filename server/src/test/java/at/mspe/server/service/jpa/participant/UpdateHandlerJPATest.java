package at.mspe.server.service.jpa.participant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;

import at.mspe.server.service.model.Gender;
import at.mspe.server.service.model.Participant;
import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class UpdateHandlerJPATest extends ParticipantHandlerTest<UpdateHandlerJPA> {

    public UpdateHandlerJPATest(UpdateHandlerJPA handler) {
        super(handler);
    }

    @Test
    public void testUpdate() {
        String association = null;
        LocalDate birthday = null;
        var firstname = "Updated Firstname";
        var gender = Gender.FEMALE;
        var lastname = "Updated Lastname";
        String team = null;
        var dto = builderFactory.builder(Participant.PatchBuilder.class)
                .key(FullEvent_ParticpantWithGenericCohortKey)
                .version(0)
                .association(association)
                .birthday(birthday)
                .firstname(firstname)
                .gender(gender)
                .lastname(lastname)
                .team(team)
                .cohortKey(null)
                .build();
        var result = handler.update(builderFactory, FullEventKey, FullEvent_ParticpantWithGenericCohortKey, dto);
        assertEquals(FullEvent_ParticpantWithGenericCohortKey, result.key());
        assertEquals(1L, result.version());
        var entity = getParticipantEntity(FullEvent_ParticpantWithGenericCohortKey);

        assertNull(entity.association);
        assertNull(entity.birthday);
        assertEquals(firstname, entity.firstname);
        assertEquals(gender, Gender.valueOf(entity.gender.toString()));
        assertEquals(lastname, entity.lastname);
        assertNull(entity.team);
        assertNull(entity.cohort);
    }

    @Test
    public void testUpdateCohort() {
        var dto = builderFactory.builder(Participant.PatchBuilder.class)
                .key(FullEvent_ParticpantWithGenericCohortKey)
                .version(0)
                .cohortKey(FullEvent_BirthyearCohortKey)
                .build();
        var result = handler.update(builderFactory, FullEventKey, FullEvent_ParticpantWithGenericCohortKey, dto);
        assertEquals(FullEvent_ParticpantWithGenericCohortKey, result.key());
        assertEquals(1L, result.version());
        var entity = getParticipantEntity(FullEvent_ParticpantWithGenericCohortKey);
        assertEquals(FullEvent_BirthyearCohortKey, entity.cohort.key.toString());
    }
}
