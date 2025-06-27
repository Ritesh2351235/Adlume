"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ImageIcon, Edit, Download, Video, CreditCard, AlertTriangle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { ImageCanvas } from "@/components/image-editor/image-canvas";
import { SaveAssetButton } from "@/components/dashboard/save-asset-button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { calculateCredits, formatQuality, formatSize } from "@/lib/pricing";

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(32000, "Prompt is too long"),
  size: z.enum(["1024x1024", "1536x1024", "1024x1536"]),
  format: z.enum(["png", "jpeg", "webp"]),
  background: z.enum(["auto", "transparent", "opaque"]),
  quality: z.enum(["low", "medium", "high"]),
});

const editFormSchema = z.object({
  editPrompt: z.string().min(1, "Edit prompt is required").max(32000, "Prompt is too long"),
});

export default function GeneratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedAssetId, setGeneratedAssetId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [pendingFormData, setPendingFormData] = useState<z.infer<typeof formSchema> | null>(null);
  const [isCheckingCredits, setIsCheckingCredits] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      size: "1024x1024",
      format: "png",
      background: "auto",
      quality: "high",
    },
  });

  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      editPrompt: "",
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

  // Convert base64 data URL to File object
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const downloadImage = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `adcraft-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateVideoAd = () => {
    if (!imageUrl) return;

    // Use sessionStorage for faster data transfer and avoid URL length limits
    sessionStorage.setItem('generateVideoImage', imageUrl);

    // Show loading toast for immediate feedback
    toast({
      title: "Redirecting...",
      description: "Taking you to video generation with your image",
    });

    // Navigate to video ads page
    router.push('/dashboard/video-ads?from=generate');
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isCheckingCredits) return; // Prevent multiple submissions

    try {
      setIsCheckingCredits(true);

      // Calculate required credits
      const requiredCredits = calculateCredits(values.quality, values.size);

      if (!requiredCredits) {
        toast({
          title: "Error",
          description: "Invalid quality or size configuration",
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

      // Store form data and show confirmation dialog immediately
      setPendingFormData(values);
      setIsConfirmDialogOpen(true);
    } finally {
      setIsCheckingCredits(false);
    }
  }

  async function confirmGeneration() {
    if (!pendingFormData) return;

    try {
      setIsLoading(true);
      setImageUrl(null);
      setIsConfirmDialogOpen(false);

      const formData = new FormData();
      formData.append("prompt", pendingFormData.prompt);
      formData.append("size", pendingFormData.size);
      formData.append("format", pendingFormData.format);
      formData.append("background", pendingFormData.background);
      formData.append("quality", pendingFormData.quality);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(data.url);
      setGeneratedAssetId(data.generatedAssetId);

      // Update user credits after successful generation
      const requiredCredits = calculateCredits(pendingFormData.quality, pendingFormData.size);
      if (requiredCredits) {
        setUserCredits(prev => prev - requiredCredits);
      }

      toast({
        title: "Success",
        description: "Your image has been generated!",
      });
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPendingFormData(null);
    }
  }

  async function onEditSubmit(values: z.infer<typeof editFormSchema>) {
    if (!imageUrl) return;

    try {
      setIsEditing(true);

      const formData = new FormData();
      formData.append("prompt", values.editPrompt);
      formData.append("size", form.getValues("size"));
      formData.append("background", form.getValues("background"));

      // Convert the current image to a file
      const imageFile = dataURLtoFile(imageUrl, "current-image.png");
      formData.append("image", imageFile);

      // Add mask if available
      if (maskDataUrl) {
        const maskFile = dataURLtoFile(maskDataUrl, "mask.png");
        formData.append("mask", maskFile);
      }

      const response = await fetch("/api/edit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to edit image");
      }

      const data = await response.json();
      setImageUrl(data.url);
      setIsEditDialogOpen(false);
      setMaskDataUrl(null);
      editForm.reset();

      toast({
        title: "Success",
        description: "Your image has been edited!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to edit image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Generate Image</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Create stunning AI-generated images for your advertising campaigns
        </p>
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Credits available:</span>
            <span className="font-medium">{userCredits}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-2">
        <Card className="p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your prompt here..."
                        className="h-24 md:h-32 resize-none text-sm md:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-sm md:text-base">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1024x1024">Square (1024×1024)</SelectItem>
                          <SelectItem value="1536x1024">Landscape (1536×1024)</SelectItem>
                          <SelectItem value="1024x1536">Portrait (1024×1536)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-sm md:text-base">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">Background</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm md:text-base">
                          <SelectValue placeholder="Select background" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="transparent">Transparent</SelectItem>
                        <SelectItem value="opaque">Opaque</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs md:text-sm">
                      Transparent background requires PNG or WebP format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">Quality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm md:text-base">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs md:text-sm">
                      Higher quality takes longer to generate but produces better results
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading || isCheckingCredits}
                className="w-full text-sm md:text-base h-10 md:h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                    <span className="sm:hidden">Generating...</span>
                  </>
                ) : isCheckingCredits ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Checking Credits...</span>
                    <span className="sm:hidden">Checking...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Generate Image</span>
                    <span className="sm:hidden">Generate</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </Card>

        <div className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6">
            <div className="aspect-square rounded-lg border flex items-center justify-center">
              {imageUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageUrl}
                    alt="Generated image"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="mx-auto h-8 w-8 md:h-12 md:w-12 mb-2 opacity-50" />
                  <p className="text-sm md:text-base">Generated image will appear here</p>
                </div>
              )}
            </div>

            {imageUrl && (
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 text-sm md:text-base h-9 md:h-10">
                      <Edit className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Edit Image</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mx-3 sm:mx-0 sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-base md:text-lg">Edit Image</DialogTitle>
                      <DialogDescription className="text-sm md:text-base">
                        Use the drawing tools to select areas you want to edit, then describe the changes you want to make.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 md:space-y-6">
                      <ImageCanvas
                        imageUrl={imageUrl}
                        onMaskChange={setMaskDataUrl}
                        className="w-full"
                      />

                      <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                          <FormField
                            control={editForm.control}
                            name="editPrompt"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm md:text-base">Edit Instructions</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe what changes you want to make to the selected areas..."
                                    className="h-20 md:h-24 resize-none text-sm md:text-base"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs md:text-sm">
                                  {maskDataUrl
                                    ? "Areas marked in red will be edited according to your instructions."
                                    : "No areas selected. Use the brush tool above to select areas to edit, or leave blank to edit the entire image."
                                  }
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditDialogOpen(false);
                                setMaskDataUrl(null);
                              }}
                              className="flex-1 text-sm md:text-base h-9 md:h-10"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isEditing}
                              className="flex-1 text-sm md:text-base h-9 md:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                            >
                              {isEditing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Editing...
                                </>
                              ) : (
                                <>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Apply Edit
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={downloadImage} className="flex-1 text-sm md:text-base h-9 md:h-10">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                  <span className="sm:hidden">Download</span>
                </Button>

                <Button onClick={generateVideoAd} className="flex-1 text-sm md:text-base h-9 md:h-10 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700">
                  <Video className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create Video Ad</span>
                  <span className="sm:hidden">Video</span>
                </Button>

                {generatedAssetId && (
                  <SaveAssetButton
                    generatedAssetId={generatedAssetId}
                    userId="user-placeholder" // Will be handled by SaveAssetButton component
                    className="text-sm md:text-base h-9 md:h-10"
                  />
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Credit Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Confirm Image Generation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to generate this image? Credits will be deducted from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingFormData && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="font-medium">Generation Details:</div>
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Quality:</span> {formatQuality(pendingFormData.quality)}</div>
                  <div><span className="font-medium">Size:</span> {formatSize(pendingFormData.size)}</div>
                  <div><span className="font-medium">Format:</span> {pendingFormData.format.toUpperCase()}</div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800 font-medium mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Credit Usage
                </div>
                <div className="text-sm text-orange-700 space-y-1">
                  <div>
                    <span className="font-medium">Credits Required:</span> {calculateCredits(pendingFormData.quality, pendingFormData.size)} credits
                  </div>
                  <div>
                    <span className="font-medium">Current Balance:</span> {userCredits} credits
                  </div>
                  <div>
                    <span className="font-medium">Balance After:</span> {userCredits - (calculateCredits(pendingFormData.quality, pendingFormData.size) || 0)} credits
                  </div>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setPendingFormData(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmGeneration}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Confirm & Generate
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}