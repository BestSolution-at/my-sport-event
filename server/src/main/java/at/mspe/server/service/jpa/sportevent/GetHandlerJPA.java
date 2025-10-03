package at.mspe.server.service.jpa.sportevent;

import at.mspe.server.service.jpa.BaseReadonlyHandler;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import at.mspe.server.service.BuilderFactory;
import at.mspe.server.service.impl.SportEventServiceImpl;
import at.mspe.server.service.model.SportEvent;

@ApplicationScoped
public class GetHandlerJPA extends BaseReadonlyHandler implements SportEventServiceImpl.GetHandler {
    @Inject
    public GetHandlerJPA(EntityManager em) {
        super(em);
    }

    @Override
    public SportEvent.Data get(BuilderFactory factory, String key) {
        return apply(em -> get(em, factory, key));
    }

    public SportEvent.Data get(EntityManager em, BuilderFactory factory, String key) {
        var entity = SportEventHelper.findSportEventByKey(em, key);
        return SportEventHelper.toData(entity, factory);
    }
}
