/*
 * Helper functions to validate user information (i.e., Name, Email,
 * Password) format during login and registration.
 */


export function validateRegistrationFormat(name: string, email: string, password: string): string | null
{
    if (!name || !email || !password) {
        return 'Name, email and password are required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Email format is invalid.';
    }
  
    if (password.length < 8) {
      return 'Password should be at least 8 characters long.';
    }
  
    return null; // No validation errors
}

export function validateLoginFormat(email: string, password: string): string | null
{
    if (!email || !password) {
        return 'Email and password are required.';
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Email format is invalid.';
    }
  
    return null; // No validation errors
}
