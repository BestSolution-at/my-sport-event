package at.mspe.server.service.jpa;

import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.Function;

import com.fasterxml.uuid.Generators;

import jakarta.persistence.EntityManager;

public class BaseHandler {
    final EntityManager em;

    public BaseHandler() {
        this.em = null;
    }

    public BaseHandler(EntityManager em) {
        this.em = em;
    }

    EntityManager em() {
        return em;
    }

    protected static UUID generateKey() {
        return Generators.timeBasedEpochGenerator().generate();
    }

    protected void accept(Consumer<EntityManager> consumer) {
        consumer.accept(em());
    }

    protected <T> T apply(Function<EntityManager, T> function) {
        return function.apply(em());
    }
}
