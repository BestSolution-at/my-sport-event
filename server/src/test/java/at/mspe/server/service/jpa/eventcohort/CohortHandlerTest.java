package at.mspe.server.service.jpa.eventcohort;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.BaseHandlerTest;

public class CohortHandlerTest<T extends BaseHandler> extends BaseHandlerTest<T> {

    public CohortHandlerTest(T handler) {
        super(handler);
    }

}
