package dev.bengi.userservice.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.stereotype.Service;
import reactor.kafka.sender.KafkaSender;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.SenderRecord;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventProducer {

    private final KafkaSender<String, String> sender;

    public Mono<String> send(String topics, String message) {
        return sender.send(Mono.just(SenderRecord.create(new ProducerRecord<>(topics, message), message)))
                .then(Mono.just(message));

    }

}
