// health check endpoint for network connectivity testing
export default defineEventHandler(async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})