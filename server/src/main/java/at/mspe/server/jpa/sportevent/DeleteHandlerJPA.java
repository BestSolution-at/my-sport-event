package at.mspe.server.jpa.sportevent;

import java.util.Objects;

import at.mspe.server.jpa.BaseHandler;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;

@ApplicationScoped
public class DeleteHandlerJPA extends BaseHandler implements SportEventServiceImpl.DeleteHandler {
    @Inject
    public DeleteHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public void delete(BuilderFactory _factory, String key, Long version) {
        accept(em -> delete(em, _factory, key, version));
    }

    @Transactional
    public void delete(EntityManager em, BuilderFactory _factory, String key, Long version) {
        var e = SportEventHelper.findSportEventByKey(em, key);
        if (version != null && !Objects.equals(version, e.version)) {

        }
    }
}
