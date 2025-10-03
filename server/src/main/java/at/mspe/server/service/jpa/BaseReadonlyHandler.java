package at.mspe.server.service.jpa;

import org.hibernate.Session;

import jakarta.persistence.EntityManager;

public class BaseReadonlyHandler extends BaseHandler {
    protected BaseReadonlyHandler() {
        super();
    }

    public BaseReadonlyHandler(EntityManager em) {
        super(em);
    }

    @Override
    EntityManager em() {
        this.em.unwrap(Session.class).setDefaultReadOnly(true);
        return this.em;
    }
}
