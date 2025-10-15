package at.mspe.server.service.jpa.participant;

import at.mspe.server.service.jpa.BaseHandler;
import at.mspe.server.service.jpa.BaseHandlerTest;
import at.mspe.server.service.model.Participant;
import at.mspe.server.service.model.ParticipantNew;

public class ParticipantHandlerTest<T extends BaseHandler> extends BaseHandlerTest<T> {

    public ParticipantHandlerTest(T handler) {
        super(handler);
    }

    public Participant.DataBuilder builder() {
        return builderFactory.builder(Participant.DataBuilder.class);
    }

    public ParticipantNew.DataBuilder newBuilder() {
        return builderFactory.builder(ParticipantNew.DataBuilder.class);
    }
}
