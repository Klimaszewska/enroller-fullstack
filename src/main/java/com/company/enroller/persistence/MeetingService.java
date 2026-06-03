package com.company.enroller.persistence;

import com.company.enroller.model.Meeting;
import com.company.enroller.model.Participant;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Locale;

@Component("meetingService")
public class MeetingService {

    // Inject via Spring rather than holding a raw field reference,
    // and always call getSession() per-operation to avoid stale sessions.
    @Autowired
    ParticipantService participantService;

    DatabaseConnector connector;

    public MeetingService() {
        connector = DatabaseConnector.getInstance();
    }

    /**
     * Find meetings with optional filtering by title, description, a participant,
     * and optional sorting by title.
     * <p>
     * Uses typed Query to avoid raw-type warnings.
     * Taken from teacher's version for richer filtering, but rewritten
     * with typed Query and safe session access.
     */
    public Collection<Meeting> findMeetings(String title, String description, Participant participant, String sortMode) {
        StringBuilder hql = new StringBuilder(
                "FROM Meeting AS meeting WHERE LOWER(meeting.title) LIKE :title AND LOWER(meeting.description) LIKE :description");

        if (participant != null) {
            hql.append(" AND :participant IN elements(meeting.participants)");
        }
        if ("title".equalsIgnoreCase(sortMode)) {
            hql.append(" ORDER BY meeting.title ASC");
        }

        Query<Meeting> query = connector.getSession().createQuery(hql.toString(), Meeting.class);
        query.setParameter("title", "%" + (title != null ? title.toLowerCase(Locale.ROOT) : "") + "%");
        query.setParameter("description", "%" + (description != null ? description.toLowerCase(Locale.ROOT) : "") + "%");
        if (participant != null) {
            query.setParameter("participant", participant);
        }
        return query.list();
    }

    public Meeting findById(long id) {
        return connector.getSession().get(Meeting.class, id);
    }

    /**
     * Check existence by title + date without double-querying.
     * Fixed the teacher's bug of calling query.list() twice.
     */
    public boolean alreadyExists(Meeting meeting) {
        String hql = "FROM Meeting WHERE title = :title AND date = :date";
        Query<Meeting> query = connector.getSession().createQuery(hql, Meeting.class);
        query.setParameter("title", meeting.getTitle());
        query.setParameter("date", meeting.getDate());
        return !query.list().isEmpty();
    }

    public void add(Meeting meeting) {
        Transaction transaction = connector.getSession().beginTransaction();
        try {
            connector.getSession().save(meeting);
            transaction.commit();
        } catch (RuntimeException e) {
            transaction.rollback();
            throw e;
        }
    }

    public void delete(Meeting meeting) {
        Transaction transaction = connector.getSession().beginTransaction();
        try {
            connector.getSession().delete(meeting);
            transaction.commit();
        } catch (RuntimeException e) {
            transaction.rollback();
            throw e;
        }
    }

    public void update(Meeting meeting) {
        Transaction transaction = connector.getSession().beginTransaction();
        try {
            connector.getSession().merge(meeting);
            transaction.commit();
        } catch (RuntimeException e) {
            transaction.rollback();
            throw e;
        }
    }

    /**
     * Participant-on-meeting management — from your version, absent in teacher's.
     */
    public boolean addParticipant(Long meetingId, String login) {
        Transaction transaction = connector.getSession().beginTransaction();
        try {
            Meeting meeting = findById(meetingId);
            Participant participant = participantService.findByLogin(login);
            if (meeting == null || participant == null) {
                transaction.rollback();
                return false;
            }
            meeting.addParticipant(participant);
            transaction.commit();
            return true;
        } catch (RuntimeException e) {
            transaction.rollback();
            throw e;
        }
    }

    public boolean removeParticipant(Long meetingId, String login) {
        Transaction transaction = connector.getSession().beginTransaction();
        try {
            Meeting meeting = findById(meetingId);
            Participant participant = participantService.findByLogin(login);
            if (meeting == null || participant == null) {
                transaction.rollback();
                return false;
            }
            meeting.removeParticipant(participant);
            transaction.commit();
            return true;
        } catch (RuntimeException e) {
            transaction.rollback();
            throw e;
        }
    }

    public Collection<Participant> getParticipants(Long meetingId) {
        Meeting meeting = findById(meetingId);
        if (meeting == null) {
            return null;
        }
        return meeting.getParticipants();
    }
}