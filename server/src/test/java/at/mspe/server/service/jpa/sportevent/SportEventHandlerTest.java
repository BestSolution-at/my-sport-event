package at.mspe.server.service.jpa.sportevent;

import java.util.UUID;

import org.hibernate.StatelessSession;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.BaseHandlerTest;
import at.mspe.server.service.jpa.model.SportEventEntity;
import at.mspe.server.service.model.SportEvent;
import at.mspe.server.service.model.SportEventNew;
import jakarta.inject.Inject;
import jakarta.persistence.NoResultException;

public class SportEventHandlerTest<T extends BaseHandler> extends BaseHandlerTest<T> {

    public SportEventHandlerTest(T handler) {
        super(handler);
    }

    public SportEvent.DataBuilder builder() {
        return builderFactory.builder(SportEvent.DataBuilder.class);
    }

    public SportEventNew.DataBuilder newBuilder() {
        return builderFactory.builder(SportEventNew.DataBuilder.class);
    }
}
