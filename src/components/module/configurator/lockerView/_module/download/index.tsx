"use client";
import { useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import JSZip from "jszip";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import * as THREE from "three";
import { configuratorControlSelector, saveImageAction } from "../../../../../../store/configuratorControl";
import {
  configuratorSelector,
  setLockerWallImage,
  setLockerwallSaved,
  updateAvailableImageSave,
} from "../../../../../../store/configurator";
import { severalImagePositions } from "../../../../../../utils/constant";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";

const defaultPosition: [number, number, number] = [1, 0.2, 0];
const defaultRotation: [number, number, number] = [0, Math.PI / 2, 0];
const defaultQuaternion: [number, number, number, number] = [0, 0.7071, 0, 0.7071];

const QUALITY_SETTINGS = {
  high: { width: 3840, height: 2160, pixelRatio: 3 },
  medium: { width: 1920, height: 1080, pixelRatio: 2 },
  low: { width: 1280, height: 720, pixelRatio: 1 },
  ultraLow: { width: 800, height: 600, pixelRatio: 1 },
  emergency: { width: 400, height: 300, pixelRatio: 1 },
};

const detectSystemCapabilities = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext;
    if (!gl) return "emergency";

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    const memory = typeof (navigator as any).deviceMemory === "number" ? (navigator as any).deviceMemory : 8;

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod/.test(userAgent);

    // Detect Mac devices and M-series chips
    const isMac = /macintosh|mac os x/.test(userAgent);
    const isMSeries =
      isMac &&
      // Direct detection methods for M-series
      userAgent.includes("mac") &&
      // M-series Macs typically have very high texture sizes
      (maxTextureSize >= 16384 ||
        // Check for Apple Silicon indicators in user agent or high-end specs
        (maxTextureSize >= 8192 && memory >= 8));

    // M-series chips are extremely powerful - always high quality
    if (isMSeries) {
      console.log("Detected M-series Mac - using high quality settings");
      return "high";
    }

    // Intel Macs - still capable but vary more
    const isIntelMac = isMac && !isMSeries;

    // More specific GPU detection - avoid flagging modern Mac integrated graphics as low-end
    const isLowEndGPU =
      userAgent.includes("intel hd") ||
      userAgent.includes("intel uhd 6") || // UHD 600 series are lower end
      (userAgent.includes("intel") && !isMac); // Intel integrated on non-Mac

    // Handle Intel Macs specially
    if (isIntelMac && maxTextureSize >= 2048 && memory >= 4) {
      if (maxTextureSize >= 8192 && memory >= 8) return "high";
      if (maxTextureSize >= 4096 || memory >= 6) return "medium";
      return "low"; // But don't show warning for Intel Macs either
    }

    // Handle other Mac devices (shouldn't happen, but just in case)
    if (isMac && maxTextureSize >= 2048) {
      return maxTextureSize >= 4096 ? "medium" : "low";
    }

    // Original logic for non-Mac devices
    if (isMobile || memory < 2 || maxTextureSize < 1024) return "emergency";
    if (memory < 4 || isLowEndGPU || maxTextureSize < 2048 || maxRenderbufferSize < 2048) return "ultraLow";
    if (memory < 6 || maxTextureSize < 4096) return "low";
    if (maxTextureSize < 8192) return "medium";
    return "high";
  } catch {
    return "emergency";
  }
};

const showLowEndDeviceAlert = (capability: string) => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMac = /macintosh|mac os x/.test(userAgent);

  // Skip warning for Mac devices entirely
  if (isMac) return;

  const messages = {
    emergency:
      "Your device has very limited graphics capabilities. Images will be exported at very low quality (400x300) to prevent errors.",
    ultraLow:
      "Your device has limited graphics capabilities. Images will be exported at reduced quality (800x600) for better compatibility.",
    low: "Your device has moderate graphics capabilities. Images will be exported at standard quality (1280x720).",
  };

  const message = messages[capability as keyof typeof messages];
  if (message) {
    alert(`⚠️ Low-End Device Detected\n\n${message}\n\nClick OK to continue with the export.`);
  }
};

