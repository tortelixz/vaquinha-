// Meta Pixel & Conversions API (CAPI) Integration Engine

export const META_PIXEL_ID = "1441255181536689";
export const META_CAPI_ACCESS_TOKEN = "EAAd9XrlRU6MBS7GhK7kFGgDS2ZB2YhROBrGZAFZCg7JHJb1NXChtvhfhrmrxozSJJmePVl90WbtJnB9ZCwh1oqsB18f2VtXZBb2GkZA7Onqfs0UqOglK2Mas19Ie5Ad1gTUnqDt7sfPZA3CkFMZAmTzftqE9PRojM21CxZAtMcugwbV0WI5I8ZAZBZBd2qzNytc8bgZDZD";

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

// Utility to get cookie by name (_fbp, _fbc)
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Generates unique Event ID for client + CAPI deduplication
export function generateEventId(prefix: string = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize Meta Pixel in browser DOM
export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;

  if (!window.fbq) {
    const fbqFn: any = function (...args: any[]) {
      if (fbqFn.callMethod) {
        fbqFn.callMethod.apply(fbqFn, args);
      } else {
        fbqFn.queue.push(args);
      }
    };
    window.fbq = fbqFn;
    window._fbq = fbqFn;
    fbqFn.push = fbqFn;
    fbqFn.loaded = true;
    fbqFn.version = '2.0';
    fbqFn.queue = [];

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  try {
    window.fbq('init', META_PIXEL_ID);
    trackMetaEvent('PageView');
    trackMetaEvent('ViewContent', {
      content_name: 'Campanha Bem-Estar - Neuza e Filhos',
      content_category: 'Saúde / Alimentação',
      content_type: 'product',
      currency: 'BRL',
      value: 50.00
    });
  } catch (err) {
    console.warn('Meta Pixel initialization note:', err);
  }
}

// Sends dual event to both Meta Pixel (client) and Meta Conversions API (CAPI Graph API) with deduplication
export async function trackMetaEvent(
  eventName: string,
  customData: Record<string, any> = {},
  providedEventId?: string
): Promise<void> {
  const eventId = providedEventId || generateEventId(eventName.toLowerCase());

  // 1. Fire Client-side Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', eventName, customData, { eventID: eventId });
    } catch (e) {
      console.warn('Meta Pixel client track error:', e);
    }
  }

  // 2. Fire Server-side Conversions API (CAPI) directly to Meta Graph API
  try {
    const eventTime = Math.floor(Date.now() / 1000);
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const sourceUrl = typeof window !== 'undefined' ? window.location.href : '';
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: eventId,
          event_source_url: sourceUrl,
          action_source: 'website',
          user_data: {
            client_user_agent: userAgent,
            ...(fbp ? { fbp } : {}),
            ...(fbc ? { fbc } : {}),
          },
          custom_data: {
            ...customData,
          },
        },
      ],
    };

    fetch(
      `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_CAPI_ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }
    ).catch(() => {
      // Non-blocking background fetch catch
    });
  } catch (err) {
    console.warn('CAPI dispatch note:', err);
  }
}
