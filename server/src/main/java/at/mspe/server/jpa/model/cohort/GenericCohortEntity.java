package at.mspe.server.jpa.model.cohort;

import at.mspe.server.jpa.model.CohortEntity;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity(name = "GenericCohort")
@DiscriminatorValue(CohortEntity.GENERIC_COHORT)
public class GenericCohortEntity extends CohortEntity {

}
