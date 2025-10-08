package at.mspe.server.service.jpa.model.cohort;

import java.util.UUID;
import java.util.function.Function;

import at.mspe.server.service.jpa.model.CohortEntity;
import at.mspe.server.service.jpa.model.Gender;
import at.mspe.server.service.jpa.model.SportEventEntity;
import at.mspe.server.service.InvalidDataException;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity(name = "BirthyearCohort")
@DiscriminatorValue(CohortEntity.BIRTHYEAR_COHORT)
public class BirthyearCohortEntity extends CohortEntity {
    @Column(name = "coh_min", nullable = false)
    public int min;

    @Column(name = "coh_max", nullable = false)
    public int max;

    public int max() {
        return this.max;
    }

    public void max(int max) {
        this.max = max;
    }

    public int min() {
        return this.min;
    }

    public void min(int min) {
        this.min = min;
    }

    public static BirthyearCohortEntityBuilder builder() {
        return new BirthyearCohortEntityBuilder();
    }

    public static class BirthyearCohortEntityBuilder {
        private UUID key;
        private String name;
        private SportEventEntity sportEvent;
        private int min;
        private int max;
        private Gender gender;

        public BirthyearCohortEntityBuilder key(UUID key) {
            this.key = key;
            return this;
        }

        public BirthyearCohortEntityBuilder name(String name) {
            this.name = name;
            return this;
        }

        public BirthyearCohortEntityBuilder sportEvent(SportEventEntity sportEvent) {
            this.sportEvent = sportEvent;
            return this;
        }

        public BirthyearCohortEntityBuilder withSportEvent(
                Function<SportEventEntity.SportEventEntityBuilder, SportEventEntity> builderFunction) {
            return sportEvent(builderFunction.apply(SportEventEntity.builder()));
        }

        public BirthyearCohortEntityBuilder min(int min) {
            this.min = min;
            return this;
        }

        public BirthyearCohortEntityBuilder max(int max) {
            this.max = max;
            return this;
        }

        public BirthyearCohortEntityBuilder gender(Gender gender) {
            this.gender = gender;
            return this;
        }

        public BirthyearCohortEntity build() {
            var entity = new BirthyearCohortEntity();
            entity.key = this.key;
            entity.name = this.name;
            entity.sportEvent = this.sportEvent;
            entity.min = this.min;
            entity.max = this.max;
            entity.gender = this.gender;
            validate(entity);
            return entity;
        }
    }

    public static void validate(BirthyearCohortEntity entity) {
        if (entity.min < 0) {
            throw new InvalidDataException("Min must not be negative");
        }
        if (entity.max < entity.min) {
            throw new InvalidDataException("Max must not be less than min");
        }
        if (entity.name == null || entity.name.isBlank()) {
            throw new InvalidDataException("Name must not be empty");
        }
        if (entity.gender == null) {
            throw new InvalidDataException("Gender must not be empty");
        }
    }
}
