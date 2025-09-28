# Gemini AI Chatbot Setup Guide

## Getting Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select your Google Cloud project (or create a new one)
   - Copy the generated API key

3. **Update the Code**
   - Open `chatbot.js`
   - Replace `'YOUR_GEMINI_API_KEY'` with your actual API key
   - Example: `this.apiKey = 'AIzaSyC1234567890abcdefghijklmnop';`

## Features Included

### Text Chat Features
- ✅ Real-time messaging with Gemini AI
- ✅ Property-specific context and knowledge
- ✅ Professional responses about Pakistani property law
- ✅ Contact number integration (03490417705)
- ✅ Typing indicators and smooth animations
- ✅ Chat history persistence
- ✅ Message formatting with links and emphasis

### Voice Chat Features
- ✅ Speech-to-text input (Web Speech API)
- ✅ Text-to-speech responses (Speech Synthesis API)
- ✅ Voice activation button
- ✅ Visual feedback during voice input
- ✅ Cross-browser compatibility

### AI Assistant Capabilities
- 🏠 Property verification guidance
- 📋 Legal document assistance
- 💰 Financial calculations help
- 🏛️ Pakistani property law information
- 🔍 Property search assistance
- 📞 Direct connection to consultation services
- 🌍 Multi-city coverage information

### Integration Features
- 🔗 Seamless integration with existing calculators
- 🔔 Smart notifications for user assistance
- 📱 Mobile-responsive design
- ♿ Accessibility features
- 💾 Local storage for chat history
- 🎨 Consistent design with site theme

## Browser Compatibility

### Voice Features Support
- ✅ Chrome/Chromium browsers (full support)
- ✅ Edge (full support)
- ⚠️ Firefox (limited speech synthesis)
- ⚠️ Safari (limited speech recognition)
- ❌ Internet Explorer (not supported)

### Fallback Options
- Text chat works in all modern browsers
- Voice features gracefully degrade to text-only
- Clear error messages for unsupported features

## Customization Options

### Personality & Responses
- Modify the `propertyContext` in `callGeminiAPI()` method
- Adjust response tone and expertise level
- Add specific company policies or procedures

### Visual Customization
- Update colors in the chatbot HTML structure
- Modify animations and transitions
- Change avatar icons and styling

### Voice Settings
- Adjust speech rate, pitch, and volume in `speakText()` method
- Select different voice profiles
- Configure language and accent preferences

## Security Considerations

### API Key Protection
- Never commit API keys to version control
- Use environment variables in production
- Implement rate limiting for API calls
- Monitor API usage and costs

### Data Privacy
- Chat history stored locally only
- No sensitive data sent to external servers
- Clear chat option for user privacy
- GDPR compliance considerations

## Troubleshooting

### Common Issues
1. **API Key Error**: Ensure key is correctly set and has proper permissions
2. **Voice Not Working**: Check browser compatibility and microphone permissions
3. **Slow Responses**: Monitor API rate limits and network connectivity
4. **Mobile Issues**: Test touch interactions and responsive design

### Debug Mode
- Open browser console to see detailed logs
- Check network tab for API request/response details
- Use browser's speech recognition debugging tools

## Production Deployment

### Environment Setup
```javascript
// Use environment variables
this.apiKey = process.env.GEMINI_API_KEY || 'fallback-key';
```

### Performance Optimization
- Implement request caching
- Add loading states for better UX
- Optimize for mobile networks
- Consider CDN for static assets

### Monitoring
- Track API usage and costs
- Monitor user engagement metrics
- Log errors for debugging
- Implement user feedback collection

## Contact Integration

All contact references have been updated to: **03490417705**

The AI assistant will automatically provide this number when users need direct consultation or have complex queries that require human expertise.