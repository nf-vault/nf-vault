package org.nfVault.auth.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.nfVault.auth.models.InviteCode;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class InviteCodeRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public Optional<InviteCode> getByCode(String code){
        return Optional.ofNullable(
                entityManager
                .createQuery("SELECT codes FROM InviteCode codes WHERE codes.code = :code", InviteCode.class)
                .setParameter("code", code)
                .getSingleResultOrNull()
        );
    }
}
