'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, Check } from 'lucide-react';
import { getContactMessagesAdmin, markContactMessageReadAdmin } from '@/lib/actions/admin-actions';
import { toast } from 'sonner';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      const data = await getContactMessagesAdmin();
      setMessages(data);
    } catch {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id: string) => {
    setActioningId(id);
    try {
      await markContactMessageReadAdmin(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
      toast.success('Message marked as read');
    } catch {
      toast.error('Failed to update message');
    } finally {
      setActioningId(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1.5 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Contact Messages</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Inbound support and verification requests from the contact form
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-black">{messages.length}</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Total</p>
          </CardContent>
        </Card>
        <Card className={unreadCount > 0 ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-900/10' : ''}>
          <CardContent className="p-4 sm:pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">{unreadCount}</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-black">{messages.filter((m) => m.read).length}</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Read</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl sm:rounded-3xl border-border">
        <CardHeader className="p-4 sm:p-6 border-b border-border bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Inbox
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Messages submitted via the public contact page</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {loading ? (
            <div className="py-12 sm:py-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12 sm:py-16">No contact messages yet.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 transition-colors ${!message.read ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base">
                        {message.firstName} {message.lastName}
                      </h3>
                      {!message.read && (
                        <Badge className="bg-primary/15 text-primary text-[10px] px-2 py-0.5">New</Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{message.email}</p>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider">Subject</p>
                  <p className="font-semibold text-xs sm:text-sm mt-0.5">{message.subject}</p>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground break-words">{message.message}</p>
                {!message.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-xs w-fit"
                    disabled={actioningId === message.id}
                    onClick={() => handleMarkRead(message.id)}
                  >
                    {actioningId === message.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Mark as Read
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
