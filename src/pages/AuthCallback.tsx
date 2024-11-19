import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { getCurrentUser } from '@/lib/auth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          const user = await getCurrentUser();
          
          if (user) {
            setUser(user);
            
            toast({
              title: 'Success',
              description: 'Successfully authenticated',
            });
            
            navigate('/');
          } else {
            throw new Error('No user data found');
          }
        } else {
          throw new Error('No session found');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: 'Error',
          description: 'Authentication failed. Please try again.',
          variant: 'destructive',
        });
        navigate('/login');
      }
    };

    processAuthCallback();
  }, [navigate, setUser, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}