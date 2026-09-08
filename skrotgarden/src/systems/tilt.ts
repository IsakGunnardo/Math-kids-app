import type { DriveInput } from './physics.ts';

type PermissionRequester = { requestPermission?: () => Promise<'granted' | 'denied'> };

/** Lutning i grader innan gas/broms slår till. */
const DEAD_ZONE = 10;

/**
 * Lutningsstyrning: luta plattan framåt för gas, bakåt för broms.
 * iOS kräver att tillstånd begärs i ett pekar-event, därför är start() async.
 */
export class TiltControl {
  readonly input: DriveInput = { gas: false, brake: false };
  private listening = false;

  static supported(): boolean {
    return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
  }

  async start(): Promise<boolean> {
    if (!TiltControl.supported()) return false;
    const req = (DeviceOrientationEvent as unknown as PermissionRequester).requestPermission;
    if (typeof req === 'function') {
      try {
        if ((await req()) !== 'granted') return false;
      } catch {
        return false;
      }
    }
    window.addEventListener('deviceorientation', this.onOrientation);
    this.listening = true;
    return true;
  }

  stop() {
    window.removeEventListener('deviceorientation', this.onOrientation);
    this.listening = false;
    this.input.gas = false;
    this.input.brake = false;
  }

  get active() {
    return this.listening;
  }

  private onOrientation = (e: DeviceOrientationEvent) => {
    // I landskapsläge är det gamma som ändras när man tippar plattan mot/från sig.
    const landscape = window.innerWidth > window.innerHeight;
    let tilt = landscape ? (e.gamma ?? 0) : (e.beta ?? 0);
    const orientation = (screen.orientation?.type ?? '') as string;
    if (orientation.includes('landscape-secondary')) tilt = -tilt;
    // Plattan hålls normalt lite bakåtlutad; nollpunkten är därför runt 20°.
    const rel = landscape ? Math.abs(tilt) - 20 : tilt - 20;
    this.input.gas = rel < -DEAD_ZONE;
    this.input.brake = rel > DEAD_ZONE + 15;
  };
}
