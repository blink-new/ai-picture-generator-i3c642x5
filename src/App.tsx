import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import VideoGenerator from '@/components/VideoGenerator'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogIn } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleLogin = () => {
    blink.auth.login()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Welcome to AI Video Generator</h1>
                <p className="text-muted-foreground mt-2">
                  Sign in to start creating amazing AI-generated videos
                </p>
              </div>
              <Button onClick={handleLogin} className="w-full" size="lg">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <VideoGenerator />
      <Toaster position="top-right" />
    </>
  )
}

export default App