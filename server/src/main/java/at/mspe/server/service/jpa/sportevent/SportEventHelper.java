package at.mspe.server.service.jpa.sportevent;

import java.util.function.Function;

import at.mspe.server.service.jpa.Utils;
import at.mspe.server.service.jpa.model.SportEventEntity;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.NotFoundException;
import at.mspe.server.service.model.SportEvent;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

public class SportEventHelper {
    public static Function<String, String> NOT_FOUND = Utils.createNotFound("SportEvent");

    public static SportEventEntity findSportEventByKey(EntityManager em, String key) {
        try {
            var query = em.createQuery("""
                    SELECT
                        se
                    FROM
                        SportEvent se
                    WHERE
                        se.key = :key
                    """, SportEventEntity.class);
            query.setParameter("key", Utils.parseUUID(key, NOT_FOUND));
            return query.getSingleResult();
        } catch (NoResultException e) {
            throw new NotFoundException(NOT_FOUND.apply(key));
        }
    }

    public static SportEvent.Data toData(SportEventEntity entity, BuilderFactory factory) {
        return factory.builder(SportEvent.DataBuilder.class)
                .key(entity.key.toString())
                .version(entity.version)
                .name(entity.name)
                .date(entity.date)
                .build();
    }
}
