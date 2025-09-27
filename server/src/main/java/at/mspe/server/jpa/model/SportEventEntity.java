package at.mspe.server.jpa.model;

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
    UUID key;

    @Column(name = "see_name", nullable = false)
    String name;
}
