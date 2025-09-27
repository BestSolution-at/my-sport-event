package at.mspe.server.jpa.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Version;

@Entity(name = "Cohort")
@DiscriminatorColumn(name = "coh_type", discriminatorType = DiscriminatorType.INTEGER)
public abstract class CohortEntity {
    public static final String GENERIC_COHORT = "1";
    public static final String BIRTHYEAR_COHORT = "2";

    @Id
    @SequenceGenerator(name = "cohort_seq", sequenceName = "cohort_seq_id", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "cohort_seq")
    @Column(name = "coh_id")
    public Long id;

    @Version
    @Column(name = "coh_version")
    public long version;

    String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "coh_fk_sportevent", foreignKey = @ForeignKey(name = "coh_fkey_sportevent"))
    SportEventEntity sportEvent;

}
