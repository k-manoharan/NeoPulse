import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrentDate(): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date().toLocaleDateString('en-US', options);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function estimateRemainingTime(batteryPercentage: number): string {
  // Assume 100% battery lasts 14 hours
  const remainingHours = Math.round((batteryPercentage / 100) * 14);
  
  if (remainingHours <= 1) {
    return "Less than 1 hour";
  }
  return `~${remainingHours} hours`;
}

export function getWeightDescription(weight: number): string {
  if (weight < 2) return "Light load";
  if (weight < 4) return "Moderate load";
  return "Heavy load";
}

export function getStatusLevel(value: number, type: 'battery' | 'weight'): 'high' | 'medium' | 'low' {
  if (type === 'battery') {
    if (value > 60) return 'high';
    if (value > 20) return 'medium';
    return 'low';
  } else { // weight
    // For weight, lower is better (less strain)
    if (value < 2) return 'high';
    if (value < 4) return 'medium';
    return 'low';
  }
}
