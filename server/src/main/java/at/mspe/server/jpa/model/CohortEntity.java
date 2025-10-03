package at.mspe.server.jpa.model;

import java.util.UUID;
import java.util.function.Function;

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
public class CohortEntity {
    public static final String GENERIC_COHORT = "1";
    public static final String BIRTHYEAR_COHORT = "2";

    @Id
    @SequenceGenerator(name = "cohort_seq", sequenceName = "cohort_seq_id", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "cohort_seq")
    @Column(name = "coh_id")
    public Long id;

    @Column(name = "coh_key", unique = true, nullable = false, updatable = false)
    public UUID key;

    @Version
    @Column(name = "coh_version")
    public long version;

    @Column(name = "name", length = 255)
    public String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coh_fk_sportevent", foreignKey = @ForeignKey(name = "coh_fkey_sportevent"))
    public SportEventEntity sportEvent;

    public String name() {
        return name;
    }

    public void name(String name) {
        this.name = name;
    }

    public UUID key() {
        return key;
    }

    public void key(UUID key) {
        this.key = key;
    }
}
