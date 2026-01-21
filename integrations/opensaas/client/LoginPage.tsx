import React from 'react'
import { LoginForm } from 'wasp/client/auth'

export default function LoginPage() {
    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>تسجيل الدخول</h1>
            <LoginForm />
        </div>
    )
}
