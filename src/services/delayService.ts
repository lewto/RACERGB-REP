import { BehaviorSubject } from 'rxjs';

interface DelayedAction {
  id: string;
  type: 'flag' | 'status';
  action: () => Promise<void>;
  timestamp: number;
  executed: boolean;
}

class DelayService {
  private delay: number;
  private actions$ = new BehaviorSubject<DelayedAction[]>([]);
  private processingInterval: NodeJS.Timer | null = null;

  constructor() {
    // Get initial delay from localStorage or default to 5
    this.delay = parseInt(localStorage.getItem('broadcast_delay') || '5', 10);
    this.startProcessing();
  }

  setDelay(seconds: number) {
    this.delay = seconds;
    localStorage.setItem('broadcast_delay', seconds.toString());
    // Re-evaluate all pending actions with new delay
    this.processActions();
  }

  getDelay(): number {
    return this.delay;
  }

  private startProcessing() {
    // Check for actions to execute every 100ms
    this.processingInterval = setInterval(() => {
      this.processActions();
    }, 100);
  }

  private processActions() {
    const now = Date.now();
    const actions = this.actions$.value;
    const updatedActions = actions.map(action => {
      if (!action.executed && now >= action.timestamp + (this.delay * 1000)) {
        // Execute action and mark as executed
        action.action().catch(console.error);
        return { ...action, executed: true };
      }
      return action;
    });

    // Remove executed actions older than 1 minute
    const cleanedActions = updatedActions.filter(
      action => !action.executed || now - action.timestamp < 60000
    );

    if (cleanedActions.length !== actions.length) {
      this.actions$.next(cleanedActions);
    }
  }

  queueAction(type: 'flag' | 'status', action: () => Promise<void>) {
    const newAction: DelayedAction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      action,
      timestamp: Date.now(),
      executed: false
    };

    const actions = this.actions$.value;
    
    // Remove any pending actions of the same type
    const filteredActions = actions.filter(a => 
      a.type !== type || a.executed
    );

    this.actions$.next([...filteredActions, newAction]);
  }

  getPendingActions(): DelayedAction[] {
    return this.actions$.value.filter(action => !action.executed);
  }

  clearPendingActions() {
    this.actions$.next([]);
  }

  destroy() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    this.actions$.complete();
  }
}

export const delayService = new DelayService();