package at.mspe.server.service.jpa.sportevent;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class UpdateHandlerJPATest extends SportEventHandlerTest<UpdateHandlerJPA> {
    @Inject
    public UpdateHandlerJPATest(UpdateHandlerJPA handler) {
        super(handler);
    }
}
