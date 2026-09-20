package org.nfVault.documents.controllers.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CreateDocumentRequest {
    @NotBlank(message = "Name should be specified")
    private String name;

    @NotBlank(message = "Type should be specified")
    private String type;

    private Integer parentId;
}
