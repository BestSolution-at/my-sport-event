package at.mspe.server.service.jpa.model;

import java.time.ZonedDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;

@Entity(name = "SportEvent")
@Table(uniqueConstraints = {
        @UniqueConstraint(name = "sportevent_uq_key", columnNames = { "see_key" })
})
public class SportEventEntity {
    @Id
    @SequenceGenerator(name = "sportevent_seq", sequenceName = "sportevent_seq_id", allocationSize = 1, initialValue = 1)
    @GeneratedValue(generator = "sportevent_seq")
    @Column(name = "see_id")
    public Long id;

    @Version
    @Column(name = "see_version")
    public long version;

    @Column(name = "see_key", nullable = false)
    public UUID key;

    @Column(name = "see_name", nullable = false)
    public String name;

    @Column(name = "see_date", nullable = false)
    public ZonedDateTime date;

    public UUID key() {
        return key;
    }

    public String name() {
        return name;
    }

    public void name(String name) {
        this.name = name;
    }

    public ZonedDateTime date() {
        return date;
    }

    public void date(ZonedDateTime date) {
        this.date = date;
    }

    public static SportEventEntityBuilder builder() {
        return new SportEventEntityBuilder();
    }

    public static class SportEventEntityBuilder {
        private UUID key;
        private String name;
        private ZonedDateTime date;

        public SportEventEntityBuilder key(UUID key) {
            this.key = key;
            return this;
        }

        public SportEventEntityBuilder name(String name) {
            this.name = name;
            return this;
        }

        public SportEventEntityBuilder date(ZonedDateTime date) {
            this.date = date;
            return this;
        }

        public SportEventEntity build() {
            var entity = new SportEventEntity();
            entity.key = this.key;
            entity.name = this.name;
            entity.date = this.date;
            validate(entity);
            return entity;
        }
    }

    public static void validate(SportEventEntity entity) {
        if (entity.name == null || entity.name.isBlank()) {
            throw new IllegalArgumentException("Name must not be empty");
        }
        if (entity.date == null) {
            throw new IllegalArgumentException("Date must not be empty");
        }
    }
}
