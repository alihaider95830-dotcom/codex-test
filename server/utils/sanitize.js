const sanitizeHtml = (html) => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  if (!html) return '';

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
};

module.exports = { sanitizeHtml };
