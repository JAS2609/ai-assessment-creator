'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore, JobStatus } from '@/store/assignmentStore';

export function useAssignmentSocket(assignmentId: string | null) {
  const { setJobStatus } = useAssignmentStore();
  const router = useRouter();

  useEffect(() => {
    if (!assignmentId) return;

    let intentionalClose = false;
    let finalStatus: JobStatus | null = null;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?id=${assignmentId}`
    );

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      finalStatus = msg.status;
      setJobStatus(msg.status as JobStatus);
      if (msg.status === 'done') {
        router.push(`/assignments/${assignmentId}/result`);
      }
    };

    ws.onerror = () => console.warn('WebSocket error');

    ws.onclose = () => {
      if (!intentionalClose && finalStatus !== 'done' && finalStatus !== 'failed') {
        setJobStatus('failed');
      }
    };

    return () => {
      intentionalClose = true;
      ws.close();
    };
  }, [assignmentId]);
}