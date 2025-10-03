package at.mspe.server.jpa.model.cohort;

import java.util.UUID;

import at.mspe.server.jpa.model.CohortEntity;
import at.mspe.server.jpa.model.SportEventEntity;
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

        public GenericCohortEntityBuilder key(UUID key) {
            this.key = key;
            return this;
        }

        public GenericCohortEntityBuilder name(String name) {
            this.name = name;
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
            validate(entity);
            return entity;
        }
    }

    public static void validate(GenericCohortEntity entity) {
        if (entity.name == null || entity.name.isBlank()) {
            throw new IllegalArgumentException("Name must not be empty");
        }
    }
}
