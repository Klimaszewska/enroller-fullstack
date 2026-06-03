package com.company.enroller.persistence;

import com.company.enroller.model.Participant;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Locale;

@Component("participantService")
public class ParticipantService {

    DatabaseConnector connector;

    public ParticipantService() {
        connector = DatabaseConnector.getInstance();
    }
    
    public Collection<Participant> getAll(String login, String sortMode, String sortOrder) {
        StringBuilder hql = new StringBuilder("FROM Participant WHERE LOWER(login) LIKE :login");

        if ("login".equalsIgnoreCase(sortMode)) {
            hql.append(" ORDER BY login");
            if ("ASC".equalsIgnoreCase(sortOrder) || "DESC".equalsIgnoreCase(sortOrder)) {
                hql.append(" ").append(sortOrder.toUpperCase(Locale.ROOT));
            }
        }

        Query<Participant> query = connector.getSession().createQuery(hql.toString(), Participant.class);
        query.setParameter("login", "%" + (login != null ? login.toLowerCase(Locale.ROOT) : "") + "%");
        return query.list();
    }

    public Participant findByLogin(String login) {
        return connector.getSession().get(Participant.class, login);
    }

    /**
     * Returns the saved participant (teacher's improvement) so callers
     * can use the persisted object directly.
     * Adds try/catch rollback from your version.
     */
    public Participant add(Participant participant) {
        Transaction transaction = connector.getSession().beginTransaction();
        try {
            connector.getSession().save(participant);
            transaction.commit();
            return participant;
        } catch (RuntimeException e) {
            transaction.rollback();
            throw e;
        }
    }

    public void update(Participant participant) {
        Transaction transaction = connector.getSession().beginTransaction();
        try {
            connector.getSession().merge(participant);
            transaction.commit();
        } catch (RuntimeException e) {
            transaction.rollback();
            throw e;
        }
    }

    public void delete(Participant participant) {
        Transaction transaction = connector.getSession().beginTransaction();
        try {
            connector.getSession().delete(participant);
            transaction.commit();
        } catch (RuntimeException e) {
            transaction.rollback();
            throw e;
        }
    }
}