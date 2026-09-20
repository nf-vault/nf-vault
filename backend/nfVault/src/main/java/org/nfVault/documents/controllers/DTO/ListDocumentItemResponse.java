package org.nfVault.documents.controllers.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListDocumentItemResponse {
    Integer id;
    String type;
    String title;
    Integer parentId;
}
