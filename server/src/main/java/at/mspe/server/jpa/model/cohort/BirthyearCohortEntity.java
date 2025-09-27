package at.mspe.server.jpa.model.cohort;

import at.mspe.server.jpa.model.CohortEntity;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity(name = "BirthyearCohort")
@DiscriminatorValue(CohortEntity.BIRTHYEAR_COHORT)
public class BirthyearCohortEntity extends CohortEntity {
    @Column(name = "coh_min", nullable = false)
    int min;

    @Column(name = "coh_max", nullable = true)
    Integer max;
}
