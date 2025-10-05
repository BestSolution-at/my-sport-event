package at.mspe.server.service.jpa.sportevent;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class GetHandlerJPATest extends SportEventHandlerTest<GetHandlerJPA> {
    @Inject
    public GetHandlerJPATest(GetHandlerJPA handler) {
        super(handler);
    }
}
