# 🎯 User Creation - API Payload Reference

## POST /sadmin/users

### Base Fields (All Users)
```json
{
  "name": "Full Name",                           // Required, string, max:255
  "email": "user@example.com",                   // Required, email, unique
  "role_id": "UUID-of-role",                     // Required, exists in roles table
  "password": "SecurePass123",                   // Required, min:6, uppercase+lowercase+number
  "password_confirmation": "SecurePass123",      // Required, must match password
  "phone": "09991234567"                         // Optional
}
```

---

## Student Role Payload
```json
{
  "name": "Juan Dela Cruz",
  "email": "juan@example.com",
  "role_id": "359f4170-235d-11f1-9647-10683825ce81",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "phone": "09991234567",
  "student_id": "2024-0001"                      // Required for Students
}
```

**Student Database Entry:**
- Creates record in `users` table
- Creates record in `student_csg_officers` table with student_id

---

## Ordinary Teacher Role Payload
```json
{
  "name": "Dr. Maria Santos",
  "email": "maria@example.com",
  "role_id": "459f4213-235d-11f1-9647-10683825ce81",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "phone": "09799179280",
  "employee_id": "EMP100",                       // Required for Teachers
  "specialization": "Mathematics",               // Optional
  "office_location": "Room 301"                  // Optional
}
```

**Teacher Database Entry:**
- Creates record in `users` table
- Creates record in `teacher_adviser` table with employee_id
- Sets `is_adviser = 0`

---

## Admin/Adviser Role Payload
```json
{
  "name": "Prof. Juan Reyes",
  "email": "juan.reyes@example.com",
  "role_id": "159ef712-235d-11f1-9647-10683825ce81",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "phone": "09696240168",
  "employee_id": "EMP101",                       // Required for Advisers
  "specialization": "Physics",                   // Optional
  "office_location": "Room 401"                  // Optional
}
```

**Adviser Database Entry:**
- Creates record in `users` table
- Creates record in `teacher_adviser` table with employee_id
- Sets `is_adviser = 1`

---

## Password Requirements
- Minimum 6 characters
- Must contain at least 1 uppercase letter (A-Z)
- Must contain at least 1 lowercase letter (a-z)
- Must contain at least 1 number (0-9)

✅ Valid Examples: `Password123`, `MyPass456`, `Secure999`
❌ Invalid Examples: `password123`, `Password`, `123456`

---

## Error Response Examples

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must contain at least one uppercase letter."]
  }
}
```

### Not Found Error (404)
```json
{
  "error": "Role not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to create user: <error details>"
}
```

---

## Success Response (201)
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "uuid-of-new-user",
    "name": "Full Name",
    "email": "user@example.com",
    "phone": "09991234567",
    "status": "active",
    "role": {
      "id": "uuid-of-role",
      "name": "Student/Ordinary Teacher/Admin/Adviser"
    },
    "createdAt": "Mar 19, 2026",
    "lastLogin": null
  }
}
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Email already exists | Use a unique email address |
| Student ID already exists | Use a unique student ID |
| Employee ID already exists | Use a unique employee ID |
| Password too weak | Add uppercase, lowercase, and numbers |
| Invalid role ID | Check that role_id exists in roles table |
| Missing required field | Ensure all marked fields are provided |
| Password mismatch | Ensure password_confirmation matches password |

