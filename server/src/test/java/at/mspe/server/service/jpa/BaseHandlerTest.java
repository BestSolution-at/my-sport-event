package at.mspe.server.service.jpa;

import at.mspe.server.BaseTest;
import at.mspe.server.rest.RestBuilderFactory;
import jakarta.inject.Inject;

public class BaseHandlerTest<T extends BaseHandler> extends BaseTest {
    @Inject
    public RestBuilderFactory builderFactory;

    public final T handler;

    public BaseHandlerTest(T handler) {
        this.handler = handler;
    }
}
