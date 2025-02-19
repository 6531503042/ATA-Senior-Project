package dev.bengi.userservice.domain.payload.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ChangePasswordRequest {

    String oldPassword;
    String newPassword;
    String confirmNewPassword;
}
