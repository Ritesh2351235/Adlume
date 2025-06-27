"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Video, Upload, Play, Download, Sparkles, Mic, Volume2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VideoPlayer } from "@/components/video-ads/video-player";
import { VideoPreview } from "@/components/video-ads/video-preview";
import { SaveAssetButton } from "@/components/dashboard/save-asset-button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { calculateVideoCredits, formatDuration, formatResolution, formatMotionMode } from "@/lib/pricing";
import { CreditCard } from "lucide-react";

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000, "Prompt is too long"),
  duration: z.enum(["5", "8"]),
  quality: z.enum(["360p", "540p", "720p", "1080p"]),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]),
  motionMode: z.enum(["normal", "smooth"]),
  style: z.enum(["None", "anime", "3d_animation", "clay", "cyberpunk", "comic"]),
  effect: z.enum([
    "None",
    "Let's YMCA!",
    "Subject 3 Fever",
    "Ghibli Live!",
    "Suit Swagger",
    "Muscle Surge",
    "360° Microwave",
    "Warmth of Jesus",
    "Emergency Beat",
    "Anything, Robot",
    "Kungfu Club",
    "Mint in Box",
    "Retro Anime Pop",
    "Vogue Walk",
    "Mega Dive",
    "Evil Trigger"
  ]),
  productImage: z.instanceof(File).optional(),
  // Audio fields
  enableAudio: z.boolean().default(false),
  audioScript: z.string().optional(),
  voiceId: z.enum(["Rachel", "Drew", "Clyde", "Paul", "Domi", "Dave", "Fin", "Sarah", "Antoni"]).default("Rachel"),
  audioModel: z.enum(["eleven_multilingual_v2", "eleven_turbo_v2"]).default("eleven_multilingual_v2"),
});

