CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    mobile_no VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    notification_type VARCHAR(50),
    sender_id INT REFERENCES students(student_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_recipients (
    recipient_id SERIAL PRIMARY KEY,
    notification_id INT REFERENCES notifications(notification_id) ON DELETE CASCADE,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Pending',
    sent_at TIMESTAMP
);

CREATE TABLE notification_reads (
    read_id SERIAL PRIMARY KEY,
    notification_id INT REFERENCES notifications(notification_id) ON DELETE CASCADE,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recipients_student_id ON notification_recipients(student_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_student_recent_unread ON notification_recipients(student_id, status, sent_at DESC);
