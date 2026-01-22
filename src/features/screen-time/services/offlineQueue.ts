import { mmkv } from '@/lib/storage/mmkv';
import { usageApi } from '../api/usageApi';
import type { UsageSource } from '../types/screenTime.types';

const QUEUE_KEY = 'dashtok:usage-event-queue';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

type EventType = 'session_start' | 'session_end';

interface QueuedEvent {
  id: string;
  type: EventType;
  payload: SessionStartPayload | SessionEndPayload;
  timestamp: number;
  retryCount: number;
}

interface SessionStartPayload {
  source: UsageSource;
  idempotencyKey: string;
}

interface SessionEndPayload {
  sessionId: string;
  idempotencyKey: string;
}

/**
 * Generate a unique idempotency key for event deduplication.
 */
function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Offline-first event queue for usage tracking.
 *
 * Ensures usage events are never lost due to:
 * - Network failures
 * - App being killed by iOS
 * - Temporary server unavailability
 *
 * Events are persisted to MMKV and processed on app foreground.
 */
class OfflineEventQueue {
  private isProcessing = false;

  /**
   * Get all queued events.
   */
  private getQueue(): QueuedEvent[] {
    try {
      const data = mmkv.getString(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save queue to storage.
   */
  private saveQueue(queue: QueuedEvent[]): void {
    mmkv.setString(QUEUE_KEY, JSON.stringify(queue));
  }

  /**
   * Add an event to the queue.
   * Returns the idempotency key for tracking.
   */
  enqueue(type: EventType, payload: Omit<SessionStartPayload, 'idempotencyKey'> | Omit<SessionEndPayload, 'idempotencyKey'>): string {
    const idempotencyKey = generateIdempotencyKey();
    const event: QueuedEvent = {
      id: idempotencyKey,
      type,
      payload: { ...payload, idempotencyKey } as SessionStartPayload | SessionEndPayload,
      timestamp: Date.now(),
      retryCount: 0,
    };

    const queue = this.getQueue();
    queue.push(event);
    this.saveQueue(queue);

    console.log(`[OfflineQueue] Enqueued ${type} event: ${idempotencyKey}`);
    return idempotencyKey;
  }

  /**
   * Remove an event from the queue (on success).
   */
  dequeue(idempotencyKey: string): void {
    const queue = this.getQueue();
    const filtered = queue.filter((e) => e.id !== idempotencyKey);
    this.saveQueue(filtered);
    console.log(`[OfflineQueue] Dequeued event: ${idempotencyKey}`);
  }

  /**
   * Get the number of queued events.
   */
  getQueueSize(): number {
    return this.getQueue().length;
  }

  /**
   * Process all queued events.
   * Called on app foreground to reconcile with server.
   */
  async processQueue(): Promise<{ processed: number; failed: number }> {
    if (this.isProcessing) {
      console.log('[OfflineQueue] Already processing, skipping');
      return { processed: 0, failed: 0 };
    }

    this.isProcessing = true;
    let processed = 0;
    let failed = 0;

    try {
      const queue = this.getQueue();
      if (queue.length === 0) {
        return { processed: 0, failed: 0 };
      }

      console.log(`[OfflineQueue] Processing ${queue.length} queued events`);

      // Sort by timestamp to process in order
      const sorted = [...queue].sort((a, b) => a.timestamp - b.timestamp);

      for (const event of sorted) {
        try {
          await this.processEvent(event);
          this.dequeue(event.id);
          processed++;
        } catch (error) {
          console.error(`[OfflineQueue] Failed to process event ${event.id}:`, error);

          // Increment retry count
          event.retryCount++;

          if (event.retryCount >= MAX_RETRIES) {
            // Max retries reached, remove from queue
            console.warn(`[OfflineQueue] Max retries reached for ${event.id}, dropping event`);
            this.dequeue(event.id);
            failed++;
          } else {
            // Update retry count in queue
            const currentQueue = this.getQueue();
            const index = currentQueue.findIndex((e) => e.id === event.id);
            if (index !== -1) {
              currentQueue[index] = event;
              this.saveQueue(currentQueue);
            }
          }

          // Add delay before next event
          await this.delay(RETRY_DELAY_MS * event.retryCount);
        }
      }
    } finally {
      this.isProcessing = false;
    }

    console.log(`[OfflineQueue] Completed: ${processed} processed, ${failed} failed`);
    return { processed, failed };
  }

  /**
   * Process a single event.
   */
  private async processEvent(event: QueuedEvent): Promise<void> {
    switch (event.type) {
      case 'session_start': {
        const payload = event.payload as SessionStartPayload;
        await usageApi.startSession({
          source: payload.source,
          idempotencyKey: payload.idempotencyKey,
        });
        break;
      }
      case 'session_end': {
        const payload = event.payload as SessionEndPayload;
        await usageApi.endSession({
          sessionId: payload.sessionId,
          idempotencyKey: payload.idempotencyKey,
        });
        break;
      }
      default:
        console.warn(`[OfflineQueue] Unknown event type: ${event.type}`);
    }
  }

  /**
   * Clear all queued events (for testing/reset).
   */
  clearQueue(): void {
    mmkv.delete(QUEUE_KEY);
    console.log('[OfflineQueue] Queue cleared');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const offlineQueue = new OfflineEventQueue();
