package at.mspe.server.jpa.model;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Version;

@Entity(name = "Participant")
public class ParticipantEntity {
    @Id
    @SequenceGenerator(name = "participant_seq", sequenceName = "participant_seq_id", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "participant_seq")
    @Column(name = "par_id")
    public Long id;

    @Version
    @Column(name = "par_version")
    public long version;

    @Column(name = "par_key", nullable = false)
    UUID key;

    @Column(name = "par_firstname", nullable = false)
    String firstname;

    @Column(name = "par_lastname", nullable = false)
    String lastname;

    @Column(name = "par_team", nullable = true)
    String team;

    @Column(name = "par_email", nullable = true)
    String email;

    @Column(name = "par_birthday", nullable = true)
    LocalDate birthday;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "par_fk_cohort", foreignKey = @ForeignKey(name = "par_fkey_cohort"))
    CohortEntity cohort;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "par_fk_sportevent", foreignKey = @ForeignKey(name = "par_fkey_sportevent"))
    SportEventEntity sportEvent;
}
