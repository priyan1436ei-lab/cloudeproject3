'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cloud, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <Card className="max-w-md w-full p-8 glass-card border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 text-indigo-500 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Cloud className="h-5 w-5" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your email to receive a Firebase password reset link
          </p>
        </div>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 mx-auto" />
            <p>Password reset instructions have been dispatched to <strong>{email}</strong>.</p>
            <Link href="/login" className="inline-block text-xs font-semibold underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Account Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priyan@documind.cloud"
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              Send Reset Link
            </Button>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center text-xs text-slate-400 hover:text-foreground">
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
