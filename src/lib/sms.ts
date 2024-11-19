// Mock SMS service - Replace with actual API calls to your backend
export const sendSMS = async (to: string, message: string) => {
  // In production, this should make an API call to your backend
  // which will then use Twilio to send the SMS
  console.log('Sending SMS:', { to, message });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock success response
  return {
    status: 'sent',
    to,
    message,
  };
};