package org.nfVault.search.controllers.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchDocumentResponse {
    Integer id;
    String title;
    String snippet;
    float score;
}
