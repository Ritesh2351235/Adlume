"use client";

import { Progress } from "@/components/ui/progress";
import { Video, Sparkles, Music, Mic, Volume2 } from "lucide-react";

interface VideoPreviewProps {
  progress: number;
  isGeneratingAudio?: boolean;
  isMergingAudio?: boolean;
}

export function VideoPreview({ progress, isGeneratingAudio = false, isMergingAudio = false }: VideoPreviewProps) {
  const getStageText = () => {
    if (isGeneratingAudio) return "Generating AI voiceover...";
    if (isMergingAudio) return "Merging audio with video...";
    if (progress < 25) return "Analyzing image and prompt...";
    if (progress < 50) return "Generating video frames...";
    if (progress < 75) return "Adding effects and transitions...";
    if (progress < 90) return "Processing video quality...";
    return "Finalizing video...";
  };

  const getStageIcon = () => {
    if (isGeneratingAudio) return <Mic className="h-5 w-5 text-purple-500" />;
    if (isMergingAudio) return <Volume2 className="h-5 w-5 text-teal-500" />;
    if (progress < 25) return <Sparkles className="h-5 w-5 text-blue-500" />;
    if (progress < 50) return <Video className="h-5 w-5 text-purple-500" />;
    if (progress < 75) return <Sparkles className="h-5 w-5 text-green-500" />;
    if (progress < 90) return <Music className="h-5 w-5 text-orange-500" />;
    return <Mic className="h-5 w-5 text-teal-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video rounded-lg border bg-gradient-to-br from-purple-50 to-teal-50 dark:from-purple-950/20 dark:to-teal-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            {getStageIcon()}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Generating Your Video Ad</h3>
            <p className="text-sm text-muted-foreground">{getStageText()}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 25 ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={progress > 25 ? 'text-foreground' : 'text-muted-foreground'}>
            Image Analysis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 50 ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={progress > 50 ? 'text-foreground' : 'text-muted-foreground'}>
            Frame Generation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 75 ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={progress > 75 ? 'text-foreground' : 'text-muted-foreground'}>
            Effects & Transitions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 90 || isGeneratingAudio || isMergingAudio ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className={progress > 90 || isGeneratingAudio || isMergingAudio ? 'text-foreground' : 'text-muted-foreground'}>
            Audio Processing
          </span>
        </div>
      </div>
    </div>
  );
}