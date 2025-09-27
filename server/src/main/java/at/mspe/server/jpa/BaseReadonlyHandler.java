package at.mspe.server.jpa;

import org.hibernate.Session;

import jakarta.persistence.EntityManager;

public class BaseReadonlyHandler extends BaseHandler {

    public BaseReadonlyHandler(EntityManager em) {
        super(em);
    }

    public EntityManager em() {
        this.em.unwrap(Session.class).setDefaultReadOnly(true);
        return this.em;
    }
}
