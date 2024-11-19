import { useQuery, useMutation } from '@tanstack/react-query';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from './use-toast';

export function useCompany() {
  const { toast } = useToast();

  const { data: company } = useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const companyId = localStorage.getItem('companyId');
      if (!companyId) return null;

      const docRef = doc(db, 'companies', companyId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Company not found');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    },
    retry: false
  });

  const updateCompany = useMutation({
    mutationFn: async (updates: any) => {
      const companyId = localStorage.getItem('companyId');
      if (!companyId) throw new Error('No company ID found');

      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });

      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Company settings updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    company,
    updateCompany: updateCompany.mutate,
    isLoading: updateCompany.isLoading,
  };
}