import type { Device } from '#shared/types';

export default defineEventHandler((event): Device => {
  const slug = getRouterParam(event, 'slug')
  const device = slug ? getDeviceBySlug(slug) : undefined

  if (!device) {
    throw createError({ statusCode: 404, statusMessage: 'Device not found' })
  }

  return device
});
