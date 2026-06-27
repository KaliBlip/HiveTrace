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
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">
          Inbound support and verification requests from the contact form
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-black">{messages.length}</p>
            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Total Messages</p>
          </CardContent>
        </Card>
        <Card className={unreadCount > 0 ? 'border-amber-200 bg-amber-50/50' : ''}>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-black text-amber-600">{unreadCount}</p>
            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-black">{messages.filter((m) => m.read).length}</p>
            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Read</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Inbox
          </CardTitle>
          <CardDescription>Messages submitted via the public contact page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No contact messages yet.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-2xl p-5 space-y-3 ${!message.read ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">
                        {message.firstName} {message.lastName}
                      </h3>
                      {!message.read && (
                        <Badge className="bg-primary/15 text-primary text-[10px]">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Subject</p>
                  <p className="font-semibold">{message.subject}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{message.message}</p>
                {!message.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={actioningId === message.id}
                    onClick={() => handleMarkRead(message.id)}
                  >
                    {actioningId === message.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
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
