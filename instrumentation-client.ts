// Initialize analytics before the app starts
console.log('Analytics initialized')

// Set up global error tracking
window.addEventListener('error', (event) => {
  // Send to your error tracking service
  console.error('Global error:', event.error)
  
  // You can send this to an external service like Sentry, LogRocket, etc.
  // Example: Sentry.captureException(event.error)
})

// Set up unhandled promise rejection tracking
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  
  // You can send this to an external service
  // Example: Sentry.captureException(event.reason)
})
