package dev.bengi.feedbackservice.foreign;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "userClient", url = "http://localhost:8088")
public interface UserClient {


}
