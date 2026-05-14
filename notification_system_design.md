# Notification System Design Document

This document outlines the multi-stage design and implementation of the Notification System as part of the Campus Hiring Evaluation.

## Stage 1: API Design
Clean, RESTful endpoints implemented in Node.js/Express:
- `GET /notifications`: Paginated retrieval of history.
- `POST /notifications/send`: Trigger individual alerts.
- `GET /notifications/:id`: View specific details.

## Stage 2: Database Schema
Relational design optimized for scalability:
- `users`: Core profile data.
- `notifications`: Centralized message content.
- `notification_recipients`: Join table for many-to-many delivery.
- `notification_reads`: Engagement and read-status tracking.

## Stage 3: Query Optimization
Performance-first indexing strategy:
- **Composite Index**: `(user_id, status, sent_at DESC)` for instant unread-first sorting.
- **Projections**: Queries only fetch necessary columns to reduce memory overhead.

## Stage 4: Real-Time & Caching
High-performance delivery:
- **SSE (Server-Sent Events)**: Real-time "push" updates to clients.
- **Caching**: First-page caching with intelligent invalidation.

## Stage 5: Bulk Delivery (Queue System)
Scalability for 50,000+ recipients:
- **Job Queues**: Asynchronous processing using a worker pattern.
- **Batching**: Automatic segmentation into batches of 100 to prevent API/Memory limits.
- **Retries**: 3-stage automatic retry logic for failed deliveries.

## Stage 6: Priority Inbox
Intelligent sorting logic:
- **Unread First**: Pinned to top.
- **Importance Weights**: `placement` (3) > `result` (2) > `event` (1).
- **Recency**: Chronological tie-breaking.
