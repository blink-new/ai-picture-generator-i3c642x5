import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Download, Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react'
import { blink } from '@/blink/client'
import { toast } from 'react-hot-toast'

interface GeneratedImage {
  url: string
  id: string
}

const STYLE_PRESETS = [
  { value: 'realistic', label: 'Realistic', description: 'Photorealistic images' },
  { value: 'artistic', label: 'Artistic', description: 'Painterly and artistic style' },
  { value: 'cartoon', label: 'Cartoon', description: 'Fun cartoon illustrations' },
  { value: 'digital-art', label: 'Digital Art', description: 'Modern digital artwork' },
  { value: 'oil-painting', label: 'Oil Painting', description: 'Classic oil painting style' },
  { value: 'watercolor', label: 'Watercolor', description: 'Soft watercolor effect' },
]

const SIZE_OPTIONS = [
  { value: '1024x1024', label: 'Square (1024×1024)', aspect: 'square' },
  { value: '1536x1024', label: 'Landscape (1536×1024)', aspect: 'landscape' },
  { value: '1024x1536', label: 'Portrait (1024×1536)', aspect: 'portrait' },
]

const QUALITY_OPTIONS = [
  { value: 'auto', label: 'Auto', description: 'Balanced quality and speed' },
  { value: 'low', label: 'Low', description: 'Faster generation' },
  { value: 'medium', label: 'Medium', description: 'Good quality' },
  { value: 'high', label: 'High', description: 'Best quality' },
]

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('realistic')
  const [size, setSize] = useState('1024x1024')
  const [quality, setQuality] = useState('auto')
  const [numImages, setNumImages] = useState('2')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate images')
      return
    }

    setIsGenerating(true)
    try {
      // Enhance prompt with style
      const selectedStyle = STYLE_PRESETS.find(s => s.value === style)
      const enhancedPrompt = style === 'realistic' 
        ? prompt 
        : `${prompt}, ${selectedStyle?.description || style} style`

      const { data } = await blink.ai.generateImage({
        prompt: enhancedPrompt,
        size: size as '1024x1024' | '1536x1024' | '1024x1536',
        quality: quality as 'auto' | 'low' | 'medium' | 'high',
        n: parseInt(numImages),
        style: 'natural'
      })

      const images: GeneratedImage[] = data.map((img, index) => ({
        url: img.url,
        id: `${Date.now()}-${index}`
      }))

      setGeneratedImages(images)
      toast.success(`Generated ${images.length} image${images.length > 1 ? 's' : ''} successfully!`)
    } catch (error) {
      console.error('Error generating images:', error)
      toast.error('Failed to generate images. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-generated-image-${index + 1}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Image downloaded successfully!')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    }
  }

  const handleRegenerate = () => {
    setGeneratedImages([])
    handleGenerate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Picture Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with the power of AI. 
            Create professional-quality images in seconds.
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
                <label className="text-sm font-medium">Describe your image</label>
                <Textarea
                  placeholder="A majestic mountain landscape at sunset with golden light reflecting on a crystal clear lake..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be descriptive and specific for better results
                </p>
              </div>

              {/* Style Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Art Style</label>
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

              {/* Size and Quality Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Size</label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
              </div>

              {/* Number of Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Images</label>
                <Select value={numImages} onValueChange={setNumImages}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 image</SelectItem>
                    <SelectItem value="2">2 images</SelectItem>
                    <SelectItem value="3">3 images</SelectItem>
                    <SelectItem value="4">4 images</SelectItem>
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Images
                    </>
                  )}
                </Button>

                {generatedImages.length > 0 && (
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
                <ImageIcon className="h-5 w-5" />
                Generated Images
                {generatedImages.length > 0 && (
                  <Badge variant="secondary">{generatedImages.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Creating your images...</p>
                    <p className="text-sm text-muted-foreground">This may take a few moments</p>
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="grid gap-4">
                  {generatedImages.map((image, index) => (
                    <div key={image.id} className="group relative">
                      <div className="relative overflow-hidden rounded-lg border bg-muted">
                        <img
                          src={image.url}
                          alt={`Generated image ${index + 1}`}
                          className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              onClick={() => handleDownload(image.url, index)}
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
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">No images generated yet</p>
                    <p className="text-sm text-muted-foreground">
                      Enter a prompt and click generate to create your first image
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