import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Download, Sparkles, Video as VideoIcon, Wand2, Play, Pause } from 'lucide-react'
import { blink } from '@/blink/client'
import { toast } from 'react-hot-toast'

interface GeneratedVideo {
  url: string
  id: string
}

const STYLE_PRESETS = [
  { value: 'cinematic', label: 'Cinematic', description: 'Movie-like quality with dramatic lighting' },
  { value: 'documentary', label: 'Documentary', description: 'Realistic documentary style' },
  { value: 'animation', label: 'Animation', description: 'Animated cartoon style' },
  { value: 'artistic', label: 'Artistic', description: 'Creative and artistic visuals' },
  { value: 'commercial', label: 'Commercial', description: 'Professional commercial look' },
  { value: 'vintage', label: 'Vintage', description: 'Retro and nostalgic feel' },
]

const DURATION_OPTIONS = [
  { value: '3', label: '3 seconds', description: 'Quick clip' },
  { value: '5', label: '5 seconds', description: 'Standard length' },
  { value: '10', label: '10 seconds', description: 'Extended clip' },
]

const ASPECT_RATIO_OPTIONS = [
  { value: '16:9', label: 'Landscape (16:9)', description: 'Widescreen format' },
  { value: '9:16', label: 'Portrait (9:16)', description: 'Mobile/vertical format' },
  { value: '1:1', label: 'Square (1:1)', description: 'Social media format' },
]

const QUALITY_OPTIONS = [
  { value: 'auto', label: 'Auto', description: 'Balanced quality and speed' },
  { value: 'standard', label: 'Standard', description: 'Good quality' },
  { value: 'high', label: 'High', description: 'Best quality' },
]

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [duration, setDuration] = useState('5')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [quality, setQuality] = useState('auto')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([])
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate a video')
      return
    }

    setIsGenerating(true)
    try {
      // Enhance prompt with style and duration
      const selectedStyle = STYLE_PRESETS.find(s => s.value === style)
      const enhancedPrompt = `${prompt}, ${selectedStyle?.description || style} style, ${duration} seconds duration, ${aspectRatio} aspect ratio`

      // For now, we'll simulate video generation since actual video generation APIs are complex
      // In a real implementation, you'd use services like RunwayML, Pika Labs, or similar
      await new Promise(resolve => setTimeout(resolve, 8000)) // Simulate generation time

      // Simulate a generated video URL (in real implementation, this would come from the API)
      const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      
      const video: GeneratedVideo = {
        url: mockVideoUrl,
        id: `${Date.now()}`
      }

      setGeneratedVideos([video])
      toast.success('Video generated successfully!')
    } catch (error) {
      console.error('Error generating video:', error)
      toast.error('Failed to generate video. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (videoUrl: string, index: number) => {
    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-generated-video-${index + 1}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Video downloaded successfully!')
    } catch (error) {
      console.error('Error downloading video:', error)
      toast.error('Failed to download video')
    }
  }

  const handleRegenerate = () => {
    setGeneratedVideos([])
    handleGenerate()
  }

  const toggleVideoPlay = (videoId: string) => {
    const videoElement = document.getElementById(`video-${videoId}`) as HTMLVideoElement
    if (videoElement) {
      if (playingVideo === videoId) {
        videoElement.pause()
        setPlayingVideo(null)
      } else {
        // Pause all other videos
        generatedVideos.forEach(video => {
          if (video.id !== videoId) {
            const otherVideo = document.getElementById(`video-${video.id}`) as HTMLVideoElement
            if (otherVideo) otherVideo.pause()
          }
        })
        videoElement.play()
        setPlayingVideo(videoId)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <VideoIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Video Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning videos with the power of AI. 
            Create professional-quality videos in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe your video</label>
                <Textarea
                  placeholder="A serene ocean wave crashing against rocky cliffs at golden hour, with seagulls flying overhead..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be descriptive about motion, lighting, and atmosphere for better results
                </p>
              </div>

              {/* Style Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLE_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div>
                          <div className="font-medium">{preset.label}</div>
                          <div className="text-xs text-muted-foreground">{preset.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration and Aspect Ratio Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Aspect Ratio</label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIO_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <div className="space-y-3">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <VideoIcon className="mr-2 h-5 w-5" />
                      Generate Video
                    </>
                  )}
                </Button>

                {generatedVideos.length > 0 && (
                  <Button 
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" />
                Generated Videos
                {generatedVideos.length > 0 && (
                  <Badge variant="secondary">{generatedVideos.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <VideoIcon className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Creating your video...</p>
                    <p className="text-sm text-muted-foreground">This may take several minutes</p>
                  </div>
                </div>
              ) : generatedVideos.length > 0 ? (
                <div className="grid gap-4">
                  {generatedVideos.map((video, index) => (
                    <div key={video.id} className="group relative">
                      <div className="relative overflow-hidden rounded-lg border bg-muted">
                        <video
                          id={`video-${video.id}`}
                          src={video.url}
                          className="w-full h-auto object-cover"
                          controls={false}
                          loop
                          muted
                          onPlay={() => setPlayingVideo(video.id)}
                          onPause={() => setPlayingVideo(null)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                          {/* Play/Pause Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button
                              size="lg"
                              onClick={() => toggleVideoPlay(video.id)}
                              className="bg-white/90 text-black hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {playingVideo === video.id ? (
                                <Pause className="h-6 w-6" />
                              ) : (
                                <Play className="h-6 w-6" />
                              )}
                            </Button>
                          </div>
                          {/* Download Button */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              onClick={() => handleDownload(video.url, index)}
                              className="bg-white/90 text-black hover:bg-white"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="p-4 rounded-full bg-muted">
                    <VideoIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">No videos generated yet</p>
                    <p className="text-sm text-muted-foreground">
                      Enter a prompt and click generate to create your first video
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}