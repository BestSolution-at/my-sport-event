package at.mspe.server.service.jpa.model.cohort;

import java.util.UUID;

import at.mspe.server.service.InvalidDataException;
import at.mspe.server.service.jpa.model.CohortEntity;
import at.mspe.server.service.jpa.model.Gender;
import at.mspe.server.service.jpa.model.SportEventEntity;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity(name = "GenericCohort")
@DiscriminatorValue(CohortEntity.GENERIC_COHORT)
public class GenericCohortEntity extends CohortEntity {
    public static GenericCohortEntityBuilder builder() {
        return new GenericCohortEntityBuilder();
    }

    public static class GenericCohortEntityBuilder {
        private UUID key;
        private String name;
        private SportEventEntity sportEvent;
        private Gender gender;

        public GenericCohortEntityBuilder key(UUID key) {
            this.key = key;
            return this;
        }

        public GenericCohortEntityBuilder name(String name) {
            this.name = name;
            return this;
        }

        public GenericCohortEntityBuilder gender(Gender gender) {
            this.gender = gender;
            return this;
        }

        public GenericCohortEntityBuilder sportEvent(SportEventEntity sportEvent) {
            this.sportEvent = sportEvent;
            return this;
        }

        public GenericCohortEntity build() {
            var entity = new GenericCohortEntity();
            entity.key = this.key;
            entity.name = this.name;
            entity.sportEvent = this.sportEvent;
            entity.gender = this.gender;
            validate(entity);
            return entity;
        }
    }

    public static void validate(GenericCohortEntity entity) {
        if (entity.name == null || entity.name.isBlank()) {
            throw new InvalidDataException("Name must not be empty");
        }
        if (entity.gender == null) {
            throw new InvalidDataException("Gender must not be empty");
        }
    }
}
