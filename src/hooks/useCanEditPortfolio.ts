'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { canEditPortfolio } from '@/actions/create-portfolio-actions';
import { User } from 'lucia';

export function useCanEditPortfolio(user: User | undefined) {
  const [canEdit, setCanEdit] = useState(false);
  const params = useParams();

  useEffect(() => {
    const checkEditPermission = async () => {
      if (user) {
        const routeName = params['route-name'] as string;
        const canEditResult = await canEditPortfolio(routeName);
        setCanEdit(canEditResult);
      }
    };
    checkEditPermission();
  }, [params, user]);

  return canEdit;
}