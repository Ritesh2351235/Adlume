"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Eraser, Paintbrush, RotateCcw, Download } from "lucide-react";

interface ImageCanvasProps {
  imageUrl: string;
  onMaskChange: (maskDataUrl: string | null) => void;
  className?: string;
}

export function ImageCanvas({ imageUrl, onMaskChange, className }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !maskCanvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw the original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Overlay the mask with semi-transparent red
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const maskImageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const data = maskImageData.data;
    
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) { // If alpha > 0 (mask exists)
        const x = (i / 4) % maskCanvas.width;
        const y = Math.floor((i / 4) / maskCanvas.width);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, []);

  const drawOnCanvas = useCallback((x: number, y: number, isErasing: boolean = false) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Redraw the main canvas with the updated mask
    redrawCanvas();

    // Update the mask data
    const maskDataUrl = maskCanvas.toDataURL('image/png');
    onMaskChange(maskDataUrl);
  }, [brushSize, onMaskChange, redrawCanvas]);

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);
    drawOnCanvas(x, y, tool === 'eraser');
  }, [getCanvasCoordinates, drawOnCanvas, tool]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoordinates(e);
    drawOnCanvas(x, y, tool === 'eraser');
  }, [isDrawing, getCanvasCoordinates, drawOnCanvas, tool]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    redrawCanvas();
    onMaskChange(null);
  }, [onMaskChange, redrawCanvas]);

  const downloadMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const link = document.createElement('a');
    link.download = 'mask.png';
    link.href = maskCanvas.toDataURL();
    link.click();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    setIsLoading(true);
    setImageLoaded(false);

    const img = new Image();
    
    // Don't set crossOrigin for data URLs
    if (!imageUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.onload = () => {
      // Set canvas dimensions to match image
      const maxWidth = 800;
      const maxHeight = 600;
      
      let { width, height } = img;
      
      // Scale down if image is too large
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;

      const ctx = canvas.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');
      
      if (ctx && maskCtx) {
        // Draw the original image
        ctx.drawImage(img, 0, 0, width, height);

        // Initialize mask canvas with transparent background
        maskCtx.clearRect(0, 0, width, height);
        
        imageRef.current = img;
        setImageLoaded(true);
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      console.error('Failed to load image');
      setIsLoading(false);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading image...</p>
        </div>
      </div>
    );
  }

  if (!imageLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">Failed to load image. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tools */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg flex-wrap">
        <div className="flex gap-2">
          <Button
            variant={tool === 'brush' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('brush')}
          >
            <Paintbrush className="h-4 w-4 mr-2" />
            Brush
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
          >
            <Eraser className="h-4 w-4 mr-2" />
            Eraser
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-32">
          <Label htmlFor="brush-size" className="text-sm whitespace-nowrap">Size:</Label>
          <Slider
            id="brush-size"
            min={5}
            max={50}
            step={1}
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            className="flex-1 max-w-32"
          />
          <span className="text-sm text-muted-foreground w-8">{brushSize}</span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearMask}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={downloadMask}>
            <Download className="h-4 w-4 mr-2" />
            Mask
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border rounded-lg overflow-hidden bg-white flex justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: tool === 'brush' ? 'crosshair' : 'grab'
          }}
        />
        <canvas
          ref={maskCanvasRef}
          className="absolute top-0 left-0 pointer-events-none opacity-0"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Use the brush tool to select areas you want to edit. The selected areas will appear with a red overlay.
      </p>
    </div>
  );
}