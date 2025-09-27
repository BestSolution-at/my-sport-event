package at.mspe.server.jpa;

import jakarta.persistence.EntityManager;

public class BaseHandler {
    final EntityManager em;

    public BaseHandler(EntityManager em) {
        this.em = em;
    }

    public EntityManager em() {
        return this.em;
    }

}
