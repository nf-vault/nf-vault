package org.nfVault.search.controllers.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchDocumentRequest {
    @NotBlank(message = "Query should be specified")
    private String query;

    @Min(value = 1, message = "Limit should be greater than 0")
    @Max(value = 100, message = "Limit should be less than 100")
    private Integer limit = 20;
}