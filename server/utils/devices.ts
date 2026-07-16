import { devicesSchema, type Device, type DeviceQuery } from '#shared/types';
import rawDevices from '../data/devices.json';

let cache: Device[] | null = null;

export function getAllDevices(): Device[] {
  if (!cache) cache = devicesSchema.parse(rawDevices)
  return cache
};

export function getDeviceBySlug(slug: string): Device | undefined {
  return getAllDevices().find((device) => device.slug === slug)
}

export function queryDevices(query: DeviceQuery): Device[] {
  let items = getAllDevices()

  if (query.brand) {
    items = items.filter((device) => device.brand.toLowerCase() === query.brand!.toLowerCase())
  }
  if (query.minPrice !== undefined) {
    items = items.filter((device) => device.priceMDL >= query.minPrice!)
  }
  if (query.maxPrice !== undefined) {
    items = items.filter((device) => device.priceMDL <= query.maxPrice!)
  }

  if (query.sort === 'price-asc') {
    items = [...items].sort((deviceA, deviceB) => deviceA.priceMDL - deviceB.priceMDL)
  } else if (query.sort === 'price-desc') {
    items = [...items].sort((deviceA, deviceB) => deviceB.priceMDL - deviceA.priceMDL)
  }

  return items
}

export function getFacets() {
  const all = getAllDevices()
  const brands = [...new Set(all.map((device) => device.brand))].sort()
  const prices = all.map((device) => device.priceMDL)
  return {
    brands,
    priceBounds: { min: Math.min(...prices), max: Math.max(...prices) },
  }
}