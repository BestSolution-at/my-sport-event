package at.mspe.server.service.jpa.model;

import java.time.LocalDate;
import java.util.UUID;
import java.util.function.Function;

import jakarta.persistence.CascadeType;
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
    public UUID key;

    @Column(name = "par_firstname", nullable = false)
    public String firstname;

    @Column(name = "par_lastname", nullable = false)
    public String lastname;

    @Column(name = "par_team", nullable = true)
    public String team;

    @Column(name = "par_email", nullable = true)
    public String email;

    @Column(name = "par_birthday", nullable = true)
    public LocalDate birthday;

    @Column(name = "par_competionnumber", nullable = true)
    public String competitionNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "par_fk_cohort", foreignKey = @ForeignKey(name = "par_fkey_cohort"))
    public CohortEntity cohort;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "par_fk_sportevent", foreignKey = @ForeignKey(name = "par_fkey_sportevent"))
    public SportEventEntity sportEvent;

    public static ParticipantEntityBuilder builder() {
        return new ParticipantEntityBuilder();
    }

    public UUID key() {
        return this.key;
    }

    public String firstName() {
        return this.firstname;
    }

    public void firstName(String firstName) {
        this.firstname = firstName;
    }

    public String lastname() {
        return this.lastname;
    }

    public void lastname(String lastname) {
        this.lastname = lastname;
    }

    public String team() {
        return this.team;
    }

    public void team(String team) {
        this.team = team;
    }

    public String email() {
        return this.email;
    }

    public void email(String email) {
        this.email = email;
    }

    public LocalDate birthday() {
        return this.birthday;
    }

    public void birthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String competitionNumber() {
        return this.competitionNumber;
    }

    public void competitionNumber(String competitionNumber) {
        this.competitionNumber = competitionNumber;
    }

    public CohortEntity cohort() {
        return this.cohort;
    }

    public void cohort(CohortEntity cohort) {
        this.cohort = cohort;
    }

    public SportEventEntity sportEvent() {
        return this.sportEvent;
    }

    public void sportEvent(SportEventEntity sportEvent) {
        this.sportEvent = sportEvent;
    }

    public static class ParticipantEntityBuilder {
        private UUID key;
        private String firstname;
        private String lastname;
        private String team;
        private String email;
        private LocalDate birthday;
        private String competitionNumber;
        private CohortEntity cohort;
        private SportEventEntity sportEvent;

        public ParticipantEntityBuilder key(UUID key) {
            this.key = key;
            return this;
        }

        public ParticipantEntityBuilder firstname(String firstname) {
            this.firstname = firstname;
            return this;
        }

        public ParticipantEntityBuilder lastname(String lastname) {
            this.lastname = lastname;
            return this;
        }

        public ParticipantEntityBuilder team(String team) {
            this.team = team;
            return this;
        }

        public ParticipantEntityBuilder email(String email) {
            this.email = email;
            return this;
        }

        public ParticipantEntityBuilder birthday(LocalDate birthday) {
            this.birthday = birthday;
            return this;
        }

        public ParticipantEntityBuilder competitionNumber(String competitionNumber) {
            this.competitionNumber = competitionNumber;
            return this;
        }

        public ParticipantEntityBuilder cohort(CohortEntity cohort) {
            this.cohort = cohort;
            return this;
        }

        public ParticipantEntityBuilder sportEvent(SportEventEntity sportEvent) {
            this.sportEvent = sportEvent;
            return this;
        }

        public ParticipantEntityBuilder withSportEvent(
                Function<SportEventEntity.SportEventEntityBuilder, SportEventEntity> builderFunction) {
            return sportEvent(builderFunction.apply(SportEventEntity.builder()));
        }

        public ParticipantEntity build() {
            var entity = new ParticipantEntity();
            entity.key = this.key;
            entity.firstname = this.firstname;
            entity.lastname = this.lastname;
            entity.team = this.team;
            entity.email = this.email;
            entity.birthday = this.birthday;
            entity.competitionNumber = this.competitionNumber;
            entity.cohort = this.cohort;
            entity.sportEvent = this.sportEvent;
            return entity;
        }
    }

    public static void validate(ParticipantEntity entity) {
        if (entity.firstname == null || entity.firstname.isBlank()) {
            throw new IllegalArgumentException("Firstname must not be empty");
        }
        if (entity.lastname == null || entity.lastname.isBlank()) {
            throw new IllegalArgumentException("Lastname must not be empty");
        }
    }
}
