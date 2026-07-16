import { devicesSchema, type Device } from '#shared/types';
import rawDevices from '../data/devices.json';

let cache: Device[] | null = null;

export function getAllDevices(): Device[] {
  if (!cache) cache = devicesSchema.parse(rawDevices)
  return cache
};