export default function VideoAdsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generatedAssetId, setGeneratedAssetId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [pendingFormData, setPendingFormData] = useState<z.infer<typeof formSchema> | null>(null);
  const [isCheckingCredits, setIsCheckingCredits] = useState(false);
  const { toast } = useToast();
  const { user, isLoaded } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      duration: "5",
      quality: "540p",
      aspectRatio: "16:9",
      motionMode: "normal",
      style: "None",
      effect: "None",
      enableAudio: false,
      audioScript: "",
      voiceId: "Rachel",
      audioModel: "eleven_multilingual_v2",
    },
  });

  // Fetch user credits on component mount
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserCredits();
    }
  }, [isLoaded, user]);

  const fetchUserCredits = async () => {
    try {
      const response = await fetch(`/api/user-credits?userId=${encodeURIComponent(user!.id)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserCredits(data.credits);
        }
      }
    } catch (error) {
      console.error('Error fetching user credits:', error);
    }
  };

  // Check if there's an image passed from the generate page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);

      // Check for sessionStorage first (faster method)
      if (urlParams.get('from') === 'generate') {
        const imageData = sessionStorage.getItem('generateVideoImage');
        if (imageData) {
          setPreviewImage(imageData);
          form.setValue("prompt", "Create an engaging product advertisement showcasing this product with smooth camera movements and professional lighting");
          // Clean up sessionStorage
          sessionStorage.removeItem('generateVideoImage');
          return;
        }
      }

      // Fallback to URL parameter (legacy method)
      const imageData = urlParams.get('image');
      if (imageData) {
        setPreviewImage(decodeURIComponent(imageData));
        form.setValue("prompt", "Create an engaging product advertisement showcasing this product with smooth camera movements and professional lighting");
      }
    }
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("productImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateProgress = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 2000);
    return interval;
  };

  const generateAudio = async (text: string, voice: string, model: string) => {
    try {
      setIsGeneratingAudio(true);

      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice,
          model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const data = await response.json();
      setAudioUrl(data.audioData);

      toast({
        title: "Success",
        description: "Audio generated successfully!",
      });

      return data.audioData;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isCheckingCredits) return; // Prevent multiple submissions
    
    try {
      setIsCheckingCredits(true);
      
      // Calculate required credits for video generation based on selected options
      const requiredCredits = calculateVideoCredits(
        `${values.duration}s` as "5s" | "8s",
        values.quality,
        values.motionMode
      );
      
      if (!requiredCredits) {
        toast({
          title: "Error",
          description: "Unable to calculate video generation cost for the selected options",
          variant: "destructive",
        });
        return;
      }

      // Get the latest user credits
      let currentCredits = userCredits;
      
      // If credits haven't been loaded yet or are 0, fetch them first
      if (currentCredits === 0 && isLoaded && user) {
        try {
          const response = await fetch(`/api/user-credits?userId=${encodeURIComponent(user.id)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              currentCredits = data.credits;
              setUserCredits(currentCredits);
            }
          }
        } catch (error) {
          console.error('Error fetching user credits:', error);
        }
      }

      // Check if user has sufficient credits
      if (currentCredits < requiredCredits) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${requiredCredits} credits but only have ${currentCredits}. Please purchase more credits.`,
          variant: "destructive",
        });
        return;
      }

      // Store form data and show confirmation dialog
      setPendingFormData(values);
      setIsConfirmDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check credits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingCredits(false);
    }
  }

  async function confirmGeneration() {
    if (!pendingFormData) return;
    
    try {
      setIsLoading(true);
      setIsGenerating(true);
      setVideoUrl(null);
      setAudioUrl(null);
      setIsConfirmDialogOpen(false);

      const progressInterval = simulateProgress();

      const formData = new FormData();
      formData.append("prompt", pendingFormData.prompt);
      formData.append("duration", pendingFormData.duration);
      formData.append("quality", pendingFormData.quality);
      formData.append("aspectRatio", pendingFormData.aspectRatio);
      formData.append("motionMode", pendingFormData.motionMode);
      formData.append("style", pendingFormData.style);
      formData.append("effect", pendingFormData.effect);

      if (pendingFormData.productImage) {
        formData.append("productImage", pendingFormData.productImage);
      }
      if (previewImage && !pendingFormData.productImage) {
        formData.append("imageData", previewImage);
      }

      // Generate video first
      const videoResponse = await fetch("/api/generate-video", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!videoResponse.ok) {
        const errorData = await videoResponse.json();
        throw new Error(errorData.error || "Failed to generate video");
      }

      const videoData = await videoResponse.json();
      let finalVideoUrl = videoData.videoUrl;

      // Generate audio if enabled
      if (pendingFormData.enableAudio && pendingFormData.audioScript) {
        await generateAudio(
          pendingFormData.audioScript,
          pendingFormData.voiceId,
          pendingFormData.audioModel
        );
      }

      setVideoUrl(finalVideoUrl);
      setGeneratedAssetId(videoData.generatedAssetId);

      // Update user credits after successful generation
      const creditsUsed = calculateVideoCredits(
        `${pendingFormData.duration}s` as "5s" | "8s",
        pendingFormData.quality,
        pendingFormData.motionMode
      ) || 0;
      const newCredits = userCredits - creditsUsed;
      setUserCredits(newCredits);

      toast({
        title: "Success",
        description: pendingFormData.enableAudio ? "Your video ad with audio has been generated!" : "Your video ad has been generated!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      setGenerationProgress(0);
      setPendingFormData(null);
    }
  }

  const downloadVideo = () => {
    if (!videoUrl) return;

    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `adcraft-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const playAudioPreview = () => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.play();
  };

  // Validation for duration and quality combinations
  const selectedDuration = form.watch("duration");
  const selectedQuality = form.watch("quality");
  const selectedMotionMode = form.watch("motionMode");
  const enableAudio = form.watch("enableAudio");

  // 1080p doesn't support 8 second duration or smooth motion
  const isDurationDisabled = selectedQuality === "1080p" && selectedDuration === "8";
  const isMotionDisabled = selectedQuality === "1080p" || selectedDuration === "8";

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <Card className="p-6 sticky top-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your video ad..."
                          className="resize-none h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific about what you want to see in your video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "8") {
                              form.setValue("motionMode", "normal");
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 seconds</SelectItem>
                            <SelectItem
                              value="8"
                              disabled={selectedQuality === "1080p"}
                            >
                              8 seconds {selectedQuality === "1080p" ? "(Not available for 1080p)" : "(2x cost)"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quality</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "1080p") {
                              form.setValue("duration", "5");
                              form.setValue("motionMode", "normal");
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="360p">360p</SelectItem>
                            <SelectItem value="540p">540p</SelectItem>
                            <SelectItem value="720p">720p (Higher cost)</SelectItem>
                            <SelectItem value="1080p">1080p (Highest cost)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="aspectRatio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aspect Ratio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                            <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                            <SelectItem value="1:1">1:1 (Square)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motionMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motion Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select motion mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem
                              value="smooth"
                              disabled={isMotionDisabled}
                            >
                              Smooth {isMotionDisabled ? "(Not available)" : "(2x cost)"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Smooth motion generates more frames for fluid movement
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!previewImage && (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a product image to use as the first frame of your video
                    </FormDescription>
                  </FormItem>
                )}

                {/* Audio Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <FormField
                      control={form.control}
                      name="enableAudio"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center gap-2">
                              <Mic className="h-4 w-4" />
                              Add AI Voiceover
                            </FormLabel>
                            <FormDescription>
                              Generate professional voiceover using AI text-to-speech
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Collapsible Audio Content */}
                  <div className={`transition-all duration-300 ease-in-out ${enableAudio ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
                    } overflow-y-auto`}>
                    <div className="px-4 pb-4 border-t space-y-4">
                      <Alert className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Audio generation is available, but video-audio merging requires server-side processing.
                        </AlertDescription>
                      </Alert>

                      <FormField
                        control={form.control}
                        name="audioScript"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voiceover Script</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter the text you want to be spoken..."
                                className="h-16 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Keep it concise. Ideal: 10-30 words for a 5-second video.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="voiceId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Voice</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select voice" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Rachel">Rachel (Female)</SelectItem>
                                  <SelectItem value="Drew">Drew (Male)</SelectItem>
                                  <SelectItem value="Clyde">Clyde (Male)</SelectItem>
                                  <SelectItem value="Paul">Paul (Male)</SelectItem>
                                  <SelectItem value="Domi">Domi (Female)</SelectItem>
                                  <SelectItem value="Dave">Dave (Male, British)</SelectItem>
                                  <SelectItem value="Fin">Fin (Male, Irish)</SelectItem>
                                  <SelectItem value="Sarah">Sarah (Female)</SelectItem>
                                  <SelectItem value="Antoni">Antoni (Male)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="audioModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Audio Quality</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select quality" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="eleven_multilingual_v2">High Quality</SelectItem>
                                  <SelectItem value="eleven_turbo_v2">Fast Generation</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {audioUrl && (
                        <div className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">Audio preview ready</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={playAudioPreview}
                            className="ml-auto"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Play
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading || isGeneratingAudio || isCheckingCredits} className="w-full">
                  {isCheckingCredits ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Credits...
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isGeneratingAudio ? "Generating Audio..." : "Generating Video..."}
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Generate Video Ad ({
                        calculateVideoCredits(
                          `${selectedDuration}s` as "5s" | "8s",
                          selectedQuality,
                          selectedMotionMode
                        ) || "—"
                      } Credits)
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </Card>
        </div>

        <div className="space-y-4">
          {previewImage && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Product Image</h3>
              <div className="aspect-square rounded-lg border overflow-hidden">
                <img
                  src={previewImage}
                  alt="Product image"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This image will be used as the first frame of your video
              </p>
            </Card>
          )}

          {isGenerating && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Generation Progress</h3>
              <VideoPreview
                progress={generationProgress}
                isGeneratingAudio={isGeneratingAudio}
                isMergingAudio={false}
              />
            </Card>
          )}

          <Card className="p-4 sticky top-6">
            <h3 className="font-semibold mb-2">Video Preview</h3>
            <div className="aspect-video rounded-lg border flex items-center justify-center bg-muted">
              {videoUrl ? (
                <VideoPlayer videoUrl={videoUrl} />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Video className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Generated video will appear here</p>
                </div>
              )}
            </div>

            {videoUrl && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" onClick={downloadVideo} className="flex-1 min-w-[140px]">
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </Button>

                {audioUrl && (
                  <Button variant="outline" onClick={playAudioPreview} className="flex-1 min-w-[120px]">
                    <Play className="mr-2 h-4 w-4" />
                    Play Audio
                  </Button>
                )}

                {generatedAssetId && (
                  <SaveAssetButton
                    generatedAssetId={generatedAssetId}
                    userId="user-placeholder" // Will be handled by SaveAssetButton component
                    className="min-w-[100px]"
                  />
                )}
              </div>
            )}
          </Card>

          {audioUrl && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Audio Preview</h3>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Generated Voiceover</p>
                  <p className="text-sm text-muted-foreground">Click play to preview the audio</p>
                </div>
                <Button onClick={playAudioPreview} variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Credit Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Confirm Video Generation
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Generation Details:</div>
              <div className="text-sm text-muted-foreground">
                • Video Duration: {pendingFormData ? formatDuration(`${pendingFormData.duration}s`) : "—"}
              </div>
              <div className="text-sm text-muted-foreground">
                • Quality: {pendingFormData ? formatResolution(pendingFormData.quality) : "—"}
              </div>
              <div className="text-sm text-muted-foreground">
                • Motion Mode: {pendingFormData ? formatMotionMode(pendingFormData.motionMode) : "—"}
              </div>
              <div className="text-sm text-muted-foreground">
                • Aspect Ratio: {pendingFormData?.aspectRatio}
              </div>
              {pendingFormData?.enableAudio && (
                <div className="text-sm text-muted-foreground">
                  • With Audio: Yes ({pendingFormData?.voiceId})
                </div>
              )}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cost:</span>
                <span className="font-medium">
                  {pendingFormData ? calculateVideoCredits(
                    `${pendingFormData.duration}s` as "5s" | "8s",
                    pendingFormData.quality,
                    pendingFormData.motionMode
                  ) : 0} credits
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current Balance:</span>
                <span>{userCredits} credits</span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>Balance After:</span>
                <span>
                  {userCredits - (pendingFormData ? calculateVideoCredits(
                    `${pendingFormData.duration}s` as "5s" | "8s",
                    pendingFormData.quality,
                    pendingFormData.motionMode
                  ) || 0 : 0)} credits
                </span>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGeneration}>
              Generate Video
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}