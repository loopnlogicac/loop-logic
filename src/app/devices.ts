// Protection for premium videos: a device limit per account and a short viewer
// code shown in the moving watermark, so a screen recording can be traced back
// to the account that made it.
//
// A device is a random id the browser keeps (sent as the x-device header).
// Clearing it only makes the browser look like a new device, so it cannot be
// used to get round the limit; it uses up one of the account's slots instead.

import { createHash } from 'node:crypto';
import { AppError } from './service.ts';
import type { Store } from '../store/store.ts';

export interface Device { id: string; label: string; first: string; last: string }

/** Six characters that identify an account in a watermark without showing its email. */
export const viewerCode = (learnerId: string) => createHash('sha256').update(`ll-viewer:${learnerId}`).digest('hex').slice(0, 6).toUpperCase();

/** "Chrome on Android", "Safari on iPhone"… from a user-agent string. */
export function deviceLabel(ua: string): string {
  const s = ua || '';
  const os = /iPhone/.test(s) ? 'iPhone' : /iPad/.test(s) ? 'iPad' : /Android/.test(s) ? 'Android' : /Windows/.test(s) ? 'Windows' : /Mac OS X|Macintosh/.test(s) ? 'Mac' : /CrOS/.test(s) ? 'Chromebook' : /Linux/.test(s) ? 'Linux' : 'Unknown system';
  const br = /Edg\//.test(s) ? 'Edge' : /OPR\/|Opera/.test(s) ? 'Opera' : /SamsungBrowser/.test(s) ? 'Samsung Internet' : /Firefox\//.test(s) ? 'Firefox' : /Chrome\//.test(s) ? 'Chrome' : /Safari\//.test(s) ? 'Safari' : 'Browser';
  return `${br} on ${os}`;
}

const DEVICE_ID = /^[A-Za-z0-9_-]{8,64}$/;

export class DeviceGuard {
  private readonly store: Store;
  readonly max: number;
  private readonly now: () => Date;

  constructor(store: Store, opts: { max?: number; now?: () => Date } = {}) {
    this.store = store;
    this.max = Math.max(1, Math.min(10, Math.floor(opts.max ?? 2)));
    this.now = opts.now ?? (() => new Date());
  }

  async list(learnerId: string): Promise<Device[]> {
    const d = await this.store.getDoc('devices', learnerId).catch(() => undefined);
    return Array.isArray(d?.data.devices) ? (d!.data.devices as Device[]) : [];
  }

  /**
   * Lets this device play the account's premium videos, registering it if there is
   * a free slot. Throws device_limit when the account already uses its slots.
   */
  async check(learnerId: string, deviceIdIn: unknown, ua: string): Promise<Device> {
    const deviceId = typeof deviceIdIn === 'string' ? deviceIdIn : '';
    if (!DEVICE_ID.test(deviceId)) throw new AppError('device_missing', 400, 'Reload the page to watch this video.', undefined, 'ভিডিওটি দেখতে পেজটি আবার লোড করো।');
    const devices = await this.list(learnerId);
    const now = this.now().toISOString();
    const known = devices.find((d) => d.id === deviceId);
    if (known) {
      // Update "last used" at most every 10 minutes, so playing videos doesn't write on every click.
      if (Date.parse(now) - Date.parse(known.last) > 10 * 60_000) {
        known.last = now;
        await this.save(learnerId, devices);
      }
      return known;
    }
    if (devices.length >= this.max) {
      const names = devices.map((d) => d.label).join(', ');
      throw new AppError('device_limit', 403,
        `This account already watches on ${this.max} devices (${names}). Ask us to reset your devices if you changed phone or computer.`,
        { max: this.max, devices: devices.map((d) => ({ label: d.label, last: d.last })) },
        `এই অ্যাকাউন্ট ইতিমধ্যে ${this.max}টি ডিভাইসে দেখা হচ্ছে (${names})। ফোন বা কম্পিউটার বদলালে আমাদের বলো, ডিভাইস রিসেট করে দেব।`);
    }
    const device: Device = { id: deviceId, label: deviceLabel(ua), first: now, last: now };
    await this.save(learnerId, [...devices, device]);
    return device;
  }

  async reset(learnerId: string) {
    await this.store.deleteDoc('devices', learnerId).catch(() => undefined);
    return { ok: true };
  }

  private async save(learnerId: string, devices: Device[]) {
    await this.store.putDoc({ kind: 'devices', id: learnerId, data: { devices }, updatedAt: this.now().toISOString() });
  }
}