const isWebGLContextLost = (gl: THREE.WebGLRenderer): boolean => {
  try {
    const context = gl.getContext();
    return context.isContextLost && context.isContextLost();
  } catch {
    return true;
  }
};

const captureImage = async (
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  baseCam: THREE.Camera,
  pos: [number, number, number],
  rot: [number, number, number],
  settings: { width: number; height: number; pixelRatio: number },
  retryCount = 0,
): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isWebGLContextLost(gl)) {
        throw new Error("WebGL context is lost");
      }

      const maxSize = gl.capabilities.maxTextureSize;
      const adjustedWidth = Math.min(settings.width, maxSize);
      const adjustedHeight = Math.min(settings.height, maxSize);

      if (adjustedWidth !== settings.width || adjustedHeight !== settings.height) {
        console.warn(
          `Adjusted render size from ${settings.width}x${settings.height} to ${adjustedWidth}x${adjustedHeight}`,
        );
      }

      const renderTarget = new THREE.WebGLRenderTarget(adjustedWidth, adjustedHeight, {
        colorSpace: THREE.SRGBColorSpace,
        type: THREE.UnsignedByteType,
        format: THREE.RGBAFormat,
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        stencilBuffer: false,
        depthBuffer: true,
      });

      const cam = baseCam.clone();
      cam.position.set(...pos);
      cam.rotation.set(...rot);
      cam.updateMatrixWorld();

      const originalSize = gl.getSize(new THREE.Vector2());
      const originalPixelRatio = gl.getPixelRatio();
      const originalRenderTarget = gl.getRenderTarget();
      const originalToneMapping = gl.toneMapping;
      const originalToneMappingExposure = gl.toneMappingExposure;
      const originalOutputColorSpace = gl.outputColorSpace;

      try {
        gl.setSize(adjustedWidth, adjustedHeight);
        gl.setPixelRatio(1);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.setRenderTarget(renderTarget);

        gl.clear();
        gl.render(scene, cam);

        await new Promise((res) => {
          requestAnimationFrame(() => {
            setTimeout(res, 16);
          });
        });

        const error = gl.getContext().getError();
        if (error !== gl.getContext().NO_ERROR) {
          throw new Error(`WebGL error during rendering: ${error}`);
        }

        const pixels = new Uint8Array(adjustedWidth * adjustedHeight * 4);
        try {
          gl.readRenderTargetPixels(renderTarget, 0, 0, adjustedWidth, adjustedHeight, pixels);
        } catch (readError) {
          throw new Error(`Failed to read render target pixels: ${readError}`);
        }

        const canvas = document.createElement("canvas");
        canvas.width = adjustedWidth;
        canvas.height = adjustedHeight;

        const ctx = canvas.getContext("2d", {
          alpha: true,
          colorSpace: "srgb",
          willReadFrequently: false,
        });

        if (!ctx) {
          throw new Error("Could not get 2D canvas context");
        }

        const imgData = ctx.createImageData(adjustedWidth, adjustedHeight);

        for (let y = 0; y < adjustedHeight; y++) {
          for (let x = 0; x < adjustedWidth; x++) {
            const srcIdx = (y * adjustedWidth + x) * 4;
            const dstIdx = ((adjustedHeight - y - 1) * adjustedWidth + x) * 4;

            imgData.data[dstIdx] = pixels[srcIdx];
            imgData.data[dstIdx + 1] = pixels[srcIdx + 1];
            imgData.data[dstIdx + 2] = pixels[srcIdx + 2];
            imgData.data[dstIdx + 3] = pixels[srcIdx + 3];
          }
        }

        ctx.putImageData(imgData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert canvas to Blob"));
              return;
            }
            resolve(blob);
          },
          "image/png",
          1.0,
        );
      } finally {
        gl.setRenderTarget(originalRenderTarget);
        gl.setSize(originalSize.x, originalSize.y);
        gl.setPixelRatio(originalPixelRatio);
        gl.toneMapping = originalToneMapping;
        gl.toneMappingExposure = originalToneMappingExposure;
        gl.outputColorSpace = originalOutputColorSpace;

        renderTarget.dispose();
      }
    } catch (err) {
      console.error(`Capture failed (attempt ${retryCount + 1}):`, err);

      if (retryCount < 2) {
        const lowerSettings = {
          width: Math.max(400, Math.floor(settings.width * 0.7)),
          height: Math.max(300, Math.floor(settings.height * 0.7)),
          pixelRatio: 1,
        };

        console.log(`Retrying with lower quality: ${lowerSettings.width}x${lowerSettings.height}`);

        setTimeout(() => {
          captureImage(gl, scene, baseCam, pos, rot, lowerSettings, retryCount + 1)
            .then(resolve)
            .catch(reject);
        }, 100);

        return;
      }

      reject(err);
    }
  });
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const DownLoad = () => {
  const dispatch = useAppDispatch();
  const { imageDownloadType, isSaveSeveralImage } = useAppSelector(configuratorControlSelector);
  const { imageStored } = useAppSelector(configuratorSelector);
  const { gl, camera, scene } = useThree();

  const saveImages = useCallback(
    async (type: string) => {
      if (!gl || !camera || !scene) return;

      try {
        const capability = detectSystemCapabilities();

        if (["emergency", "ultraLow", "low"].includes(capability)) {
          showLowEndDeviceAlert(capability);
        }

        const settings = QUALITY_SETTINGS[capability as keyof typeof QUALITY_SETTINGS];
        const views = isSaveSeveralImage
          ? severalImagePositions
          : [{ position: defaultPosition, rotation: defaultRotation }];

        const zip = new JSZip();
        const pdf = new jsPDF("landscape", "mm", "a4");
        const imagesForPDF: string[] = [];

        console.log(`Exporting ${views.length} views at ${capability} quality (${settings.width}x${settings.height})`);

        for (let i = 0; i < views.length; i++) {
          try {
            console.log(`Capturing view ${i + 1}/${views.length}`);
            const blob = await captureImage(gl, scene, camera, views[i].position, views[i].rotation, settings);

            if (type === "pdf") {
              const b64 = await blobToBase64(blob);
              imagesForPDF.push(b64);
            } else {
              zip.file(`view${i + 1}.${type}`, blob);
            }
          } catch (err) {
            console.error(`Failed to capture view ${i + 1}:`, err);
            alert(`Failed to capture view ${i + 1}. ${err instanceof Error ? err.message : "Unknown error"}`);
          }
        }

        if (type === "pdf" && imagesForPDF.length > 0) {
          const pageW = pdf.internal.pageSize.getWidth();
          const pageH = pdf.internal.pageSize.getHeight();
          const imgAR = settings.width / settings.height;
          let imgW = pageW - 20;
          let imgH = imgW / imgAR;
          if (imgH > pageH - 20) {
            imgH = pageH - 20;
            imgW = imgH * imgAR;
          }
          const offsetX = (pageW - imgW) / 2;
          const offsetY = (pageH - imgH) / 2;

          imagesForPDF.forEach((b64, i) => {
            if (i > 0) pdf.addPage();
            pdf.addImage(b64, "PNG", offsetX, offsetY, imgW, imgH);
          });

          pdf.save(`download-${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`);
        } else if (type !== "pdf") {
          const zipBlob = await zip.generateAsync({ type: "blob" });
          const a = document.createElement("a");
          const url = URL.createObjectURL(zipBlob);
          a.href = url;
          a.download = `download-${format(new Date(), "yyyyMMdd_HHmmss")}.zip`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Export failed:", error);
        alert(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        dispatch(saveImageAction(undefined));
      }
    },
    [gl, camera, scene, isSaveSeveralImage, dispatch],
  );

  const saveConfigImage = useCallback(async () => {
    if (!gl || !camera || !scene) return;

    try {
      const capability = detectSystemCapabilities();

      if (["emergency", "ultraLow", "low"].includes(capability)) {
        showLowEndDeviceAlert(capability);
      }

      const isLow = capability === "ultraLow" || capability === "low" || capability === "emergency";
      const width = capability === "emergency" ? 400 : isLow ? 800 : 1200;
      const height = capability === "emergency" ? 300 : isLow ? 533 : 800;

      console.log(`Saving config image at ${capability} quality (${width}x${height})`);

      const cam = camera.clone();
      cam.position.set(...defaultPosition);
      cam.rotation.set(...defaultRotation);
      cam.quaternion.set(...defaultQuaternion);
      cam.updateProjectionMatrix();

      if (isWebGLContextLost(gl)) {
        throw new Error("WebGL context is lost. Please refresh the page and try again.");
      }

      const renderTarget = new THREE.WebGLRenderTarget(width, height, {
        colorSpace: THREE.SRGBColorSpace,
        type: THREE.UnsignedByteType,
        format: THREE.RGBAFormat,
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        stencilBuffer: false,
        depthBuffer: true,
      });

      const originalSize = gl.getSize(new THREE.Vector2());
      const originalRenderTarget = gl.getRenderTarget();
      const originalToneMapping = gl.toneMapping;
      const originalToneMappingExposure = gl.toneMappingExposure;
      const originalOutputColorSpace = gl.outputColorSpace;

      try {
        gl.setSize(width, height);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.setRenderTarget(renderTarget);
        gl.clear();
        gl.render(scene, cam);

        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 16);
          });
        });

        const error = gl.getContext().getError();
        if (error !== gl.getContext().NO_ERROR) {
          throw new Error(`WebGL error during config image rendering: ${error}`);
        }

        const pixels = new Uint8Array(width * height * 4);
        gl.readRenderTargetPixels(renderTarget, 0, 0, width, height, pixels);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", {
          alpha: true,
          colorSpace: "srgb",
          willReadFrequently: false,
        });

        if (!ctx) {
          throw new Error("Could not get 2D canvas context for config image");
        }

        const imgData = ctx.createImageData(width, height);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const j = ((height - y - 1) * width + x) * 4;
            imgData.data[j] = pixels[i];
            imgData.data[j + 1] = pixels[i + 1];
            imgData.data[j + 2] = pixels[i + 2];
            imgData.data[j + 3] = pixels[i + 3];
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const base64 = canvas.toDataURL("image/png").split(",")[1];

        dispatch(setLockerWallImage(base64));
        dispatch(setLockerwallSaved(true));
        dispatch(updateAvailableImageSave(false));
      } finally {
        gl.setRenderTarget(originalRenderTarget);
        gl.setSize(originalSize.x, originalSize.y);
        gl.toneMapping = originalToneMapping;
        gl.toneMappingExposure = originalToneMappingExposure;
        gl.outputColorSpace = originalOutputColorSpace;
        renderTarget.dispose();
      }
    } catch (error) {
      console.error("Config image save failed:", error);
      alert(`Failed to save configuration image: ${error instanceof Error ? error.message : "Unknown error"}`);
      dispatch(updateAvailableImageSave(false));
    }
  }, [gl, camera, scene, dispatch]);

  useEffect(() => {
    if (imageDownloadType) {
      saveImages(imageDownloadType.toLowerCase());
    }
  }, [imageDownloadType, saveImages]);

  useEffect(() => {
    if (imageStored) {
      saveConfigImage();
    }
  }, [imageStored, saveConfigImage]);

  return null;
};

export default DownLoad;
