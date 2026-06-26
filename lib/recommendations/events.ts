import type { ConditionPreference } from "./types";

type EventType = "view" | "cart_add" | "cart_remove" | "purchase";

export interface UserEvent {
  type: EventType;
  productId: string;
  categories: string[];
  brand: string;
  condition?: string;
  price: number;
  timestamp: number;
}

// Store in sessionStorage (cleared when browser closes — no cookies needed)
class EventQueue {
  private key = "rec_events";

  push(event: Omit<UserEvent, "timestamp">): void {
    if (typeof window === "undefined") return;
    
    const events = this.getAll();
    events.push({ ...event, timestamp: Date.now() });
    // Keep last 50 events to stay lightweight
    sessionStorage.setItem(this.key, JSON.stringify(events.slice(-50)));
  }

  getAll(): UserEvent[] {
    if (typeof window === "undefined") return [];
    
    try {
      return JSON.parse(sessionStorage.getItem(this.key) ?? "[]");
    } catch {
      return [];
    }
  }

  derivePreferences(): {
    viewedCategories: string[];
    preferredBrands: string[];
    conditionPreference: ConditionPreference;
  } {
    const events = this.getAll();
    const recentViews = events.filter((e) => e.type === "view").slice(-10);

    const viewedCategories = [
      ...new Set(recentViews.map((e) => e.categories).flat()),
    ];
    const preferredBrands = [
      ...new Set(
        recentViews
          .slice(-3) // most recent 3
          .map((e) => e.brand)
      ),
    ];

    // Infer condition preference
    const conditionPreference = this.inferConditionPreference(
      recentViews.map((e) => ({ condition: e.condition } as any))
    );

    return {
      viewedCategories,
      preferredBrands,
      conditionPreference,
    };
  }

  private inferConditionPreference(
    viewedProducts: { condition?: string }[]
  ): ConditionPreference {
    if (viewedProducts.length < 3) return "mixed";
    const thriftCount = viewedProducts.filter(
      (p) =>
        p.condition === "good" ||
        p.condition === "fair" ||
        p.condition === "like-new"
    ).length;
    const newCount = viewedProducts.filter((p) => p.condition === "new").length;
    if (thriftCount / viewedProducts.length > 0.7) return "thrift";
    if (newCount / viewedProducts.length > 0.7) return "new";
    return "mixed";
  }

  clear(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(this.key);
  }
}

export const eventQueue = new EventQueue();
