package at.mspe.server.service.jpa.sportevent;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class ListHandlerJPATest extends SportEventHandlerTest<ListHandlerJPA> {
    @Inject
    public ListHandlerJPATest(ListHandlerJPA handler) {
        super(handler);
    }

}
