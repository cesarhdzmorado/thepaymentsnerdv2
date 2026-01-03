#!/bin/bash

# Test Email Sender Script
# Usage: ./scripts/sendTestEmail.sh [email@example.com]

# Default email if none provided
EMAIL="${1:-cesc_haz@hotmail.es}"
SECRET="2E2MlFu0WzDtdVFtk3Gk8MqPhMY56JwT"

echo "📧 Sending test email to: $EMAIL"
echo ""

# Send the request
RESPONSE=$(curl -s "http://localhost:3000/api/test-email?to=$EMAIL&secret=$SECRET")

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Test email sent successfully!"
  echo ""
  echo "$RESPONSE" | grep -o '"message":"[^"]*"' | sed 's/"message":"\(.*\)"/\1/'
else
  echo "❌ Failed to send test email"
  echo ""
  echo "$RESPONSE"
fi
