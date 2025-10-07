package at.mspe.server.service.jpa.sportevent;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.BaseHandlerTest;
import at.mspe.server.service.model.SportEvent;
import at.mspe.server.service.model.SportEventNew;

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
